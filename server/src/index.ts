import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routes/userRoutes'
import instrumentRouter from './routes/instrumentRoutes'
import favoritesRouter from './routes/userFavorites'
import priceAlertsRouter from './routes/priceAlertRoutes'

import { setupPriceUpdates } from './priceUpdates'
import usersSocketsManager from './priceUpdates/UsersSockets'

dotenv.config()

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** REST api */
// test route
app.get('/', (_, res) => {
    res.status(200).send({ res: 'Express ts server' })
})

// REST api route handlers
app.use('/user', userRouter)
app.use('/instrument', instrumentRouter)
app.use('/favorite', favoritesRouter)
app.use('/price_alert', priceAlertsRouter) // invalid url from underscore?

/** websockets */
const httpServer = http.createServer(app)

export const io = new Server(httpServer, {
    cors: {
        origin: '*' /** @dev @todo change */
    }
})

// incoming messages update the user_id <-> socket.id
io.on('connection', (socket) => {
    const socketId = socket.id
    console.log(`user connected ${socketId}`)

    socket.on('userId', (userId) => {
        if (userId) {
            usersSocketsManager.addUserSocket(userId.toString(), socketId)
        } else {
            // remove the disconnected socket from `userSockets`
            usersSocketsManager.removeSocket(socketId)
        }
    })

    socket.on('disconnect', () => {
        // remove the disconnected socket from `userSockets`
        usersSocketsManager.removeSocket(socketId)

        console.log(`${socket.id} disconnected`)
    })
})

// price update ws client
setupPriceUpdates(io)

/** serve the server */
httpServer.listen(port, () => console.log(`Server is running on port ${port}`))
