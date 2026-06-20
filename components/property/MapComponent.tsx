import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';

// Fix Leaflet's default icon issue with bundlers
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface MapComponentProps {
  locationData: LocationData;
  onChange: (data: LocationData) => void;
  readOnly?: boolean;
}

// Component to handle map center updates when props change
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Component to handle clicks on the map
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default function MapComponent({ locationData, onChange, readOnly = false }: MapComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Default to a generic location if coordinates are 0,0
  const center: [number, number] = locationData.coordinates.lat !== 0 && locationData.coordinates.lng !== 0 
    ? [locationData.coordinates.lat, locationData.coordinates.lng] 
    : [40.7128, -74.0060]; // Default New York

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsSearching(true);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      if (response.data && response.data.address) {
        const addr = response.data.address;
        
        onChange({
          address: addr.road || addr.suburb || addr.neighbourhood || response.data.name || '',
          city: addr.city || addr.town || addr.village || addr.county || '',
          state: addr.state || '',
          country: addr.country || '',
          zipCode: addr.postcode || '',
          coordinates: { lat, lng }
        });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Still update coordinates even if reverse geocode fails
      onChange({
        ...locationData,
        coordinates: { lat, lng }
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const addr = result.address;
    
    onChange({
      address: addr.road || addr.suburb || addr.neighbourhood || result.name || '',
      city: addr.city || addr.town || addr.village || addr.county || '',
      state: addr.state || '',
      country: addr.country || '',
      zipCode: addr.postcode || '',
      coordinates: { lat, lng }
    });
    
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsSearching(false);
          alert("Could not detect location. Please search manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search for a location worldwide..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch(e as unknown as React.FormEvent);
                    }
                  }}
                  className="pl-9"
                />
              </div>
              <Button type="button" variant="secondary" onClick={handleSearch} disabled={isSearching || !searchQuery}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
            
            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-[1000] top-full mt-1 w-full bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, i) => (
                  <div 
                    key={i} 
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 text-sm"
                    onClick={() => handleSelectResult(result)}
                  >
                    {result.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button type="button" variant="outline" onClick={handleDetectLocation} className="gap-2 shrink-0">
            <MapPin className="h-4 w-4" />
            Detect
          </Button>
        </div>
      )}

      <div className="border rounded-md overflow-hidden relative z-0 h-[400px]">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={center} />
          {!readOnly && <MapClickHandler onLocationSelect={reverseGeocode} />}
          
          {locationData.coordinates.lat !== 0 && (
            <Marker 
              position={center} 
              icon={icon}
              draggable={!readOnly}
              eventHandlers={{
                dragend: (e) => {
                  if (readOnly) return;
                  const marker = e.target;
                  const position = marker.getLatLng();
                  reverseGeocode(position.lat, position.lng);
                }
              }}
            />
          )}
        </MapContainer>
        
        {/* Helper overlay text */}
        {!readOnly && (
          <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-medium shadow-sm border pointer-events-none">
            Click map or drag marker to set precise location
          </div>
        )}
      </div>
    </div>
  );
}
