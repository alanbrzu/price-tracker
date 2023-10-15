import twilio from 'twilio'
import { db } from '../db'
import priceAlertsManager from '../priceUpdates/PriceAlertsManager'
import { userPriceAlertsMethod } from '../controllers/priceAlerts'
import usersSocketsManager from '../priceUpdates/UsersSockets'
import { io } from '..'

const accountSid = process.env.accountSid
const authToken = process.env.authToken
const twilioPhone = process.env.twilioPhone

const twilioClient = twilio(accountSid, authToken)

/** in USA $0.0079 per outbound sms = ~12k/100$ */

/** @dev @todo every time we send a price alert, need to delete from `priceAlertManager` and database */
const sendMessage = async (alertId: number, symbol: string, targetPrice: number, currentPrice: number, alertType: 'ABOVE' | 'BELOW', phoneNumber: string) => {
    try {
        // first delete the price alert from `priceAlertManager`
        priceAlertsManager.removePriceAlert(symbol, alertId)

        // delete from database 
        const deletedAlert = await db.priceAlert.delete({
            where: { id: alertId }
        })

        const message = `Price alert: \n${symbol} ${alertType.toLowerCase()} ${targetPrice} @ ${currentPrice}`
        const to = phoneNumber.replace(/[^+0-9]/g, '')

        console.log(`sending price alert message: ${message}`)

        /** @dev @todo need to send to the UI that the alert has been deleted (new list of user price alerts) */
        // send message
        await twilioClient.messages.create({
            body: message,
            to,
            from: twilioPhone,
        })

        // send updated price alerts to user frontend
        const updatedUserAlerts = await userPriceAlertsMethod(deletedAlert.user_id)
        const userSockets = usersSocketsManager.getUserSockets(deletedAlert.user_id.toString())
        if (userSockets) {
            userSockets.forEach((socketId) => {
                io.to(socketId).emit('alertsUpdate', updatedUserAlerts)
            })
        }
    } catch (err) {
        console.log(err)
        throw new Error('Error sending twilio sms')
    }
}

export { sendMessage }