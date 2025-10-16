"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/services/roomService";
import Card from "@/components/ui/Card";
import Link from "next/link";
import {
  MapPin,
  Users,
  Layers,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Filter,
  Search
} from "lucide-react";

export default function RoomListPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'occupied':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle };
      case 'maintenance':
        return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: MapPin };
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floor?.toString().includes(searchTerm.toLowerCase())
  );

  const statistics = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 gradient-primary rounded-full animate-pulse"></div>
          <p className="text-gray-600">Loading meeting rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-app-foreground mb-2">Error loading rooms</h3>
        <p className="text-app-foreground mb-6">{error}</p>
        <button
          onClick={loadRooms}
          className="px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Try Again
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-app-foreground mb-2">Meeting Rooms</h1>
          <p className="text-app-foreground">Manage and book meeting rooms</p>
        </div>
        <Link
          href="/rooms/new"
          className="px-6 py-3 gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Room</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-app-foreground">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.total}</p>
              <p className="text-sm text-app-foreground">Total Rooms</p>
            </div>
          </div>
        </Card>

        <Card className="border border-app-foreground">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.available}</p>
              <p className="text-sm text-app-foreground">Available</p>
            </div>
          </div>
        </Card>

        <Card className="border border-app-foreground">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.occupied}</p>
              <p className="text-sm text-app-foreground">Occupied</p>
            </div>
          </div>
        </Card>

        <Card className="border border-app-foreground">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.maintenance}</p>
              <p className="text-sm text-app-foreground">Maintenance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search rooms by name or floor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </Card>

      {/* Rooms Grid */}
      <div className="space-y-6">
        {filteredRooms.length === 0 ? (
          <Card className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first meeting room'}
            </p>
            {!searchTerm && (
              <Link
                href="/rooms/new"
                className="inline-flex items-center space-x-2 px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Room</span>
              </Link>
            )}
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Room Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Capacity</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Floor</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRooms.map((room) => {
                        const statusConfig = getStatusConfig(room.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <Link
                                href={`/rooms/${room.id}`}
                                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {room.name}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{room.capacity}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Layers className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{room.floor}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                                <StatusIcon className="w-4 h-4 mr-2" />
                                {room.status}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <Link
                                  href={`/rooms/${room.id}/edit`}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(room.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredRooms.map((room) => {
                const statusConfig = getStatusConfig(room.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={room.id} hover={true} className="group">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link
                            href={`/rooms/${room.id}`}
                            className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                          >
                            {room.name}
                          </Link>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{room.capacity} people</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Layers className="w-4 h-4" />
                              <span>Floor {room.floor}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {room.status}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                        <Link
                          href={`/rooms/${room.id}/book`}
                          className="px-3 py-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center space-x-1"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Book</span>
                        </Link>
                        <Link
                          href={`/rooms/${room.id}/edit`}
                          className="px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 