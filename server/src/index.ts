import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { db } from './db'
import { findTimestamp } from './utils'

dotenv.config()

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
    res.status(200).send({ res: 'Express ts server' })
})

/** create new user */
app.post('/createUser', (req, res) => {
    const password = req.body.password
    const email = req.body.email
    const time = findTimestamp()

    const InsertQuery = 'INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)'
    db.query(InsertQuery, [email, password, time], (err, result) => {
        console.log('created user', { result })
        // need to send something like 'account creation valid' or 'invalid' 
    })
})
/** get user (to login -> based on email.. if password matches the input then authorize otherwise no) */
// app.post()
/** update user (password) */
// app.put()

/** get all instruments */
app.get('/getInstrumentsAll', (_, res) => {
    const SelectQuery = 'SELECT * FROM instruments'
    db.query(SelectQuery, (err, result) => {
        console.log('got all instruments and sent to client')
        res.send(result)
    })
})

/** get user instruments */
app.get('/getInstrumentsUser', (req, res) => {
    const userId = req.body.userId

    const FindQuery = 'SELECT i.* FROM instruments i JOIN user_favorites uf ON i.id = uf.id WHERE uf.id = ?'
    db.query(FindQuery, [userId], (err, result) => {
        console.log('got user instruments and sent to client')
        res.send(result)
    })
})

/** insert into user instruments */
// app.put()

/** delete from user instruments */
// app.put() or app.delete()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})