'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertyForm } from '@/components/property/PropertyForm';
import { usePropertyStore } from '@/store/propertyStore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const { currentProperty, fetchPropertyById, updateProperty, isLoading, error } = usePropertyStore();

  useEffect(() => {
    if (id) {
      fetchPropertyById(id);
    }
  }, [id, fetchPropertyById]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateProperty(id, formData);
      router.push('/agent/properties');
    } catch (err) {
      console.error('Failed to update property', err);
    }
  };

  if (isLoading && !currentProperty) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Property Listing</h1>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <PropertyForm 
        initialData={currentProperty} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}
