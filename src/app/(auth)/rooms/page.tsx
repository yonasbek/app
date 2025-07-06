"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/services/roomService";
import Link from "next/link";

export default function RoomListPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    await roomService.remove(id);
    loadRooms();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meeting Rooms</h1>
        <Link href="/rooms/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Room</Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/rooms/${room.id}`} className="text-blue-600 hover:underline font-semibold">
                      {room.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.floor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.status === 'available' ? 'bg-green-100 text-green-800' : room.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link href={`/rooms/${room.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                      <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">No rooms found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 