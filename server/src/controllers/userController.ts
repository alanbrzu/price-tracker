import { db } from "../db"
import bcrypt from 'bcryptjs'
import AsyncHandler from 'express-async-handler'

/**
 * @route POST /user/create
 * @params email, password
 */
const createUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json('Add all fields')
        throw new Error('Add all fields')
    }

    // check if email is in use
    const userExists = await db.user.findUnique({
        where: { email }
    })
    if (userExists) {
        res.status(400).json('Email in use')
        throw new Error('Email in use')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword
        }
    })
    console.log('/user/create success')
    res.status(201).json({ id: user.id, email: user.email, phone_number: user.phone_number })
})

/**
 * @route POST /user/login
 * @params email, password
 */
const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json('Add all fields')
        throw new Error('Add all fields')
    }

    const user = await db.user.findUnique({
        where: { email }
    })

    const passwordValid = await bcrypt.compare(password, user?.password ?? '')

    if (user && passwordValid) {
        console.log('/user/login success')
        res.status(200).json({ id: user.id, email: user.email, phone_number: user.phone_number })
    } else {
        res.status(400).json('Invalid credentials')
        throw new Error('Invalid credentials')
    }
})

export { createUser, loginUser }