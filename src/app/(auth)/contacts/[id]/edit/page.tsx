'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactForm, { ContactFormData } from '@/components/contact/ContactForm';
import { contactService } from '@/services/contactService';

interface EditContactPageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function EditContactPage({ params }: EditContactPageProps) {
  const router = useRouter();
  const [contact, setContact] = useState<ContactFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContact();
  }, [params.id]);

  const loadContact = async () => {
    try {
      const data = await contactService.getById(params.id);
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
      await contactService.update(params.id, data);
      router.push('/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Contact</h1>
        <button
          onClick={() => router.push('/contacts')}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ContactForm
          initialData={contact}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 