"use client"

import { useState, useEffect, useRef } from "react"
import IconButton from "./IconButton"
import { Pencil, Circle, RectangleHorizontal, Slash, Triangle } from "lucide-react"
import { Game } from "@/game/game"
import { toast } from "react-toastify"


export type Tool = "pencil" | "circle" | "rect" | "line" | "triangle"


export default function Canvas({
    socket,
    roomId
}: {
    socket: WebSocket,
    roomId: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil")
    const [game, setGame] = useState<Game>();

    const token = localStorage.getItem("Authorization");

    useEffect(() => {
        game?.setTool(selectedTool)
    }, [selectedTool, game])

    useEffect(() => {
        if(!token){
            toast.error('User not logged in.')
            return 
        }
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket, token);
            setGame(g)

            return () => {
                g.destroy()
            }
        }

    }, [canvasRef, roomId, socket])


    return <div className="min-h-screen overflow-hidden">
        <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} />
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}


function Topbar({
    selectedTool,
    setSelectedTool
}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
        <div className="flex gap-2 fixed top-0 left-0 p-5">
            <IconButton icon={<Pencil />}
                onClick={() => setSelectedTool("pencil")}
                activated={selectedTool === "pencil"} />

            <IconButton icon={<Circle />}
                onClick={() => setSelectedTool("circle")}
                activated={selectedTool === "circle"} />

            <IconButton icon={<RectangleHorizontal />}
                onClick={() => setSelectedTool("rect")}
                activated={selectedTool === "rect"} />

            <IconButton icon={<Slash />}
                onClick={() => setSelectedTool("line")}
                activated={selectedTool === "line"} />

            <IconButton icon={<Triangle />}
                onClick={() => setSelectedTool("triangle")}
                activated={selectedTool === "triangle"} />
        </div>
    )
}