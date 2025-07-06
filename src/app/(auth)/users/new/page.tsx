"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, RegisterData } from "@/services/authService";
import { roleService } from "@/services/roleService";
import { departmentService } from "@/services/departmentService";
import Link from "next/link";
import { userService } from "@/services/userService";

const jobTitleOptions = [
  { value: "", label: "Select Job Title" },
  { value: "Manager", label: "Manager" },
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
  { value: "Other", label: "Other" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    departmentId: "",
    username: "",
    password: "",
    confirmPassword: "",
    roleId: "",
    supervisorName: "",
    comments: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [supervisorOptions, setSupervisorOptions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch roles and departments from backend
    roleService.getAll().then((roles) => {
      setRoleOptions(roles);
    });
    departmentService.getAll().then((departments) => {
      setDepartmentOptions(departments);
    });
    userService.getAll().then((users) => {
      setSupervisorOptions(users);
    });
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.fullName) newErrors.fullName = "Full Name is required";
    if (!form.email) newErrors.email = "Email Address is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address";
    if (!form.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!form.jobTitle) newErrors.jobTitle = "Job Title is required";
    if (!form.departmentId) newErrors.departmentId = "Department is required";
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.roleId) newErrors.roleId = "Role is required";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const validationErrors = validate();
    // setErrors(validationErrors);
    // if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await authService.register(form);
      router.push("/users");
    } catch (error: any) {
      setErrors({ api: error?.response?.data?.message || "Registration failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Link href="/users" className="text-blue-500 hover:text-blue-700 mb-4 block text-right">Back to Users</Link>
      <h1 className="text-2xl font-bold mb-6 text-center">User Registration</h1>
      <form className="space-y-5 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        {errors.api && <div className="text-red-500 text-center">{errors.api}</div>}
        <div>
          <label className="block font-semibold mb-1">Full Name<span className="text-red-500">*</span></label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          {errors.fullName && <div className="text-red-500 text-sm">{errors.fullName}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Email Address<span className="text-red-500">*</span></label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone Number<span className="text-red-500">*</span></label>
          <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          {errors.phoneNumber && <div className="text-red-500 text-sm">{errors.phoneNumber}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Job Title / Position<span className="text-red-500">*</span></label>
          <select name="jobTitle" value={form.jobTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            {jobTitleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.jobTitle && <div className="text-red-500 text-sm">{errors.jobTitle}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Department<span className="text-red-500">*</span></label>
          <select name="departmentId" value={form.departmentId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select Department</option>
            {departmentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
          {errors.departmentId && <div className="text-red-500 text-sm">{errors.departmentId}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Username<span className="text-red-500">*</span></label>
          <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Password<span className="text-red-500">*</span></label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Confirm Password<span className="text-red-500">*</span></label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Role<span className="text-red-500">*</span></label>
          <select name="roleId" value={form.roleId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select Role</option>
            {roleOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
          {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
        </div>
        <div>
            <label className="block font-semibold mb-1">Supervisor Name</label>
            <select name="supervisorName" value={form.supervisorName} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Select Supervisor</option>
              {supervisorOptions.map((opt) => (
                <option key={opt.id} value={opt.fullName}>{opt.fullName}</option>
              ))}
            </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Comments / Notes</label>
          <textarea name="comments" value={form.comments} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
} 