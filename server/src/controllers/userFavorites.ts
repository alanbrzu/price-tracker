import { db } from "../db"
import AsyncHandler from 'express-async-handler'

/** @returns find user favorites based on user_id */
const userFavoritesMethod = async (user_id: number) => {
    try {
        const favorites = await db.userFavorite.findMany({
            where: { user_id },
            select: { instrument: true }
        })
        return favorites.map((favorite) => favorite.instrument)
    } catch (err) {
        console.log(err)
        throw new Error('couldnt get user favorites')
    }
}

/**
 * route /favorite/:user_id
 * @param user_id
 */
const getUserFavorites = AsyncHandler(async (req, res) => {
    const user_id = parseInt(req.params.user_id)

    const userFavorites = await userFavoritesMethod(user_id)

    if (userFavorites) {
        console.log('/favorite/:user_id success')
        res.status(200).json(userFavorites)
    } else {
        console.log('/favorite/:user_id no favorites status 204')
        res.status(204).json([])
    }
})

/**
 * route /favorite/add
 * @params user_id, instrument_id
 * @returns all userFavorites after adding
 */
const addFavorite = AsyncHandler(async (req, res) => {
    const { user_id, instrument_id } = req.body

    // check if the user and instrument exist
    const user = await db.user.findUnique({ where: { id: user_id } })
    const instrument = await db.instrument.findUnique({ where: { id: instrument_id } })

    if (!user || !instrument) {
        res.status(400).json('User or instrument not found')
        throw new Error('User or instrument not found')
    }

    await db.userFavorite.create({
        data: {
            user: { connect: { id: user_id } },
            instrument: { connect: { id: instrument_id } }
        }
    })
    console.log('/favorite/add success')

    /** query all userFavorites to send as response */
    const userFavorites = await userFavoritesMethod(user_id)
    res.status(201).json(userFavorites)
})

/**
 * route /favorite/remove
 * @params user_id, instrument_id
 * @returns all userFavorites after deleting
 */
const removeFavorite = AsyncHandler(async (req, res) => {
    const { user_id, instrument_id } = req.body

    const deletedFavorite = await db.userFavorite.delete({
        where: {
            user_id_instrument_id: {
                user_id,
                instrument_id
            }
        }
    })

    if (deletedFavorite) {
        console.log('/favorite/remove success')

        /** query all userFavorites to send as response */
        const userFavorites = await userFavoritesMethod(user_id)
        res.status(200).json(userFavorites)
    } else {
        res.status(400).json('Error deleting favorite')
    }
})

export { getUserFavorites, addFavorite, removeFavorite }