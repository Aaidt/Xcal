import axios from 'axios';
import { toast } from "react-toastify"

interface Shape {
    id: string,
    shape: 
}

export default async function ChatRoom(roomId: number) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    const token = localStorage.getItem('Authorization');

    try{
        const response = await axios.get(`${BACKEND_URL}/api/room/shapes/${roomId}`, {
            headers: {
                "Authorization": token
            }
        })
        const chats = response?.data?.shapes
    }
    catch(err: unknown){
        if(axios.isAxiosError(err)){
            const errMessage = err?.response?.data.message
            toast.error(errMessage)
        }
    }
    
}