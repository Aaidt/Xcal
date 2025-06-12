"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";

export default function Room() {
    const [slug, setSlug] = useState<string>("")
    const router = useRouter()

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function createRoom(slug: string) {
        if(!slug.trim()){
            alert("Room name cannot be empty.")
            return
        }

        const token = localStorage.getItem(`Authorization`);
        if (!token) {
            alert('You need to login first!!!');
            router.push("/signin");
            return
        }

        try {
            const res = await axios.post(`${BACKEND_URL}/api/room`, {
                slug
            }, {
                headers: {
                    "Authorization": token
                }
            });

            alert(res.data.message);
            console.log(res.data.roomId);

        } catch (e) {
            console.log('Create room request failed.' + e);
            alert('Failed to create room. Please try again.');
        }
    }

    return (
        <div className="bg-black/95 min-h-screen max-w-screen text-white flex justify-center items-center ">
            <div className="flex-col flex">
                <div className="mb-2 text-lg">Create room:</div>

                <div className="flex gap-2">
                    <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                                await createRoom(slug)
                                router.push(`/canvas/${slug}`)
                            }
                        }}
                        className="bg-white rounded-md text-black px-2 py-1" placeholder="Enter room name..." />
                    <button
                        onClick={async () => {
                            await createRoom(slug)
                            router.push(`/canvas/${slug}`)
                        }}
                        className="rounded-md px-2 py-1 bg-black hover:bg-white/10 duration-200 transition-all">
                        Enter
                    </button>
                </div>
            </div>
        </div>
    )
}