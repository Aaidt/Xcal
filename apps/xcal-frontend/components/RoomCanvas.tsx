"use client"
import { toast } from "react-toastify"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Canvas from "./Canvas"

export default function RoomCanvas({ roomId }: { roomId: number }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const token = localStorage.getItem('Authorization');
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
    const router = useRouter()

    useEffect(() => {
        if (!token) {
            toast.error('Login first!!')
            setLoading(false);
            router.push("/signin");
            return
        }
        if (!WS_URL) {
            console.log('No websocket url provided.')
            setLoading(false);
            return
        }
        const ws = new WebSocket(`${WS_URL}`);
        setSocket(ws);

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "auth",
                token: token
            }));

            setTimeout(() => {
                ws.send(JSON.stringify({
                    type: "join-room",
                    roomId: roomId
                }))
            }, 100);

        }

        ws.onerror = (e) => {
            toast.error('Falied to connec to the server.')
            console.log('Ws error ' + JSON.stringify(e))
            setLoading(false);
        }

        ws.onclose = () => {
            console.log('Ws connection closed.')
            toast.warn("websocket connection closed")
            setLoading(false);
        }

        return () => {
            setSocket(null);
            ws.close()
        }

    }, [roomId])

    if (!socket || loading) {
        return <div className="bg-black/95 min-h-screen text-white text-lg flex justify-center items-center">
            Connecting to the server...
        </div>
    }


    return (
        <div><Canvas socket={socket} roomId={roomId} /></div>
    )
}