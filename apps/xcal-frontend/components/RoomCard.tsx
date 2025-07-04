'use client'

import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { DeleteRoomModal } from "@/components/DeleteRoomModal";
import axios from 'axios'
import { useState } from "react";
import { toast } from 'react-toastify'


interface RoomCardProps {
  room: {
    id: number
    slug: string
    created_at: string
  },
  visiting: boolean,
  onRefresh?: () => void | undefined
}

export default function RoomCard({ room, visiting, onRefresh }: RoomCardProps) {
    const router = useRouter()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  return (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>

      <DeleteRoomModal open={deleteModalOpen} setOpen={setDeleteModalOpen} 
        onDelete={async () => {
          try{
            const response = await axios.delete(`${BACKEND_URL}/api/room/delete/single/${room.id}`, {
              headers: { 
                Authorization: localStorage.getItem('Authorization') 
              },
            });
            toast.success(response.data.message)
            onRefresh?.();
          }catch(err){
            console.log(err)
            toast.error("Error while deleting room")            
          }
        }} />

    <div 
      className="border border-white/10 bg-white/5 p-4 rounded-md hover:bg-white/10 duration-200
       shadow hover:shadow-lg transition cursor-pointer">
      <div
        onClick={() => router.push(`/canvas/${room.slug}`)}
        className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{room.slug}</h3>
          <p className="text-sm text-gray-500">Created: {new Date(room.created_at).toLocaleDateString()}</p>
        </div>

        {visiting ? null :<div className="flex gap-4"> 

          {/* <Share className="size-5 cursor-pointer" /> */}

          <Trash2 
            className="size-5 cursor-pointer  hover:text-red-700 text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalOpen(true)
            }}
          /> 
          </div>
         }
      </div>
    </div>
    </motion.div>
  );
}

