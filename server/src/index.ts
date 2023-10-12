import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routes/userRoutes'
import instrumentRouter from './routes/instrumentRoutes'
import favoritesRouter from './routes/userFavorites'
import { setupPriceUpdates } from './priceUpdates'

dotenv.config()

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * REST api
 */
// test route
app.get('/', (_, res) => {
    res.status(200).send({ res: 'Express ts server' })
})

// user and instrument routes
app.use('/user', userRouter)
app.use('/instrument', instrumentRouter)
app.use('/favorite', favoritesRouter)

/**
 * websockets
 */
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: '*' /** @dev @todo change */
    }
})

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`)

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
    })
})

/** price update ws client */
setupPriceUpdates(io)

// serve the server
httpServer.listen(port, () => console.log(`Server is running on port ${port}`))
