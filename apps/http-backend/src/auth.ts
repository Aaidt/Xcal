import { Router, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt"
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateUserSchema, LoginSchema } from './types'
import { Middleware } from "./middleware"

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

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            message: "Signed up successfully!!!",
            token: token
        })
    } catch (e) {
        console.log("Username already exists.")
        res.status(403).json({
            message: "Username already exists."
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
            res.status(403).json({ message: "Incorrect password." })
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
            message: "Successfully logged in!!!"
        })

    } catch (e) {
        console.log("Incorrect credentials provided.")
        res.status(403).json({
            message: "Incorrect credentials provided."
        })
    }

})

authRouter.get("/me", Middleware, async function (req: Request, res: Response) {
    const userId = req.userId

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                username: true,
                name: true,
                photo: true
            }
        });

        if (!user) {
            console.log("No user found!!!")
            res.status(404).json({ message: "No user found!!!" })
            return
        }

        res.status(200).json({ user })

    } catch (err) {
        console.log('Server error')
        res.status(500).json({
            message: "server error"
        })
    }
})

export default authRouter