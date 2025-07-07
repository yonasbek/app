import React, { useState, useEffect } from 'react';
import { 
  ContactFormData, 
  ContactType, 
  ContactPosition, 
  CONTACT_TYPE_LABELS, 
  CONTACT_POSITION_LABELS,
  AutocompleteResponse 
} from '@/types/contact';
import { contactService } from '@/services/contactService';

interface ContactFormProps {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  isSubmitting?: boolean;
}

export default function ContactForm({ initialData = {}, onSubmit, isSubmitting }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({
    instituteName: initialData.instituteName || '',
    individualName: initialData.individualName || '',
    position: initialData.position || ContactPosition.OTHER,
    phoneNumber: initialData.phoneNumber || '',
    emailAddress: initialData.emailAddress || '',
    organizationType: initialData.organizationType || ContactType.MOH_AGENCIES,
    region: initialData.region || '',
    location: initialData.location || '',
    availableHours: initialData.availableHours || '',
    alternativePhone: initialData.alternativePhone || '',
    notes: initialData.notes || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [autocomplete, setAutocomplete] = useState<AutocompleteResponse>({ institutions: [], regions: [] });

  useEffect(() => {
    // Load autocomplete data
    const loadAutocomplete = async () => {
      try {
        const response = await contactService.getAutocomplete('');
        setAutocomplete(response);
      } catch (error) {
        console.error('Failed to load autocomplete data:', error);
      }
    };
    loadAutocomplete();
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.instituteName) newErrors.instituteName = 'Institution Name is required';
    if (!form.individualName) newErrors.individualName = 'Individual Name is required';
    if (!form.position) newErrors.position = 'Position is required';
    if (!form.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    if (!form.emailAddress) newErrors.emailAddress = 'Email Address is required';
    if (!form.organizationType) newErrors.organizationType = 'Organization Type is required';
    
    if (form.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) {
      newErrors.emailAddress = 'Invalid email address';
    }
    
    if (form.phoneNumber && !/^[\+]?[\d\s\-\(\)]+$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    
    if (form.alternativePhone && !/^[\+]?[\d\s\-\(\)]+$/.test(form.alternativePhone)) {
      newErrors.alternativePhone = 'Invalid alternative phone number format';
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
    <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Institution Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="instituteName"
            value={form.instituteName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Federal Ministry of Health"
            required
            list="institutions"
          />
          <datalist id="institutions">
            {autocomplete.institutions.map((institution, index) => (
              <option key={index} value={institution} />
            ))}
          </datalist>
          {errors.instituteName && <div className="text-red-500 text-sm mt-1">{errors.instituteName}</div>}
        </div>

        {/* Individual Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Individual Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="individualName"
            value={form.individualName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Dr. John Smith"
            required
          />
          {errors.individualName && <div className="text-red-500 text-sm mt-1">{errors.individualName}</div>}
        </div>

        {/* Organization Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Type<span className="text-red-500">*</span>
          </label>
          <select
            name="organizationType"
            value={form.organizationType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {Object.entries(CONTACT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.organizationType && <div className="text-red-500 text-sm mt-1">{errors.organizationType}</div>}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position<span className="text-red-500">*</span>
          </label>
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {Object.entries(CONTACT_POSITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.position && <div className="text-red-500 text-sm mt-1">{errors.position}</div>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., +251911234567"
            required
          />
          {errors.phoneNumber && <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="emailAddress"
            value={form.emailAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., john.smith@moh.gov.et"
            required
          />
          {errors.emailAddress && <div className="text-red-500 text-sm mt-1">{errors.emailAddress}</div>}
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <input
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Addis Ababa"
            list="regions"
          />
          <datalist id="regions">
            {autocomplete.regions.map((region, index) => (
              <option key={index} value={region} />
            ))}
          </datalist>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Building A, Floor 3, Room 301"
          />
        </div>

        {/* Alternative Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternative Phone
          </label>
          <input
            type="tel"
            name="alternativePhone"
            value={form.alternativePhone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., +251115551234"
          />
          {errors.alternativePhone && <div className="text-red-500 text-sm mt-1">{errors.alternativePhone}</div>}
        </div>

        {/* Available Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Hours
          </label>
          <input
            type="text"
            name="availableHours"
            value={form.availableHours}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Monday-Friday 8:00 AM - 5:00 PM"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes or comments..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Save Contact'}
        </button>
      </div>
    </form>
  );
} 