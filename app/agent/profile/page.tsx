'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Loader2, Save, User as UserIcon, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AgentProfileSettings() {
  const { user, initialize } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    whatsapp: '',
    bio: '',
    city: '',
    area: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/agent-profiles/me');
        const data = res.data;
        setFormData({
          firstName: data.user?.firstName || '',
          lastName: data.user?.lastName || '',
          phone: data.user?.phone || '',
          whatsapp: data.whatsapp || '',
          bio: data.bio || '',
          city: data.location?.city || '',
          area: data.location?.area || '',
        });
        if (data.profileImage) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
          setPreviewImage(data.profileImage.startsWith('http') ? data.profileImage : `${baseUrl}${data.profileImage}`);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('phone', formData.phone);
      data.append('whatsapp', formData.whatsapp);
      data.append('bio', formData.bio);
      data.append('location', JSON.stringify({ city: formData.city, area: formData.area }));
      
      if (profileImage) {
        data.append('profileImage', profileImage);
      }

      await api.put('/agent-profiles/me', data);
      setMessage('Profile updated successfully!');
      await initialize(); // Refresh user data in store
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Public Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your public information that buyers will see on your listings.
        </p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {message && <div className="bg-green-100 text-green-800 p-4 rounded-lg font-medium">{message}</div>}
          {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg font-medium">{error}</div>}

          {/* Profile Image Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <UserIcon className="w-5 h-5 text-primary" /> Profile Image
            </div>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border">
                {previewImage ? (
                  <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <UserIcon className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload new image</label>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
              </div>
            </div>
          </section>

          {/* Personal Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <UserIcon className="w-5 h-5 text-primary" /> Personal Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Bio</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange}
                rows={4}
                placeholder="Tell buyers about your experience..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </section>

          {/* Contact Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <Phone className="w-5 h-5 text-primary" /> Contact Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp Number
                </label>
                <Input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Include country code, e.g. 12345678900" />
                <p className="text-xs text-muted-foreground">Used for direct Click-to-Chat buttons.</p>
              </div>
            </div>
          </section>

          {/* Location Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <MapPin className="w-5 h-5 text-primary" /> Service Area
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Dubai" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Area / Neighborhood</label>
                <Input name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Downtown" />
              </div>
            </div>
          </section>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-8 h-12">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
