import express from "express"
import cors from "cors"
import authRouter from "./auth"
import RoomRouter from "./room"
import { Middleware } from "./middleware"
import dotenv from "dotenv"

dotenv.config()

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRouter)
app.use("/api/room", Middleware, RoomRouter)


app.listen(3000, () => {
    console.log('Server is listening on port: ' + 3000)
})

