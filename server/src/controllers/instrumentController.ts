import { db } from '../db'
import AsyncHandler from 'express-async-handler'

/**
 * @desc all instruments from instruments table
 * @route /instrument/all
 */
const allInstruments = AsyncHandler(async (_, res) => {
    const instruments = await db.instrument.findMany()
    console.log('/instruments/all success')
    res.status(200).json(instruments)
})

export { allInstruments }