import express from "express"
import { prismaClient } from "@repo/db/client"
import cors from "cors"
import authRouter from "./auth"
import dotenv from "dotenv"

dotenv.config()

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRouter)


app.listen(3000, () => {
    console.log('Server is listening on port: ' + 3000)
})

