'use client'

import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'

interface RoomCardProps {
  room: {
    id: number
    slug: string
    created_at: string
  }
}

export default function RoomCard({ room }: RoomCardProps) {
    const router = useRouter()
  return (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
    <div 
        onClick={() => router.push(`/canvas/${room.slug}`)}
        className="border border-white/20 p-4 rounded-md hover:bg-white/5 duration-200 shadow hover:shadow-lg transition cursor-pointer"
    >
      <h3 className="text-lg font-medium">{room.slug}</h3>
      <p className="text-sm text-gray-500">Created: {new Date(room.created_at).toLocaleDateString()}</p>
    </div>
    </motion.div>
  );
}

