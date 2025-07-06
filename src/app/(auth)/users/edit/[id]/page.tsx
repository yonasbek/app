"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import { roleService } from "@/services/roleService";
import { departmentService } from "@/services/departmentService";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const [form, setForm] = useState<any>(null);
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        router.push("/users");
      };
      setLoading(true);
      try {
        const user = await userService.getById(userId);
        const roles = await roleService.getAll();
        const departments = await departmentService.getAll();
        setForm({ ...user, role: user.roleId, department: user.departmentId });
        setRoleOptions(roles);
        setDepartmentOptions(departments);
      } catch {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await userService.update(userId, {
        ...form,
        roleId: form.role,
        departmentId: form.department,
      });
      router.push("/users");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  // if (!form) return <div className="text-center py-8 text-red-500">User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit User</h1>
      <form className="space-y-5 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input type="text" name="fullName" value={form.fullName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">First Name</label>
            <input type="text" name="firstName" value={form.firstName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Last Name</label>
            <input type="text" name="lastName" value={form.lastName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input type="email" name="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone Number</label>
          <input type="text" name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Job Title</label>
          <input type="text" name="jobTitle" value={form.jobTitle || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Username</label>
          <input type="text" name="username" value={form.username || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Role</label>
          <select name="role" value={form.role || ''} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select Role</option>
            {roleOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Department</label>
          <select name="department" value={form.department || ''} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select Department</option>
            {departmentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Supervisor Name</label>
          <input type="text" name="supervisorName" value={form.supervisorName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Comments</label>
          <textarea name="comments" value={form.comments || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
} 