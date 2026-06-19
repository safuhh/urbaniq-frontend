import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function OwnerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your properties and track performance.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> List New Property
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>My Properties</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                 <tr>
                   <th className="px-4 py-3 rounded-tl-lg">Property Name</th>
                   <th className="px-4 py-3">Location</th>
                   <th className="px-4 py-3">Price</th>
                   <th className="px-4 py-3">Status</th>
                   <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 <tr className="border-b last:border-0">
                   <td className="px-4 py-3 font-medium">Glass Pavilion Estate</td>
                   <td className="px-4 py-3 text-muted-foreground">Beverly Hills, CA</td>
                   <td className="px-4 py-3 font-medium">$8,450,000</td>
                   <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span></td>
                   <td className="px-4 py-3">
                     <Button variant="ghost" size="sm">Edit</Button>
                   </td>
                 </tr>
                 <tr className="border-b last:border-0">
                   <td className="px-4 py-3 font-medium">Azure Heights</td>
                   <td className="px-4 py-3 text-muted-foreground">Dubai, UAE</td>
                   <td className="px-4 py-3 font-medium">$4,200,000</td>
                   <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span></td>
                   <td className="px-4 py-3">
                     <Button variant="ghost" size="sm">Edit</Button>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
