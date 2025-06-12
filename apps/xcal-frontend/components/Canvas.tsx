import { useState, useEffect, useRef } from "react"
import IconButton from "./IconButton"
import { Pencil, Circle, RectangleHorizontal } from "lucide-react"


export type Tool = "pencil" | "circle" | "rect"


export default function Canvas({
    socket,
    roomId
}: {
    socket: WebSocket,
    roomId: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil")


    return <div>
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
        <div>
            <IconButton icon={<Pencil />}
                onClick={() => setSelectedTool("pencil")}
                activated={selectedTool === "pencil"} />
                
            <IconButton icon={<Circle />}
                onClick={() => setSelectedTool("circle")}
                activated={selectedTool === "circle"} />

            <IconButton icon={<RectangleHorizontal />}
                onClick={() => setSelectedTool("rect")}
                activated={selectedTool === "rect"} />
        </div>
    )
}