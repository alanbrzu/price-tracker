import { db } from "../db"
import AsyncHandler from 'express-async-handler'
import { Instrument } from "@prisma/client"

/** @returns instruments from user favorites */
const reduceFavoritesToInstruments = (favorites: { instrument: Instrument }[] | undefined) =>
    favorites?.map((favorite) => favorite.instrument)

/** @returns find user favorites based on user_id */
const userFavoritesMethod = async (user_id: number) => {
    const user = await db.user.findUnique({
        where: { id: user_id },
        include: {
            favorites: {
                select: {
                    instrument: true
                }
            }
        }
    })

    return reduceFavoritesToInstruments(user?.favorites)
}

/**
 * route /favorite/:user_id
 * @param user_id
 */
const getUserFavorites = AsyncHandler(async (req, res) => {
    const user_id = parseInt(req.params.user_id)

    const userFavorites = await userFavoritesMethod(user_id)

    if (userFavorites) {
        console.log('got user favorites')
        res.status(200).json(userFavorites)
    } else {
        console.log('couldnt find user favorites')
        res.status(204).json('No user favorites')
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

    /** @todo may need to check that its not already added */
    const userFavorite = await db.userFavorite.create({
        data: {
            user: { connect: { id: user_id } },
            instrument: { connect: { id: instrument_id } }
        }
    })
    console.log('added user favorite: ', { userFavorite })

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

    /** @todo need to query all userFavorites to send as response */

    if (deletedFavorite) {
        console.log('removed user favorite: ', { deletedFavorite })

        /** query all userFavorites to send as response */
        const userFavorites = await userFavoritesMethod(user_id)
        res.status(200).json(userFavorites)
    } else {
        res.status(400).json('Error deleting favorite')
    }
})

export { getUserFavorites, addFavorite, removeFavorite }