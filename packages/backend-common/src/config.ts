import dotenv from "dotenv";

dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET 
if(!JWT_SECRET){
    console.log('jwt secret not provided')
}