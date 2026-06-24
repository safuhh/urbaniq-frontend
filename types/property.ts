export interface IProperty {
  _id: string;
  status: string;
  propertyType: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  price: number;
  images?: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  description: string;
  amenities?: string[];
  agentId?: {
    profileImage?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  };
  ownerId?: {
    firstName: string;
    lastName: string;
  };
}

export interface IPropertyFilter {
  search?: string;
  status?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}
