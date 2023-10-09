import express from "express"
import { allInstruments } from "../controllers/instrumentController"

const instrumentRouter = express.Router()

instrumentRouter.get('/all', allInstruments)

export default instrumentRouter