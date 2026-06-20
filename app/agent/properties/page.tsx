'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePropertyStore } from '@/store/propertyStore';
import { IProperty } from '@/types/property';
import { Loader2, Plus, Edit, Trash2, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PropertiesManagementPage() {
  const { properties, isLoading, error, fetchAgentProperties, deleteProperty } = usePropertyStore();

  useEffect(() => {
    fetchAgentProperties();
  }, [fetchAgentProperties]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property listing? This action cannot be undone.')) {
      await deleteProperty(id);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20 pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Properties</h1>
            <p className="text-muted-foreground mt-1">
              View, edit, and manage your property listings.
            </p>
          </div>
          <Link href="/agent/properties/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-card border rounded-xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't listed any properties yet. Create your first property listing to get started.
            </p>
            <Link href="/agent/properties/create">
              <Button>Create Property</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Property</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {properties.map((property: IProperty) => (
                    <motion.tr 
                      key={property._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                            {property.images && property.images.length > 0 ? (() => {
                              const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
                              const imgSrc = property.images[0].startsWith('http') ? property.images[0] : `${baseUrl}${property.images[0]}`;
                              return (
                                <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                              );
                            })() : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-xs text-muted-foreground">No img</div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-base line-clamp-1">{property.title}</p>
                            <p className="text-muted-foreground text-xs">{property.propertyType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="line-clamp-1">{property.location?.city}, {property.location?.state}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${property.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={property.status === 'Available' ? 'default' : 'secondary'} className="font-normal">
                          {property.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/agent/properties/${property._id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(property._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
