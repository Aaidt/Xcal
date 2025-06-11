

export default function room() {
    return (
        <div className="bg-black/95 min-h-screen max-w-screen text-white flex justify-center items-center flex-col">
            <div className="font-medium text-xl">Create room:
                <input id="room" className="bg-white rounded-lg text-black px-2 py-1" placeholder="Enter room name..." />
            </div>
        </div>
    )
}