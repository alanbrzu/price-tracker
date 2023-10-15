import { db } from "../db"
import AsyncHandler from 'express-async-handler'
import priceAlertsManager from "../priceUpdates/PriceAlertsManager"

/** @returns user price alerts + instrument */
const userPriceAlertsMethod = async (user_id: number) => {
    try {
        const alerts = await db.priceAlert.findMany({
            where: { user_id },
            include: { instrument: true }
        })

        return alerts
    } catch (err) {
        console.log(err)
        throw new Error('couldnt get user price alerts')
    }
}

/**
 * @route GET /price_alert/:user_id
 * @desc get a user's price alerts
 */
const getUserPriceAlerts = AsyncHandler(async (req, res) => {
    const user_id = parseInt(req.params.user_id)

    const userPriceAlerts = await userPriceAlertsMethod(user_id)

    if (userPriceAlerts) {
        console.log('/price_alert/:user_id success')
        res.status(200).json(userPriceAlerts)
    } else {
        console.log('/price_alert/:user_id error finding price alerts')
        res.status(204).json([])
    }
})

/**
 * @route POST /price_alert/add
 * @desc add a price alert
 */
const addPriceAlert = AsyncHandler(async (req, res) => {
    const { user_id, instrument_id, target_price, alert_type, phone_number } = req.body

    const user = await db.user.findUnique({ where: { id: user_id } })
    const instrument = await db.instrument.findUnique({ where: { id: instrument_id } })

    if (!user || !instrument) {
        res.status(400).json('User or instrument not found')
        throw new Error('User or instrument not found')
    }

    // check if there is phone number in user.. if not, add it to the user
    const phoneNumberRegex = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/
    if (user.phone_number === null) {
        // check the formatting
        if (phoneNumberRegex.test(phone_number)) {
            await db.user.update({
                where: { id: user_id },
                data: {
                    phone_number
                }
            })
        } else {
            res.status(400).json('Invalid phone number format')
            throw new Error('Invalid phone number format')
        }
    }

    // check target_price is valid
    if (typeof target_price !== 'number' || !['ABOVE', 'BELOW'].includes(alert_type)) {
        res.status(400).json('Add all fields')
        throw new Error('Add all fields')
    }

    const priceAlert = await db.priceAlert.create({
        data: {
            user_id,
            instrument_id,
            target_price,
            alert_type,
        }
    })
    console.log('/price_alert/add success')

    // add price alert to price alert manager
    priceAlertsManager.addPriceAlert({ ...priceAlert, symbol: instrument.symbol, phone_number: user.phone_number ?? phone_number })

    const userPriceAlerts = await userPriceAlertsMethod(user_id)
    res.status(200).json(userPriceAlerts)
})

/**
 * @route POST /price_alert/delete
 * @desc delete a price alert
 */
const deletePriceAlert = AsyncHandler(async (req, res) => {
    const { user_id, price_alert_id } = req.body

    const deletedAlert = await db.priceAlert.delete({
        where: {
            id: price_alert_id
        },
        include: { instrument: true }
    })

    if (deletedAlert) {
        console.log('/price_alert/delete success')

        // remove price alert from `priceAlertsManager`
        priceAlertsManager.removePriceAlert(deletedAlert.instrument.symbol, deletedAlert.id)

        const userPriceAlerts = await userPriceAlertsMethod(user_id)
        res.status(200).json(userPriceAlerts)
    } else {
        res.status(400).json('Error deleting alert')
    }

})

export { getUserPriceAlerts, addPriceAlert, deletePriceAlert, userPriceAlertsMethod }