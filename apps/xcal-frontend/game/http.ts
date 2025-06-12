import axios from 'axios';
import { toast } from "react-toastify"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const tokenString = localStorage.getItem("Authorzation");
const token = tokenString?.split(" ")[1]

export async function getExistingShapes(roomId: string){
    let message;
    try{
        const response = await axios.get(`${BACKEND_URL}/shapes/${roomId}`, {
            headers: {
                "Authorization": token
            }
        })
        message = response?.data?.shapes
    }catch(e){
        toast.error('Error in fetching the existing shapes. ' + e)
    }

    const shapes = message.map((x: { message: string }) => {
        const data = JSON.parse(x.message);
        return data.shape
    })

    return shapes
}