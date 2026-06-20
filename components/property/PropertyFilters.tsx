import React, { useState } from 'react';
import { IPropertyFilter } from '@/types/property';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PropertyFiltersProps {
  onFilterChange: (filters: IPropertyFilter) => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFilterChange }) => {
  const [city, setCity] = useState('');
  
  const handleSearch = () => {
    onFilterChange({ city: city || undefined });
  };

  return (
    <div className="bg-background p-4 rounded-xl shadow-sm border mb-8 flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex-1 w-full">
        <Input 
          placeholder="Search by city..." 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          className="w-full"
        />
      </div>
      <Button onClick={handleSearch} className="w-full sm:w-auto">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
};
