'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ContactForm from '@/components/contact/ContactForm';
import { Contact, ContactFormData } from '@/types/contact';
import { contactService } from '@/services/contactService';

interface EditContactPageProps {
  params: Promise<{ id: string }>
}

export default function EditContactPage({ params }: EditContactPageProps) {
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);
  
  useEffect(() => {
    loadContact();
  }, [resolvedParams.id]);

  const loadContact = async () => {
    try {
      const data = await contactService.getContactById(resolvedParams.id);
      setContact(data);
    } catch (error) {
      console.error('Error loading contact:', error);
      alert('Failed to load contact. Please try again.');
      router.push('/contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactService.updateContact(resolvedParams.id, data);
      router.push('/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Not Found</h1>
          <button
            onClick={() => router.push('/contacts')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Contact</h1>
          <p className="text-gray-600 mt-1">Update contact information for {contact.instituteName}</p>
        </div>
        <button
          onClick={() => router.push('/contacts')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Back to Directory
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ContactForm
          initialData={contact}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 