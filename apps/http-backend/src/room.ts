import { Router, Request, Response } from "express"
import { prismaClient } from "@repo/db/client"
import { RoomSchema } from "./types"

const roomRouter: Router = Router();


roomRouter.post("/", async function (req: Request, res: Response) {
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

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.slug,
                admin: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        res.status(200).json({
            message: "Room created successfully!!!",
            roomId: room.id
        })
    } catch (e) {
        res.status(403).json({
            message: "Room with that name already exists.❌❌"
        })
    }

})

roomRouter.get("/shapes/:roomId", async function (req: Request, res: Response) {
    const roomId = Number(req.params.roomId);

    if (!roomId) {
        console.log("No roomId provided.");
        res.status(403).json({
            message: "No roomId provided."
        })
        return
    }

    try {
        const shapes = await prismaClient.shape.findMany({
            where: {
                roomId: roomId
            },
            take: 1000,
            orderBy: {
                id: "desc"
            }
        })
        res.status(200).json({
            shapes
        })

    } catch (e) {
        res.status(403).json({
            message: "Could not find the desired room."
        })
    }

})

roomRouter.get("/:slug", async function (req: Request, res: Response) {
    const slug = req.params.slug;

    if (!slug) {
        res.status(403).json({ message: "Name of the room not provided." })
        return
    }

    try {
        const room = await prismaClient.room.findFirst({
            where: {
                slug: slug
            }
        });

        if (!room) {
            res.status(404).json({ message: "Room could not be found." })
            return
        }

        res.status(200).json({
            roomId: room.id
        })

    } catch (e) {
        res.status(403).json({
            message: "Room with that name could not be found."
        })
    }
})


export default roomRouter