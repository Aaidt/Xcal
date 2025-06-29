'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import RoomCard from '@/components/RoomCard'
import { motion } from "framer-motion"
import { User } from "lucide-react"
import { useRouter } from 'next/navigation'

interface Room {
  id: number
  created_at: string
  slug: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Dashboard() {
    const router = useRouter()

  const [adminRooms, setAdminRooms] = useState<Room[]>([])
  const [visitedRooms, setVisitedRooms] = useState<Room[]>([])
  const [name, setName] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
        const token =  localStorage.getItem("Authorization")

        const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
            headers: {
                Authorization: token,
            }
        })

        setName(res.data?.user.name)

        const admin = await axios.get<{ adminRooms: Room[] }>(`${BACKEND_URL}/api/room/admin`, {
            headers: {
            Authorization:token,
            }
        })
        setAdminRooms(admin.data.adminRooms || [])

        const visited = await axios.get<{ visitedRooms: Room[] }>(`${BACKEND_URL}/api/room/visited`, {
            headers: {
            Authorization: token,
            }
        })
        setVisitedRooms(visited.data.visitedRooms || [])
    }

    fetchData()
  }, [])

  return (
    <div className="p-15 min-h-screen min-w-screen mx-auto bg-black/95 text-white">
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            <div className='flex justify-between items-center'>
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className='mr-10 flex gap-2'>
                <p>Welcome!</p>
                <p className='font-medium'>{name}</p>    
                </div>
            </div>

      <div className="mb-8 p-5">
        <h2 onClick={() => {
            router.push("/")
        }} className="cursor-pointer text-xl font-semibold mb-4">Your Admin Rooms</h2>
        {adminRooms.length === 0 ? (
          <p className="text-gray-500">You are not admin of any rooms.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {adminRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>

      <div className='p-5'>
        <h2 className="text-xl font-semibold mb-4">Visited Rooms</h2>
        {visitedRooms.length === 0 ? (
          <p className="text-gray-500">You havent visited any rooms yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {visitedRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
        </div>
    </motion.div>
      </div>
  )
}
