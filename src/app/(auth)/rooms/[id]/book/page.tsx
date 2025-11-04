"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { bookingService } from "@/services/bookingService";
import { EthiopianDatePicker } from "@/components/ui/ethiopian-date-picker";

const initialForm = {
  title: "",
  description: "",
  start_time: "",
  end_time: "",
  is_recurring: false,
  recurring_pattern: {
    frequency: "weekly",
    interval: 1,
    end_date: "",
  },
};

export default function BookRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;
  const [form, setForm] = useState<any>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name.startsWith("recurring_pattern.")) {
      const key = name.split(".")[1];
      setForm((prev: any) => ({
        ...prev,
        recurring_pattern: {
          ...prev.recurring_pattern,
          [key]: value,
        },
      }));
    } else if (type === "checkbox") {
      setForm((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await bookingService.create({
        ...form,
        room_id: roomId,
        start_time: form.start_time,
        end_time: form.end_time,
        is_recurring: form.is_recurring,
        recurring_pattern: form.is_recurring ? form.recurring_pattern : undefined,
        attendee_ids: [], // You can add attendee selection if needed
      });
      router.push(`/rooms/${roomId}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to book room");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Book Meeting Room</h1>
      <form className="space-y-5 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Start Time</label>
          <EthiopianDatePicker
            label=""
            value={form.start_time ? new Date(form.start_time) : null}
            onChange={(selectedDate: Date) => {
              // Adjust for timezone offset to ensure correct local date
              const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
              setForm((prev: any) => ({
                ...prev,
                start_time: localDate.toISOString().split('T')[0],
              }));
            }}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">End Time</label>
          <EthiopianDatePicker
            label=""
            value={form.end_time ? new Date(form.end_time) : null}
            onChange={(selectedDate: Date) => {
              // Adjust for timezone offset to ensure correct local date
              const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
              setForm((prev: any) => ({
                ...prev,
                end_time: localDate.toISOString().split('T')[0],
              }));
            }}
          />
        </div>
        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" name="is_recurring" checked={form.is_recurring} onChange={handleChange} className="mr-2" />
            Recurring Meeting
          </label>
        </div>
        {form.is_recurring && (
          <div className="space-y-2">
            <div>
              <label className="block font-semibold mb-1">Frequency</label>
              <select name="recurring_pattern.frequency" value={form.recurring_pattern.frequency} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Interval</label>
              <input type="number" name="recurring_pattern.interval" value={form.recurring_pattern.interval} onChange={handleChange} className="w-full border rounded px-3 py-2" min={1} />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date</label>
              <EthiopianDatePicker
                label=""
                value={form.recurring_pattern.end_date ? new Date(form.recurring_pattern.end_date) : null}
                onChange={(selectedDate: Date) => setForm((prev: any) => ({ ...prev, recurring_pattern: { ...prev.recurring_pattern, end_date: selectedDate.toISOString().split('T')[0] } }))}
                className="w-full"
              />
            </div>
          </div>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Book Room"}
        </button>
      </form>
    </div>
  );
} 