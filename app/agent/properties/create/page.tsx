'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PropertyForm } from '@/components/property/PropertyForm';
import { usePropertyStore } from '@/store/propertyStore';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { createProperty, isLoading, error } = usePropertyStore();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createProperty(formData);
      router.push('/agent/properties');
    } catch (err) {
      console.error('Failed to create property', err);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Property Listing</h1>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
