import { getExistingShapes } from "./http"
import { Tool } from "@/components/Canvas"


type Shapes = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
}

export class Game {

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shapes[]
    private roomId: number
    private socket: WebSocket
    private clicked: boolean
    private startX = 0
    private startY = 0
    private selectedTool: Tool = "circle"
    private centerX = 0
    private centerY = 0
    private token: string

    constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket, token: string) {
        this.token = token
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = []
        this.roomId = roomId
        this.clicked = false
        this.socket = socket
        this.initMouseHandlers()
        this.initHandlers()
        this.init()
    }

    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId, this.token)
        this.clearCanvas()
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "rgba(0,0,0,0.95)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.existingShapes.map(shape => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "white"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }

            else if (shape.type === "circle") {
                this.ctx.beginPath()
                this.ctx.strokeStyle = "white"
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, shape.startAngle, shape.endAngle);
                this.ctx.stroke();
            }
        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true
        this.startX = (e.clientX)
        this.startY = (e.clientY)
        this.centerX = (e.clientX)
        this.centerY = (e.clientY)
    }


    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false

        const width = e.clientX - this.startX
        const height = e.clientY - this.startY

        const selectedTool = this.selectedTool
        let shape: Shapes | null = null
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            }
        } else if (selectedTool === "circle") {
            const dx = e.clientX - this.centerX;
            const dy = e.clientY - this.centerY;
            const radius = Math.sqrt(dx * dx + dy * dy);
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                startAngle: 0,
                endAngle: Math.PI * 2
            }
        }

        if (!shape) return;

        this.existingShapes.push(shape)
        this.socket.send(JSON.stringify({
            type: "chat",
            shape: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))

    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.clearCanvas()

            this.ctx.strokeStyle = "white"
            const selectedTool = this.selectedTool
            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === "circle") {
                const dx = e.clientX - this.centerX;
                const dy = e.clientY - this.centerY;
                const radius = Math.sqrt(dx * dx + dy * dy);

                this.ctx.beginPath()
                this.ctx.strokeStyle = "white"
                this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke()
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }

}
