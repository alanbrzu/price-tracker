import express from "express"
import { getAllInstruments } from "../controllers/instrumentController"

const instrumentRouter = express.Router()

instrumentRouter.get('/all', getAllInstruments)

export default instrumentRouter