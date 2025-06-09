import express from "express"
import { prismaClient } from "@repo/db/client"
import dotenv from "dotenv"

dotenv.config()

const app = express();

const port = process.env.PORT
if(!port){
    console.log("No port was provided.")
}



app.listen(port, () => {
    console.log('Server is listening on port: ' + port)
})

