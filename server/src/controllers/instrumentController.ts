import { db } from '../db'
import AsyncHandler from 'express-async-handler'
import { LatestPrices } from '../priceUpdates'

/** updates instrument prices in db */
const updateInstrumentPrices = async (latestPrices: LatestPrices) => {
    const updateOperations = []

    for (const symbol in latestPrices) {
        const price = latestPrices[symbol]

        updateOperations.push(
            db.instrument.update({
                where: { symbol },
                data: {
                    current_price: price,
                }
            })
        )
    }

    try {
        await db.$transaction(updateOperations)
    } catch (err) {
        console.log(err)
        throw new Error('error updating instrument prices')
    }
}

/** finds all instruments in db */
const allInstrumentsMethod = async () => {
    try {
        const instruments = await db.instrument.findMany()
        return instruments
    } catch (err) {
        console.log(err)
        throw new Error('error getting instruments')
    }
}

/**
 * @desc all instruments from instruments table
 * @route /instrument/all
 */
const getAllInstruments = AsyncHandler(async (_, res) => {
    const instruments = await allInstrumentsMethod()
    console.log('/instruments/all success')
    res.status(200).json(instruments)
})

export { getAllInstruments, allInstrumentsMethod, updateInstrumentPrices }