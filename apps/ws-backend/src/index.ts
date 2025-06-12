import WebSocket, { WebSocketServer } from "ws"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 })

interface User {
    ws: WebSocket,
    userId: string,
    room: string[]
}

const users: User[] = []

function getUserId(token: string): string | null {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload

    try {
        if (!decoded || typeof decoded.userId !== "string") {
            return null
        }
        return decoded.userId
    } catch (e) {
        console.log(e);
        return null
    }

}

wss.on("connection", function (ws, request) {
    console.log('Ws connection established!!!');
    let userId: string | null = null

    wss.on("message", async function (data) {
        const parsedData = JSON.parse(data.toString())

        if (parsedData.type === "auth") {

            try {
                userId = getUserId(parsedData.token);
                if (userId === null) {
                    console.log('Incorrect/missing token.')
                    ws.close()
                    return
                } else {    
                    users.push({
                        userId,
                        ws,
                        room: []
                    })
                }
            } catch (e) {
                console.log('❌ Invalid token. Closing the socket.' + e);
                ws.close();
            }

        }
        else if (userId) {

            const user = users.find(x => x.ws === ws)
            if (!user) {
                console.log('No user found...')
                ws.send("No user found...")
                ws.close();
            }

            if (parsedData.type === "join-room") {
                user?.room.push(parsedData.roomId)
                ws.send(JSON.stringify({
                    type: "join-room",
                    message: "Successfully joined the requested room. ✅",
                    roomId: parsedData.roomId
                }))
            }

            if (parsedData.type === "leave-room") {
                const isInRoom = user?.room.includes(parsedData.roomId);
                user?.room.filter(x => x !== parsedData.roomId)
                ws.send(JSON.stringify({
                    type: "leave-room",
                    message: isInRoom ? "Successfully removed from the room. ✅" : "❌ You are not in this room.",
                    roomId: parsedData.roomId
                }))
            }

            if (parsedData.type === "chat") {

                await prismaClient.shape.create({
                    data: {
                        shape: parsedData.shape,
                        roomId: parsedData.roomId,
                        userId: parsedData.userId
                    }
                })

                users
                    .filter(u => u.room.includes(parsedData.roomId))
                    .forEach(u =>
                        ws.send(JSON.stringify({
                            type: "chat",
                            message: parsedData.message,
                            from: user?.userId,
                            roomId: parsedData.roomId
                        }))
                    )
            }

        }
        else {
            console.log('Send the auth request first.')
            ws.send('❌ Unauthorized. Send the auth token first.')
            ws.close();
        }
    })
})