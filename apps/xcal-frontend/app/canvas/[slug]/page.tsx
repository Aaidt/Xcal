"use client"

import axios from 'axios'
import { toast } from "react-toastify"
import ChatRoom from "@/components/ChatRoom"
import { useEffect, useState } from 'react'

interface axiosResponse {
    roomId: number
}

async function getRoomId({
    slug,
    BACKEND_URL,
    token
}: {
    slug: string,
    BACKEND_URL: string,
    token: string
}) {
    try {
        const response = await axios.get<axiosResponse>(`${BACKEND_URL}/api/room/${slug}`, {
            headers: {
                "Authorization": token
            }
        })
        return response?.data.roomId
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const errorMessage = err?.response?.data?.message
            toast.error(errorMessage)
        }
    }
}

export default function Canvas({
    params
}: {
    params: {
        slug: string
    }
}) {
    const [roomId, setRoomId] = useState<number | null>(null);
    const { slug } = params;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        async function fetchRoomId() {
            if (!BACKEND_URL) {
                toast.error('BACKEND_URL is not defined');
                return;
            }
            const token = localStorage.getItem('Authorization');
            if (!token) {
                toast.error('Authorization token not found');
                return;
            }

            const id = await getRoomId({ slug, BACKEND_URL, token });
            if (!id) {
                toast.error('Could not find the room');
                return;
            }
            setRoomId(id);
        }

        fetchRoomId();
    }, [slug, BACKEND_URL]);

    if (!roomId) {
        return null;
    }

    return <ChatRoom roomId={roomId} />;
}