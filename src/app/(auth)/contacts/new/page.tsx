'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContactForm, { ContactFormData } from '@/components/contact/ContactForm';
import { contactService } from '@/services/contactService';

export default function CreateContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactService.create(data);
      router.push('/contacts');
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Failed to create contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-900 font-bold">Create New Contact</h1>
        <button
          onClick={() => router.push('/contacts')}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
} 