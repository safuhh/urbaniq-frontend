'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PropertyCard } from '../../../../components/property/PropertyCard';
import { PropertyFilters } from '../../../../components/property/PropertyFilters';
import { usePropertyStore } from '../../../../store/propertyStore';
import { IPropertyFilter } from '../../../../types/property';
import { Loader2 } from 'lucide-react';

export default function PropertiesPage() {
  const { properties, isLoading, error, fetchProperties } = usePropertyStore();
  const [filters, setFilters] = useState<IPropertyFilter>({});

  useEffect(() => {
    fetchProperties(filters);
  }, [fetchProperties, filters]);

  const handleFilterChange = (newFilters: IPropertyFilter) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20 pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Discover Your Perfect Home</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our exclusive collection of premium properties across the finest locations.
          </p>
        </motion.div>

        <PropertyFilters onFilterChange={handleFilterChange} />

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property, index) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
