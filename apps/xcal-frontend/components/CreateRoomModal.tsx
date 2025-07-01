import { Dispatch, SetStateAction, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import axios from 'axios'

interface axiosResponse {
    message: string,
    roomId: number
}

export function CreateRoomModal ({open, setOpen}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}
) {

        const [slug, setSlug] = useState<string>("")
        const [loading, setLoading] = useState<boolean>(false)
        const router = useRouter()
    
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    
        async function createRoom(slug: string) {
            if (!slug.trim()) {
                toast.error("Room name cannot be empty.")
                return
            }
    
            const token = localStorage.getItem(`Authorization`);
            
            if (!token) {
                toast.error('You need to login first!!!');
                router.push("/signin");
                return
            }
            setLoading(true);
            try {
                const res = await axios.post<axiosResponse>(`${BACKEND_URL}/api/room`, {
                    slug
                }, {
                    headers: {
                        "Authorization": token
                    }
                });
    
                toast(res.data.message);
                console.log(res.data.roomId);
                router.push(`/canvas/${slug}`)
            }
            catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.log('Create room request failed.' + err?.response?.data?.message);
                }
                toast.error('Failed to create room. Please try again.');
            } finally {
                setLoading(false);
            }
        }


    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen bg-white/15 z-50 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}    
                viewport={{ once: true }}
                className="flex justify-center items-center h-screen pb-10">
                    <div onClick={(e) => e.stopPropagation()} className="bg-black rounded-md w-120 h-60 flex flex-col gap-4 p-5 text-white">
                        <div className="font-bold text-3xl pb-1 pt-2 flex justify-center">Create room</div>

                        <div className="flex gap-2">
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === "Enter" && !loading) {
                                        await createRoom(slug)
                                    }
                                }}
                                className="bg-white rounded-md text-black px-2 py-1" placeholder="Enter room name..."
                                disabled={loading} />
                            <button
                                disabled={loading}
                                onClick={async () => {
                                    await createRoom(slug)
                                }}
                                className="rounded-md px-2 py-1 bg-black hover:bg-white/10 duration-200 transition-all">
                                {loading ? "Creating room..." : "Enter"}
                            </button>
                        </div>

                        </div>
            </motion.div>
        </div>
)}