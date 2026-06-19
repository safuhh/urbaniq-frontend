"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties')
        setProperties(response.data)
      } catch (error) {
        console.error("Failed to fetch properties:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  return (
    <div className="bg-muted/20 min-h-screen pb-24">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 max-w-screen-2xl py-4 flex gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search by location, building, or keyword..." className="pl-9 bg-muted/30 border-none h-10" />
          </div>
          <Button variant="outline" className="hidden sm:flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="hidden sm:flex items-center gap-2">
            Sort by: Featured <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-2xl pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden md:block w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Property Type</h3>
              <div className="space-y-3">
                {['All', 'House/Villa', 'Apartment', 'Penthouse', 'Commercial'].map((type, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" defaultChecked={i===0} />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-8">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Price Range</h3>
              <div className="flex items-center gap-2">
                 <Input placeholder="Min" className="h-9" />
                 <span className="text-muted-foreground">-</span>
                 <Input placeholder="Max" className="h-9" />
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Bedrooms</h3>
              <div className="flex flex-wrap gap-2">
                {['Any', '1', '2', '3', '4', '5+'].map((num, i) => (
                  <button key={i} className={`h-8 px-3 rounded-full border text-sm font-medium ${i===0 ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-muted'}`}>
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Property Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-end">
              <h1 className="text-2xl font-bold tracking-tight">Properties for Sale</h1>
              <span className="text-sm text-muted-foreground">{properties.length} results</span>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted-foreground">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No properties found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Link href={`/properties/${property._id}`} key={property._id}>
                    <Card className="overflow-hidden border-0 shadow-sm group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={property.images?.[0] || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1153&q=80"}
                          alt={property.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className={`absolute top-4 left-4 border-none text-white bg-primary/90`}>
                          {property.status}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg leading-tight truncate pr-4">{property.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                          <MapPin className="h-3.5 w-3.5" /> {property.location?.city}, {property.location?.state}
                        </p>
                        
                        <div className="text-xl font-bold text-primary mb-4">${property.price?.toLocaleString()}</div>
                        
                        <div className="flex justify-between text-xs text-muted-foreground border-t pt-4">
                          <span><strong>{property.features?.bedrooms || 0}</strong> Beds</span>
                          <span><strong>{property.features?.bathrooms || 0}</strong> Baths</span>
                          <span><strong>{property.features?.area || 0}</strong> sqft</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            
            {!loading && properties.length > 0 && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">Load More Results</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
