"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Bed, Bath, Square, Calendar, Share, Heart, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`)
        setProperty(response.data)
      } catch (error) {
        console.error("Failed to fetch property:", error)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchProperty()
    }
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading property details...</div>
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Property not found.</div>
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="container mx-auto px-4 max-w-screen-xl py-6">
        <Link href="/properties" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to properties
        </Link>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="flex gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">{property.status || 'For Sale'}</Badge>
              <Badge className="bg-black text-white border-none">{property.type || 'Property'}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{property.title}</h1>
            <p className="text-lg text-muted-foreground flex items-center gap-1">
              <MapPin className="h-5 w-5" /> {property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.zipCode}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-4xl font-bold text-primary">${property.price?.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">${Math.round(property.price / (property.features?.area || 1))} / sqft</p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[50vh] min-h-[400px]">
          <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden bg-muted">
            <Image 
              src={property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"} 
              alt="Main view" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden hidden md:block bg-muted">
            <Image 
              src={property.images?.[1] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"} 
              alt="Interior" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden hidden md:block bg-muted">
            <Image 
              src={property.images?.[2] || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1153&q=80"} 
              alt="Kitchen" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden hidden md:block bg-muted">
            <Image 
              src={property.images?.[3] || "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"} 
              alt="Bedroom" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden hidden md:block group cursor-pointer bg-muted">
            <Image 
              src={property.images?.[4] || "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"} 
              alt="Bathroom" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            {property.images?.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-medium">+{property.images.length - 5} Photos</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-10">
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 py-6 border-y">
              <div className="flex items-center gap-3">
                <Bed className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="font-bold text-xl">{property.features?.bedrooms || 0}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Bedrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="font-bold text-xl">{property.features?.bathrooms || 0}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Bathrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Square className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="font-bold text-xl">{property.features?.area || 0}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Square Feet</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="font-bold text-xl">{property.features?.yearBuilt || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Year Built</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About this property</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  {property.description}
                </p>
              </div>
            </section>
            
            {/* Amenities */}
            {property.features?.amenities?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                  {property.features.amenities.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" /> {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-[400px]">
            <div className="sticky top-24">
              <Card className="border shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-semibold text-lg">Interested?</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full"><Share className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full"><Heart className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 p-4 bg-muted/40 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden relative">
                       <Image src={property.agent?.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"} alt="Agent" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.agent ? `${property.agent.firstName} ${property.agent.lastName}` : 'Agent Not Assigned'}</div>
                      <div className="text-xs text-muted-foreground">{property.agent ? 'Premier Agent' : ''}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12 text-base" size="lg" disabled={!property.agent}>
                      {property.agent ? 'Contact Agent' : 'Contact Support'}
                    </Button>
                    <Button variant="outline" className="w-full h-12 text-base" size="lg">Schedule a Visit</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
