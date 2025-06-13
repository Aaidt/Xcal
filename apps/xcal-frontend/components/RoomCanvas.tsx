"use client"
import { toast } from "react-toastify"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import Canvas from "./Canvas"

export default function RoomCanvas({ roomId }: { roomId: number }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const token = localStorage.getItem('Authorization');
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
    const router = useRouter()
    const wsRef = useRef<WebSocket | null>(null)

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
        wsRef.current = ws
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

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.success === "true") {
                    setLoading(false)
                }
            }catch(e){
                console.log(e)
            }
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
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                ws.close();
                setSocket(null)
            }
        }

    }, [roomId, WS_URL, router, token])

    if (!socket) {
        return <div className="bg-black/95 min-h-screen text-white text-lg flex justify-center items-center">
            Socket connection not established
        </div>
    }

    if (loading) {
        return <div className="bg-black/95 min-h-screen text-white text-lg flex justify-center items-center">
            Connecting to the server...
        </div>
    }


    return (
        <div><Canvas socket={socket} roomId={roomId} /></div>
    )
}