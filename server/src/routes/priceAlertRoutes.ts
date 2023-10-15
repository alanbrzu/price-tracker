import express from "express"
import { addPriceAlert, deletePriceAlert, getUserPriceAlerts } from "../controllers/priceAlerts"

const priceAlertsRouter = express.Router()

priceAlertsRouter.get('/:user_id', getUserPriceAlerts)
priceAlertsRouter.post('/add', addPriceAlert)
priceAlertsRouter.post('/delete', deletePriceAlert)

export default priceAlertsRouter