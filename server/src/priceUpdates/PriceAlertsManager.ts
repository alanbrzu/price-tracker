import { PriceAlert } from "@prisma/client"
import { db } from "../db"

export type PriceAlertObject = {
    symbol: string
    phone_number: string
} & PriceAlert

class PriceAlertsManager {
    private priceAlerts: { [symbol: string]: PriceAlertObject[] } = {}

    public addPriceAlert = (priceAlert: PriceAlertObject) => {
        this.priceAlerts[priceAlert.symbol] = this.priceAlerts[priceAlert.symbol] || []
        this.priceAlerts[priceAlert.symbol].push(priceAlert)
    }

    public removePriceAlert = (symbol: string, alertId: number) => {
        this.priceAlerts[symbol] = this.priceAlerts[symbol].filter((priceAlert) => alertId !== priceAlert.id)
    }

    public getPriceAlerts = (symbol: string) => this.priceAlerts[symbol] || []

    /** @dev only run this on server initialization */
    public syncPriceAlerts = async () => {
        try {
            const alerts = await db.priceAlert.findMany({
                include: {
                    user: true,
                    instrument: true
                }
            })
            alerts.forEach((alert) => {
                const symbol = alert.instrument.symbol
                const phone_number = alert.user.phone_number ?? ''

                this.priceAlerts[symbol] = this.priceAlerts[symbol] || []
                this.priceAlerts[symbol].push({ ...alert, symbol, phone_number })
            })
        } catch (err) {
            console.log(err)
            throw new Error('error getting all priceAlerts')
        }
    }
}

const priceAlertsManager = new PriceAlertsManager()

export default priceAlertsManager
