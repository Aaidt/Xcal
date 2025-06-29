
interface RoomCardProps {
  room: {
    id: number
    slug: string
    created_at: string
  }
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="text-lg font-bold">{room.slug}</h3>
      <p className="text-sm text-gray-500">Created: {new Date(room.created_at).toLocaleDateString()}</p>
    </div>
  );
}
