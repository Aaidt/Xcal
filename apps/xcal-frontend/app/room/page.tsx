"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Room() {
    const [slug, setSlug] = useState<string>("")
    const router = useRouter()

    return (
        <div className="bg-black/95 min-h-screen max-w-screen text-white flex justify-center items-center ">
            <div className="flex-col flex">
                <div className="mb-2 text-lg">Create room:</div>

                <div className="flex gap-2">
                    <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === "Enter"){
                                const button = e.currentTarget.closest(`div`)?.querySelector("button")
                            }
                        }}
                        className="bg-white rounded-md text-black px-2 py-1" placeholder="Enter room name..." />
                    <button
                        onClick={() => {
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