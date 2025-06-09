import { Router, Request, Response } from "express"
import { prismaClient } from "@repo/db/client"
import { RoomSchema } from "./types"

const roomRouter: Router = Router();


roomRouter.post("/room", async function (req: Request, res: Response) {
    const parsedData = RoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Incorrect credentials provided")
        res.status(401).json({ message: "Incorrect credentials provided" })
        return
    }


    const userId = req.userId;
    if (!req.userId) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return
    }

    await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            admin: userId
        }
    })
})


export default roomRouter