'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContactForm from '@/components/contact/ContactForm';
import { ContactFormData } from '@/types/contact';
import { contactService } from '@/services/contactService';

export default function CreateContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactService.createContact(data);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Contact</h1>
          <p className="text-gray-600 mt-1">Add a new contact to the Office Management System directory</p>
        </div>
        <button
          onClick={() => router.push('/contacts')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Back to Directory
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
} 