import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/userRoutes'
import instrumentRouter from './routes/instrumentRoutes'

dotenv.config()

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// test route
app.get('/', (_, res) => {
    res.status(200).send({ res: 'Express ts server' })
})

// user and instrument routes
app.use('/user', userRouter)
app.use('/instrument', instrumentRouter)

// serve the server
app.listen(port, () => console.log(`Server is running on port ${port}`)
)