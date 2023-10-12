import WebSocket from 'ws'
import { allInstrumentsMethod, updateInstrumentPrices } from '../controllers/instrumentController'
import { Server } from 'socket.io'
import { dbHealthCheck } from '../utils'

export type LatestPrices = { [symbol: string]: string }

/**
 * @todo handle connection disconnecting after 24hr
 * @dev binance websocket rules:
 * - a single connection is valid for 24hr. after 24hr expect to be disconnected
 * - rate limits: 300 connection attempts / 5 min
 */
export const setupPriceUpdates = async (io: Server) => {
    console.log('starting price updates... ')

    /** health check for db before running */
    await dbHealthCheck()

    const baseUrl = 'wss://data-stream.binance.vision'
    const streamName = '@aggTrade'

    const dbInstruments = await allInstrumentsMethod() // all instruments from db
    // instrumentMap to match symbol to id
    const instrumentMap: { [symbol: string]: number } = {}
    dbInstruments.forEach((instrument) => {
        instrumentMap[instrument.symbol] = instrument.id
    })
    // in-memory latest prices to update instruments in db
    const latestPrices: LatestPrices = {}

    // get the connection url from the symbols
    const symbolsWithParam = dbInstruments.map((instrument) => `${instrument.symbol.toLowerCase()}${streamName}`)
    const subscribeString = symbolsWithParam.join('/')

    // create connection
    const binanceSocket = new WebSocket(`${baseUrl}/stream?streams=${subscribeString}`)

    /** connection to server */
    binanceSocket.on('open', () => {
        console.log('Connected to Binance websocket')
    })

    /** process messages */
    binanceSocket.on('message', (data) => {
        const stringData = (typeof data === 'string') ? data : data.toString();
        const parsedData = JSON.parse(stringData)

        if (parsedData && typeof parsedData === 'object' && parsedData.data) {
            const { s: symbol, p: price } = parsedData.data

            if (symbol && typeof symbol === 'string' && price && typeof price === 'string') {
                const id = instrumentMap[symbol]

                latestPrices[symbol] = price // update in-memory latest prices

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

    /** error messages */
    binanceSocket.on('error', (error) => {
        console.error('Error from Binance WebSocket:', error)
    })

    /** closed connection */
    binanceSocket.on('close', (code, reason) => {
        console.log(`Binance WebSocket closed - Code: ${code}, Reason: ${reason}`)
    })

    /** update db instrument prices every 5 min */
    setInterval(() => updateInstrumentPrices(latestPrices), 60 * 5000)
}
