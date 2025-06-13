import axios from 'axios';
import { toast } from "react-toastify"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export async function getExistingShapes(roomId: number, token: string) {
    let message;
    try {
        const response = await axios.get(`${BACKEND_URL}/shapes/${roomId}`, {
            headers: {
                "Authorization": token  
            }
        })
        message = response?.data?.shapes
        const shapes = message.map((x: { message: string }) => {    
            const data = JSON.parse(x.message);
            return data.shape
        })
        return shapes
    } catch (e) {
        toast.error('Error in fetching the existing shapes. ' + e)
    }

}