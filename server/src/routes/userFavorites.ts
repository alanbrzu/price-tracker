import express from "express"
import { getUserFavorites, addFavorite, removeFavorite } from "../controllers/userFavorites"

const favoritesRouter = express.Router()

favoritesRouter.get('/:user_id', getUserFavorites)
favoritesRouter.post('/add', addFavorite)
favoritesRouter.post('/remove', removeFavorite)

export default favoritesRouter