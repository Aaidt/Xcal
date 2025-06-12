"use client"
import { toast } from "react-toastify"
import { useState, useEffect } from 'react';
import Canvas from "./Canvas"

export default function RoomCanvas({ roomId }: { roomId: number }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const token = localStorage.getItem('Authorization');
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

    useEffect(() => {
        if (!token) {
            toast.error('Login first!!')
            return
        }
        if (!WS_URL) {
            console.log('No websocket url provided.')
            return 
        }
        const ws = new WebSocket(`${WS_URL}`);
        setSocket(ws);

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "auth",
                token: token
            }));

            ws.send(JSON.stringify({
                type: "join-room",
                roomId: roomId
            }))
        }

        ws.onerror = (e) => {
            console.log('Ws error ' + e)
        }

        ws.onclose = () => {
            console.log('Ws connection closed.')
        }

        return () => {
            ws.close()
        }

    }, [roomId, WS_URL, token])

    if(!socket){
        return <div className="bg-black/95 min-h-screen text-white text-lg">
            Connecting to the server...
        </div>
    }


    return (
        <div><Canvas socket={socket} roomId={roomId} /></div>
    )
}