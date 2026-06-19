import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, MapPin, Search } from "lucide-react"

export default function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your activity.</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" /> Find Properties
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Recently Saved</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
             <div className="h-40 bg-muted flex items-center justify-center">
                <Building className="h-8 w-8 text-muted-foreground/50" />
             </div>
             <CardContent className="p-4">
                <div className="font-semibold truncate">Property {i}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> Location {i}
                </div>
                <div className="mt-4 flex justify-between items-center">
                   <div className="font-bold text-primary">$1,200,000</div>
                   <Button variant="outline" size="sm">View</Button>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
