"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { formatToEthiopianDateTime } from "@/utils/ethiopianDateUtils";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";

export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;
  const [room, setRoom] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    Promise.all([
      roomService.getById(roomId),
      bookingService.getByRoomId(roomId),
    ])
      .then(([roomData, bookingsData]) => {
        setRoom(roomData);
        setBookings(bookingsData);
      })
      .catch(() => setError("Failed to load room details"))
      .finally(() => setLoading(false));
  }, [roomId]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : !room ? (
        <div className="text-center py-8 text-gray-500">Room not found</div>
      ) : (
        <>
          <BackButton href="/rooms" label="Back to Meetings Rooms" className="mb-4" />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <Link href={`/rooms/${room.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
          </div>
          <div className="mb-4">
            <div className="text-gray-700">Capacity: {room.capacity}</div>
            <div className="text-gray-700">Floor: {room.floor}</div>
            <div className="text-gray-700">Status: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.status === 'available' ? 'bg-green-100 text-green-800' : room.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{room.status}</span></div>
            {room.description && <div className="text-gray-700 mt-2">{room.description}</div>}
            {room.images && room.images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.images.map((image: string, index: number) => {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-mo6f.onrender.com';
                    const imageUrl = `${API_URL}/upload/${image}`;
                    return (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${room.name} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                        onError={(e) => {
                          console.error('Failed to load image:', image);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="mb-6">
            <Link href={`/rooms/${room.id}/book`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Room</Link>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Bookings</h2>
            {bookings.length === 0 ? (
              <div className="text-gray-500">No bookings for this room.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{booking.title}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{formatToEthiopianDateTime(booking.start_time, true)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{formatToEthiopianDateTime(booking.end_time, true)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{booking.user_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
} 