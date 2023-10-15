import WebSocket from 'ws'
import { allInstrumentsMethod, updateInstrumentPrices } from '../controllers/instrumentController'
import { Server } from 'socket.io'
import { dbHealthCheck } from '../utils'
import priceAlertsManager from './PriceAlertsManager'
import { sendMessage } from '../sms'

export type LatestPrices = { [symbol: string]: string }

/**
 * @dev the `connectToExchange` function is there so we can preemptively close and reopen the connection before the 24hr mark at which we would be disconnected
 * @dev binance websocket rules:
 * - a single connection is valid for 24hr. after 24hr expect to be disconnected
 * - rate limits: 300 connection attempts / 5 min
 * @dev for price alerts, we keep an in memory store and check the symbol for any price alerts we need to send
 */
export const setupPriceUpdates = async (io: Server) => {
    console.log(new Date().toISOString(), 'starting price updates... ')

    let exchangeSocket: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null

    const baseUrl = 'wss://data-stream.binance.vision'
    const streamName = '@aggTrade'

    const latestPrices: LatestPrices = {} // in-memory latest prices to update instruments in db

    await dbHealthCheck() // health check for db before running
    await priceAlertsManager.syncPriceAlerts() // before running, sync up price alerts

    const connectToExchange = async () => {
        console.log(new Date().toISOString(), 'starting connectToExchange...')

        if (exchangeSocket) {
            exchangeSocket.removeAllListeners()
            exchangeSocket.close()
            exchangeSocket = null
        }

        const dbInstruments = await allInstrumentsMethod() // all instruments from db

        // instrumentMap to match symbol to id
        const instrumentMap: { [symbol: string]: number } = {}
        dbInstruments.forEach((instrument) => {
            instrumentMap[instrument.symbol] = instrument.id
        })

        // get the connection url from the symbols
        const subscribeString = dbInstruments.map((instrument) => `${instrument.symbol.toLowerCase()}${streamName}`).join('/')

        // create connection
        exchangeSocket = new WebSocket(`${baseUrl}/stream?streams=${subscribeString}`)

        // connection to server open
        exchangeSocket.on('open', () => {
            console.log(new Date().toISOString(), 'Connected to Exchange websocket')

            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout)
            }
            reconnectTimeout = setTimeout(() => {
                if (exchangeSocket) {
                    exchangeSocket.close()
                }
            }, 12 * 60 * 60 * 1000)
        })

        // process messages
        exchangeSocket.on('message', (data) => {
            const stringData = (typeof data === 'string') ? data : data.toString();
            const parsedData = JSON.parse(stringData)

            if (parsedData && typeof parsedData === 'object' && parsedData.data) {
                const { s: symbol, p: price } = parsedData.data

                if (symbol && typeof symbol === 'string' && price && typeof price === 'string') {
                    latestPrices[symbol] = price // update in-memory latest prices

                    // check symbol and price against price alerts 
                    const symbolPriceAlerts = priceAlertsManager.getPriceAlerts(symbol)
                    /** @dev @todo may want to optimize.. lots of priceAlerts could be an issue */
                    symbolPriceAlerts.forEach((priceAlert) => {
                        if ((priceAlert.alert_type === 'ABOVE' && Number(price) >= Number(priceAlert.target_price)) || (priceAlert.alert_type === 'BELOW' && Number(price) <= Number(priceAlert.target_price))) {
                            // send sms
                            sendMessage(priceAlert.id, symbol, Number(priceAlert.target_price), Number(price), priceAlert.alert_type, priceAlert.phone_number)
                        }
                    })

                    const id = instrumentMap[symbol] // get id from symbol

                    // emit priceUpdate to client
                    io.emit('priceUpdate', {
                        id,
                        price,
                    })
                } else {
                    console.log("Received unexpected data format", { parsedData })
                }
            } else {
                console.log('no parsedData', { parsedData })
            }
        })

        // error messages
        exchangeSocket.on('error', (error) => {
            console.error('Error from Exchange WebSocket:', error)
        })

        // closed connection
        exchangeSocket.on('close', (code, reason) => {
            console.log(new Date().toISOString(), `Exchange WebSocket closed - Code: ${code}, Reason: ${reason}`)

            // schedule reconnection immediately
            setTimeout(connectToExchange, 1000)
        })
    }

    // initial connection
    connectToExchange()

    // update db instrument prices every 5 min
    setInterval(() => updateInstrumentPrices(latestPrices), 60 * 5000)
}
