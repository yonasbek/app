import React, { useState } from 'react';

interface ContactFormProps {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  isSubmitting?: boolean;
}

export interface ContactFormData {
  fullName: string;
  jobTitle: string;
  department: string;
  officePhone: string;
  mobileNumber?: string;
  emailAddress: string;
  location?: string;
  availableHour?: string;
  availableHourDesc?: string;
  category: string;
}

const departmentOptions = [
  { value: '', label: 'Select Department' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
];

const categoryOptions = [
  { value: '', label: 'Select Category' },
  { value: 'partner', label: 'Partner' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'agency', label: 'Agency' },
];

export default function ContactForm({ initialData = {}, onSubmit, isSubmitting }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({
    fullName: initialData.fullName || '',
    jobTitle: initialData.jobTitle || '',
    department: initialData.department || '',
    officePhone: initialData.officePhone || '',
    mobileNumber: initialData.mobileNumber || '',
    emailAddress: initialData.emailAddress || '',
    location: initialData.location || '',
    availableHour: initialData.availableHour || '',
    availableHourDesc: initialData.availableHourDesc || '',
    category: initialData.category || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.fullName) newErrors.fullName = 'Full Name is required';
    if (!form.jobTitle) newErrors.jobTitle = 'Job Title is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.officePhone) newErrors.officePhone = 'Office Phone is required';
    if (!form.emailAddress) newErrors.emailAddress = 'Email Address is required';
    if (form.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) {
      newErrors.emailAddress = 'Invalid email address';
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  };

  return (
    <form className="space-y-6 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <div>
        <label className="block font-semibold mb-1">Full Name<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.fullName && <div className="text-red-500 text-sm">{errors.fullName}</div>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Job Title<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="jobTitle"
          value={form.jobTitle}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.jobTitle && <div className="text-red-500 text-sm">{errors.jobTitle}</div>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Department<span className="text-red-500">*</span></label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          {departmentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.department && <div className="text-red-500 text-sm">{errors.department}</div>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Office Phone<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="officePhone"
          value={form.officePhone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. +251..."
          required
        />
        {errors.officePhone && <div className="text-red-500 text-sm">{errors.officePhone}</div>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Mobile Number</label>
        <input
          type="text"
          name="mobileNumber"
          value={form.mobileNumber}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Email Address<span className="text-red-500">*</span></label>
        <input
          type="email"
          name="emailAddress"
          value={form.emailAddress}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.emailAddress && <div className="text-red-500 text-sm">{errors.emailAddress}</div>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Location / Floor</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Available Hour</label>
        <input
          type="datetime-local"
          name="availableHour"
          value={form.availableHour}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="availableHourDesc"
          value={form.availableHourDesc}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mt-2"
          placeholder="Description (optional)"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
} 