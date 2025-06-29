'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import RoomCard from '@/components/RoomCard'

interface Room {
  id: number
  created_at: string
  slug: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Dashboard() {
  const [adminRooms, setAdminRooms] = useState<Room[]>([])
  const [visitedRooms, setVisitedRooms] = useState<Room[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      const admin = await axios.get<{ adminRooms: Room[] }>(`${BACKEND_URL}/api/room/admin`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        }
      })
      setAdminRooms(admin.data.adminRooms || [])

      const visited = await axios.get<{ visitedRooms: Room[] }>(`${BACKEND_URL}/api/room/visited`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        }
      })
      setVisitedRooms(visited.data.visitedRooms || [])
    }

    fetchRooms()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Admin Rooms</h2>
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

      <div>
        <h2 className="text-xl font-semibold mb-2">Visited Rooms</h2>
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
    </div>
  )
}
