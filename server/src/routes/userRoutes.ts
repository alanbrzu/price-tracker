import express from "express"
import { createUser, loginUser } from "../controllers/userController"

const userRouter = express.Router()

userRouter.post('/create', createUser)
userRouter.post('/login', loginUser)
// need to update password

export default userRouter