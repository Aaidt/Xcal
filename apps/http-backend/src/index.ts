import express from "express"
import { prismaClient } from "@repo/db/client"
import cors from "cors"
import authRouter from "./auth"
import dotenv from "dotenv"

dotenv.config()

const app = express();

const port = process.env.PORT
if(!port){
    console.log("No port was provided.")
}

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRouter)


app.listen(port, () => {
    console.log('Server is listening on port: ' + port)
})

