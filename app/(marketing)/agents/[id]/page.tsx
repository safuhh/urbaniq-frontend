'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/store/authStore';
import { IProperty } from '@/types/property';
import { Loader2, MapPin, Phone, MessageCircle, ArrowLeft, Mail, BadgeCheck, Home, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { motion } from 'framer-motion';

export default function PublicAgentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [agent, setAgent] = useState<User | null>(null);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgentAndProperties = async () => {
      try {
        setIsLoading(true);
        const agentRes = await api.get(`/agent-profiles/user/${id}`);
        const profileData = agentRes.data;
        
        // Map AgentProfile schema back to flat User object for the UI
        setAgent({
          ...profileData.user,
          profileImage: profileData.profileImage,
          whatsapp: profileData.whatsapp,
          bio: profileData.bio,
          location: profileData.location,
          createdAt: profileData.user?.createdAt,
        });
        
        // Fetch Agent's Active Properties
        const propRes = await api.get(`/properties?agentId=${id}`);
        setProperties(propRes.data.data);
      } catch (err: any) {
        setError('Agent not found or an error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchAgentAndProperties();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="bg-destructive/5 border border-destructive/20 text-destructive p-8 rounded-2xl text-center max-w-md shadow-sm">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeCheck className="w-8 h-8 opacity-50" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-destructive/80 mb-6">{error}</p>
          <Button variant="default" onClick={() => router.push('/properties')} className="w-full">
            Browse All Properties
          </Button>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    if (agent.whatsapp) {
      const formattedNumber = agent.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${formattedNumber}`, '_blank');
    }
  };

  const memberSince = (agent as any).createdAt 
    ? new Date((agent as any).createdAt).getFullYear() 
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-muted/20 pb-24 pt-20">
      {/* Premium Hero Banner */}
      <div className="relative bg-zinc-950 text-white overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10 py-16 lg:py-24">
          <Button 
            variant="ghost" 
            className="mb-8 -ml-4 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings
          </Button>
          
          <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
            {/* Avatar with Status/Badge */}
            <div className="relative shrink-0">
              <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-zinc-800 bg-zinc-900 shadow-2xl relative z-10">
                <img 
                  src={agent.profileImage ? (agent.profileImage.startsWith('http') ? agent.profileImage : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'}${agent.profileImage}`) : "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"} 
                  alt={`${agent.firstName} ${agent.lastName}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verification Badge */}
              <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 z-20 bg-blue-500 text-white p-2 rounded-full shadow-lg border-2 border-zinc-950" title="Verified Agent">
                <BadgeCheck className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
            </div>
            
            {/* Details */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 tracking-tight text-white">
                    {agent.firstName} {agent.lastName}
                  </h1>
                  <p className="text-xl text-primary font-medium tracking-wide">
                    Premier Real Estate Broker
                  </p>
                </div>
                
                {/* Quick Stats Grid */}
                <div className="flex gap-6 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm self-start">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">{properties.length}</span>
                    <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Active Listings</span>
                  </div>
                  <div className="w-px bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">{memberSince}</span>
                    <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Member Since</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 text-sm text-zinc-300 mb-8">
                {agent.location?.city && (
                  <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <MapPin className="w-4 h-4 text-primary" /> {agent.location.area ? `${agent.location.area}, ` : ''}{agent.location.city}
                  </div>
                )}
                {agent.phone && (
                  <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Phone className="w-4 h-4 text-primary" /> {agent.phone}
                  </div>
                )}
                {agent.email && (
                  <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Mail className="w-4 h-4 text-primary" /> {agent.email}
                  </div>
                )}
              </div>
              
              {/* Primary Actions */}
              <div className="flex flex-wrap gap-4">
                {agent.whatsapp && (
                  <Button 
                    onClick={handleWhatsApp} 
                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 h-12 text-base rounded-full shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
                  </Button>
                )}
                {agent.phone && (
                  <Button 
                    variant="outline" 
                    className="border-zinc-600 text-white hover:bg-white hover:text-zinc-950 font-bold px-8 h-12 text-base rounded-full transition-all hover:-translate-y-0.5 bg-transparent" 
                    onClick={() => window.open(`tel:${agent.phone}`)}
                  >
                    <Phone className="w-5 h-5 mr-2" /> Call Agent
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Bio & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/60 sticky top-24">
            <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              About {agent.firstName}
            </h2>
            {agent.bio ? (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                {agent.bio}
              </p>
            ) : (
              <p className="text-muted-foreground italic">Professional biography coming soon.</p>
            )}
            
            <hr className="my-8 border-border/60" />
            
            <h3 className="font-bold text-lg mb-4">Contact Details</h3>
            <div className="space-y-4">
              {agent.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Direct Line</p>
                    <p className="font-semibold">{agent.phone}</p>
                  </div>
                </div>
              )}
              {agent.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-semibold truncate">{agent.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Listings */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <Home className="w-6 h-6 text-primary" /> 
              Exclusive Listings
            </h2>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
              {properties.length} Properties
            </div>
          </div>
          
          {properties.length === 0 ? (
            <div className="bg-card border border-dashed border-border/80 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Home className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Active Listings</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {agent.firstName} currently doesn't have any public properties available. Please check back later or contact them directly for off-market opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <PropertyCard property={property} href={`/properties/${property._id}`} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
