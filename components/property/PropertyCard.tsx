import React from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, MessageCircle, Heart, Star } from 'lucide-react';
import { IProperty } from '@/types/property';

interface PropertyCardProps {
  property: IProperty;
  href?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, href }) => {
  const cardHref = href || `/properties/${property._id}`;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
  
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  const formattedPrice = property.price ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price) : 'Contact for price';

  return (
    <Link href={cardHref} className="block h-full group">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {property.images && property.images.length > 0 ? (
            <img 
              src={getImageUrl(property.images[0])} 
              alt={property.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20 font-medium">
              No Image Available
            </div>
          )}
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 pointer-events-none" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-zinc-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {property.status}
          </div>

          {/* Favorite Button Overlay (Visual only for now) */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer transition-colors border border-white/30">
            <Heart className="w-4 h-4" />
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-2xl font-bold tracking-tight drop-shadow-md">
              {formattedPrice}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col bg-card">
          <div className="flex items-center text-muted-foreground text-sm mb-2.5">
            <MapPin className="w-4 h-4 mr-1 text-primary/70" />
            <span className="truncate font-medium">{property.location?.city}, {property.location?.state}</span>
          </div>
          
          <h3 className="font-bold text-xl line-clamp-1 mb-2 text-foreground group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-5 flex-1 leading-relaxed">
            {property.description}
          </p>
          
          {/* Features Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="flex items-center gap-1.5 bg-muted/50 text-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
              <Bed className="w-4 h-4 text-muted-foreground"/>
              <span>{property.features?.bedrooms || 0} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/50 text-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
              <Bath className="w-4 h-4 text-muted-foreground"/>
              <span>{property.features?.bathrooms || 0} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/50 text-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
              <Square className="w-4 h-4 text-muted-foreground"/>
              <span>{property.features?.area || 0} sqft</span>
            </div>
          </div>
          
          {/* Agent Info Footer */}
          <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted overflow-hidden border border-border shrink-0 shadow-sm">
                <img 
                  src={(property.agentId as any)?.agentProfile?.profileImage ? getImageUrl((property.agentId as any).agentProfile.profileImage) : "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"} 
                  alt="Agent" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Listed by</span>
                <span className="text-sm font-semibold truncate leading-tight">
                  {property.agentId?.firstName} {property.agentId?.lastName}
                </span>
              </div>
            </div>
            
            {(property.agentId as any)?.agentProfile?.whatsapp && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const num = (property.agentId as any).agentProfile.whatsapp.replace(/\D/g, '');
                  window.open(`https://wa.me/${num}`, '_blank');
                }}
                className="group/wa flex items-center justify-center w-9 h-9 rounded-full bg-green-50 hover:bg-green-500 text-green-600 hover:text-white transition-colors shadow-sm"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 transition-transform group-hover/wa:scale-110" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

