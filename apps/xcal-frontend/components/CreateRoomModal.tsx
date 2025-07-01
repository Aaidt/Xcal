import { Dispatch, SetStateAction } from 'react'

export function CreateRoomModal ({open, setOpen}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}
) {
    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-black rounded-md w-120 h-80 flex flex-col gap-4 p-5 text-white
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards]">
                    <div className="font-bold font-playfair text-4xl pb-1 pt-2 flex justify-center">Add Content</div>
                        <div>sfsd</div>
                    </div>
            </div>
        </div>
)}