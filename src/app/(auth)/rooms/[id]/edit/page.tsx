"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { roomService } from "@/services/roomService";

const initialForm = {
  name: "",
  capacity: 1,
  floor: "",
  status: "available",
  facilities: [],
  description: "",
  image: "",
};

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;
  const [form, setForm] = useState<any>(initialForm);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    roomService.getById(roomId)
      .then((data) => setForm(data))
      .catch(() => setError("Failed to load room"))
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await roomService.update(roomId, form);
      router.push("/rooms");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update room");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Meeting Room</h1>
      <form className="space-y-5 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Capacity</label>
          <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="w-full border rounded px-3 py-2" min={1} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Floor</label>
          <input type="text" name="floor" value={form.floor} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input type="text" name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
} 