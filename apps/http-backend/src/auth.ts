import { Router, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt"
import { z } from "zod"
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateUserSchema, LoginSchema } from './types'

const authRouter: Router = Router();

authRouter.post("/signup", async function (req: Request, res: Response) {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Incorrect credentials provided")
        res.status(401).json({ message: "Incorrect credentials provided" })
        return
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 5);

    try {
        const user = await prismaClient.user.create({
            data: {
                name: parsedData.data.name,
                username: parsedData.data.username,
                password: hashedPassword
            }
        })

        res.status(201).json({ 
            message: "Signed up successfully!!! ✅✅",
            userId: user.id
        })
    } catch (e) {
        console.log("Username already exists.")
        res.status(403).json({
            message: "Username already exists.❌❌"
        })
    }

})


authRouter.post("/signin", async function (req: Request, res: Response) {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Incorrect credentials provided")
        res.status(401).json({ message: "Incorrect credentials provided" })
        return
    }

    try {
        const foundUser = await prismaClient.user.findFirst({
            where: {
                username: parsedData.data.username
            }
        })
        if (!foundUser) {
            res.status(404).json({ message: "User not found." })
            return
        }

        const AuthorisedUser = bcrypt.compare(parsedData.data.password, foundUser.password)
        if (!AuthorisedUser) {
            res.status(403).json({ message: "Incorrect password.❌❌" })
        }

        if (!JWT_SECRET) {
            console.log("No JWT_SECRET provided.")
            res.status(403).json({ message: "No JWT_SECRET provided." })
            return 
        }
        const token = jwt.sign({
            userId: foundUser?.id
        }, JWT_SECRET)

        res.status(200).json({ 
            token: token,
            message: "Successfully logged in!!!✅✅"
         })

    } catch (e) {
        console.log("Incorrect credentials provided.")
        res.status(403).json({
            message: "Incorrect credentials provided.❌❌"
        })
    }

})



export default authRouter