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
    const parsedToken = token.split(" ")[1]
    if (typeof parsedToken !== "string") {
        console.log('This is not a string: ' + parsedToken)
        return null
    }
    const decoded = jwt.verify(parsedToken, JWT_SECRET) as jwt.JwtPayload

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

wss.on("connection", function (ws) {
    console.log('Ws connection established!!!');
    let userId: string | null = null

    ws.on("message", async function (data) {
        let parsedData;
        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString())
        } else {
            parsedData = JSON.parse(data);
        }
        // console.log('Received message:', parsedData)

        if (parsedData.type === "auth") {
            try {
                userId = getUserId(parsedData.token);
                // console.log(userId);
                if (userId === null) {
                    console.log('Incorrect/missing token.')
                    ws.close();
                    return
                } else {
                    users.push({
                        userId,
                        ws,
                        room: []
                    })
                    console.log('UserId pushed in arr.')
                }
            } catch (e) {
                console.log('❌ Invalid token. Closing the socket.' + e);
                ws.close();
            } finally {
                console.log('success')
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
                const roomId = parsedData.roomId

                await prismaClient.room.update({
                    where: {
                        id: roomId
                    },
                    data: {
                        users: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                })

                ws.send(JSON.stringify({
                    type: "join-room",
                    success: "true",
                    message: "Successfully joined the requested room. ✅",
                    roomId: parsedData.roomId
                }))
            }

            if (parsedData.type === "leave-room") {
                const isInRoom = user?.room.includes(parsedData.roomId);
                user?.room.filter(x => x !== parsedData.roomId)
                ws.send(JSON.stringify({
                    type: "leave-room",
                    success: "true",
                    message: isInRoom ? "Successfully removed from the room. ✅" : "❌ You are not in this room.",
                    roomId: parsedData.roomId
                }))
            }

            if (parsedData.type === "erase") {
                const { x, y, width, height, roomId } = parsedData;

                await prismaClient.shape.create({
                    data: {
                        shape: JSON.stringify({
                            type: "eraser",
                            x,
                            y,
                            width,
                            height
                        }),
                        roomId: Number(roomId),
                        userId
                    }
                });

                users.forEach(user => {
                    if (user.room.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "erase",
                            area: { x, y, width, height },
                            from: userId,
                            roomId
                        }));
                    }
                });
            }


            if (parsedData.type === "chat") {

                await prismaClient.shape.create({
                    data: {
                        shape: parsedData.shape,
                        roomId: Number(parsedData.roomId),
                        userId: userId
                    }
                })

                users.forEach(user => {
                    if (user.room.includes(parsedData.roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            shape: parsedData.shape,
                            from: user?.userId,
                            roomId: parsedData.roomId
                        }))
                    }
                })
            }

        }
        else {
            console.log('Send the auth request first.')
            ws.send('❌ Unauthorized. Send the auth token first.')
            ws.close();
        }
    })
})