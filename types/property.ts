export interface IUserPopulated {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  amenities: string[];
  images: string[];
  status: 'Available' | 'Pending' | 'Sold' | 'Rented';
  propertyType: 'Villa' | 'Apartment' | 'Penthouse' | 'Commercial' | 'Townhouse' | 'Land';
  ownerId: IUserPopulated | any;
  agentId?: IUserPopulated | any;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  propertyType?: string;
  bedrooms?: number;
}
