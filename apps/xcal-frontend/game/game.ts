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
} | {
    type: "line",
    startX: number,
    startY: number,
    endX: number,
    endY: number
} | {
    type: "triangle",
    startX: number,
    startY: number,
    leftX: number,
    baseY: number
    rightX: number
} | {
    type: "arrow",
    toX: number,
    toY: number,
    fromX: number,
    fromY: number
} | {
    type: "pencil",
    path: { x: number, y: number }[]
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
    private selectedTool: Tool = "pencil"
    private centerX = 0
    private centerY = 0
    private token: string
    private endX = 0
    private endY = 0
    private leftX = 0
    private baseY = 0
    private rightX = 0
    private toX = 0
    private toY = 0
    private fromX = 0
    private fromY = 0
    private pencilPath: { x: number, y: number }[] = [];

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

    setTool(tool: "circle" | "pencil" | "rect" | "line" | "triangle" | "arrow" | "pointer") {
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
            // console.log(message);

            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.shape)
                // console.log(parsedShape);
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#121212"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.existingShapes.map(shape => {
            if (shape.type === "rect") {
                this.ctx.lineWidth = 1
                this.ctx.strokeStyle = "white"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
            else if (shape.type === "pencil") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.path[0].x, shape.path[0].y);

                for (let i = 1; i < shape.path.length - 1; i++) {
                    const midX = (shape.path[i].x + shape.path[i + 1].x) / 2;
                    const midY = (shape.path[i].y + shape.path[i + 1].y) / 2;

                    this.ctx.quadraticCurveTo(shape.path[i].x, shape.path[i].y, midX, midY);
                }

                const last = shape.path[shape.path.length - 1];
                this.ctx.lineTo(last.x, last.y);

                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            else if (shape.type === "circle") {
                this.ctx.beginPath()
                this.ctx.strokeStyle = "white"
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, shape.startAngle, shape.endAngle);
                this.ctx.stroke();
            }
            else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY)
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.strokeStyle = "white"
                this.ctx.stroke();
            }
            else if (shape.type === "triangle") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY)
                this.ctx.lineTo(shape.leftX, shape.baseY);
                this.ctx.lineTo(shape.rightX, shape.baseY);
                this.ctx.closePath()
                this.ctx.strokeStyle = "white"
                this.ctx.stroke();
            } else if (shape.type === "arrow") {
                const fromX = shape.fromX;
                const fromY = shape.fromY;
                const toX = shape.toX;
                const toY = shape.toY;

                const width = 2;
                const headlen = 10;
                const angle = Math.atan2(toY - fromY, toX - fromX);

                const endX = toX - Math.cos(angle) * headlen;
                const endY = toY - Math.sin(angle) * headlen;

                this.ctx.beginPath();
                this.ctx.moveTo(fromX, fromY);
                this.ctx.lineTo(endX, endY);
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = width;
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(toX, toY);
                this.ctx.lineTo(
                    toX - headlen * Math.cos(angle - Math.PI / 7),
                    toY - headlen * Math.sin(angle - Math.PI / 7)
                );
                this.ctx.lineTo(
                    toX - headlen * Math.cos(angle + Math.PI / 7),
                    toY - headlen * Math.sin(angle + Math.PI / 7)
                );
                this.ctx.lineTo(toX, toY);
                this.ctx.closePath();

                this.ctx.fillStyle = "white";
                this.ctx.fill();
                this.ctx.lineWidth = 1;
            }
        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true

        this.startX = (e.clientX)
        this.startY = (e.clientY)

        this.centerX = (e.clientX)
        this.centerY = (e.clientY)

        this.fromX = (e.clientX)
        this.fromY = (e.clientY)

        this.pencilPath = [{ x: (e.clientX), y: (e.clientY) }]
    }


    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false

        const width = e.clientX - this.startX
        const height = e.clientY - this.startY

        this.endX = (e.clientX)
        this.endY = (e.clientY)

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
        } else if (selectedTool === "pencil") {
            shape = {
                type: "pencil",
                path: this.pencilPath
            }
        } else if (selectedTool === "circle") {
            const dx = e.clientX - this.centerX;
            const dy = e.clientY - this.centerY;
            const radius = Math.sqrt(dx * dx + dy * dy);
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.centerX,
                centerY: this.centerY,
                startAngle: 0,
                endAngle: Math.PI * 2
            }
        } else if (selectedTool === "line") {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: this.endX,
                endY: this.endY
            }
        } else if (selectedTool === "triangle") {
            shape = {
                type: "triangle",
                startX: this.startX,
                startY: this.startY,
                leftX: this.leftX,
                baseY: this.baseY,
                rightX: this.rightX
            }
        } else if (selectedTool === "arrow") {
            shape = {
                type: "arrow",
                fromX: this.fromX,
                fromY: this.fromY,
                toX: e.clientX,
                toY: e.clientY
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

            const baseWidth = height * 2
            this.leftX = this.startX - baseWidth / 2
            this.rightX = this.startX + baseWidth / 2
            this.baseY = this.startY + height

            this.endX = (e.clientX)
            this.endY = (e.clientY)

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
            } else if (selectedTool === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY)
                this.ctx.lineTo(this.endX, this.endY)
                this.ctx.strokeStyle = "white"
                this.ctx.stroke()
            } else if (selectedTool === "triangle") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY)
                this.ctx.lineTo(this.leftX, this.baseY);
                this.ctx.lineTo(this.rightX, this.baseY);
                this.ctx.closePath()
                this.ctx.strokeStyle = "white"
                this.ctx.stroke();
            } else if (selectedTool === "arrow") {
                const fromX = this.fromX;
                const fromY = this.fromY;
                const toX = e.clientX;
                const toY = e.clientY;

                const shaftWidth = 2;
                const headlen = 10;
                const angle = Math.atan2(toY - fromY, toX - fromX);

                const endX = toX - Math.cos(angle) * headlen;
                const endY = toY - Math.sin(angle) * headlen;

                this.ctx.beginPath();
                this.ctx.moveTo(fromX, fromY);
                this.ctx.lineTo(endX, endY);
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = shaftWidth;
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(toX, toY);
                this.ctx.lineTo(
                    toX - headlen * Math.cos(angle - Math.PI / 7),
                    toY - headlen * Math.sin(angle - Math.PI / 7)
                );
                this.ctx.lineTo(
                    toX - headlen * Math.cos(angle + Math.PI / 7),
                    toY - headlen * Math.sin(angle + Math.PI / 7)
                );
                this.ctx.closePath();

                this.ctx.fillStyle = "white";
                this.ctx.fill();
                this.ctx.lineWidth = 1;
            } else if (selectedTool === "pencil") {
                this.pencilPath.push({ x: e.clientX, y: e.clientY });

                this.clearCanvas();

                const path = this.pencilPath;
                if (path.length < 2) return;

                this.ctx.beginPath();
                this.ctx.moveTo(path[0].x, path[0].y);

                for (let i = 1; i < path.length - 1; i++) {
                    const midX = (path[i].x + path[i + 1].x) / 2;
                    const midY = (path[i].y + path[i + 1].y) / 2;

                    this.ctx.quadraticCurveTo(path[i].x, path[i].y, midX, midY);
                }

                const last = path[path.length - 1];
                this.ctx.lineTo(last.x, last.y);

                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }

}
