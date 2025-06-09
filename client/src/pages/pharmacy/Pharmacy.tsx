import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  MapPin, 
  Clock, 
  Star, 
  Search,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  Navigation
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Pharmacy() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);

  const { data: pharmacyOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/pharmacy-orders'],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest('POST', '/api/pharmacy-orders', orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pharmacy-orders'] });
      toast({
        title: "Success",
        description: "Order placed successfully.",
      });
    },
  });

  // Mock pharmacy data
  const nearbyPharmacies = [
    {
      id: 1,
      name: "MedPlus Healthcare",
      address: "123 Main Street, Mumbai",
      distance: "0.5 km",
      rating: 4.8,
      deliveryTime: "30-45 min",
      isOpen: true,
      phone: "+91 98765 43210",
      services: ["Prescription", "OTC", "Home Delivery"]
    },
    {
      id: 2,
      name: "Apollo Pharmacy",
      address: "456 Park Road, Mumbai",
      distance: "1.2 km",
      rating: 4.6,
      deliveryTime: "45-60 min",
      isOpen: true,
      phone: "+91 98765 43211",
      services: ["24/7", "Prescription", "Emergency"]
    },
    {
      id: 3,
      name: "Wellness Pharmacy",
      address: "789 Health Avenue, Mumbai",
      distance: "2.1 km",
      rating: 4.4,
      deliveryTime: "60-75 min",
      isOpen: false,
      phone: "+91 98765 43212",
      services: ["Prescription", "Ayurveda", "Wellness"]
    }
  ];

  // Mock medicine data
  const popularMedicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      brand: "Crocin",
      price: 25,
      originalPrice: 30,
      category: "Pain Relief",
      prescription: false,
      inStock: true,
      image: "/api/placeholder/medicine/paracetamol"
    },
    {
      id: 2,
      name: "Tretinoin Cream 0.025%",
      brand: "Retino-A",
      price: 180,
      originalPrice: 200,
      category: "Dermatology",
      prescription: true,
      inStock: true,
      image: "/api/placeholder/medicine/tretinoin"
    },
    {
      id: 3,
      name: "Cetirizine 10mg",
      brand: "Zyrtec",
      price: 45,
      originalPrice: 50,
      category: "Allergy",
      prescription: false,
      inStock: true,
      image: "/api/placeholder/medicine/cetirizine"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const scheduleRefill = () => {
    toast({
      title: "Refill Scheduled",
      description: "We'll remind you when it's time to refill your prescription.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pharmacy Marketplace</h1>
          <p className="text-slate-600 mt-1">
            Access 2,000+ verified pharmacies across India
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800">
            2,000+ Partners
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            24/7 Delivery
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search medicines, brands, or pharmacies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
                <SelectItem value="pain-relief">Pain Relief</SelectItem>
                <SelectItem value="allergy">Allergy</SelectItem>
                <SelectItem value="antibiotics">Antibiotics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="orders">My Orders ({pharmacyOrders.length})</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Popular Medicines */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Medicines</CardTitle>
              <CardDescription>Frequently ordered dermatology and general medicines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularMedicines.map((medicine) => (
                  <div key={medicine.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{medicine.name}</h4>
                        <p className="text-sm text-slate-600">{medicine.brand}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {medicine.category}
                        </Badge>
                      </div>
                      {medicine.prescription && (
                        <Badge variant="outline" className="text-xs">
                          Rx Required
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                        {medicine.originalPrice > medicine.price && (
                          <span className="text-sm text-slate-500 line-through ml-2">₹{medicine.originalPrice}</span>
                        )}
                      </div>
                      <Badge className={medicine.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    <Button 
                      className="w-full" 
                      disabled={!medicine.inStock}
                      onClick={() => toast({ title: "Added to Cart", description: `${medicine.name} added to cart.` })}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6 text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Schedule Refill</h3>
                <p className="text-sm text-slate-600 mb-4">Set up automatic refills for your regular medications</p>
                <Button variant="outline" onClick={scheduleRefill}>
                  Set Up Refill
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6 text-center">
                <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Upload Prescription</h3>
                <p className="text-sm text-slate-600 mb-4">Upload your prescription for quick medicine ordering</p>
                <Button variant="outline">
                  Upload Rx
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6 text-center">
                <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibent text-slate-900 mb-2">Find Pharmacy</h3>
                <p className="text-sm text-slate-600 mb-4">Locate nearby pharmacies with real-time availability</p>
                <Button variant="outline">
                  Find Nearby
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          {ordersLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading orders...</p>
                </div>
              </CardContent>
            </Card>
          ) : pharmacyOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No orders yet</p>
                  <p className="text-sm text-slate-400 mt-2">Your pharmacy orders will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pharmacyOrders.map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-slate-900">Order #{order.id}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{order.pharmacyName}</p>
                          <p className="text-sm text-slate-500">
                            Ordered on {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                          <div className="mt-2">
                            <span className="text-lg font-semibold text-green-600">₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Track Order
                        </Button>
                        {order.status === 'delivered' && (
                          <Button size="sm" variant="outline">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No prescriptions uploaded</p>
                <p className="text-sm text-slate-400 mt-2 mb-4">Upload your prescriptions to order medicines quickly</p>
                <Button>
                  <Package className="w-4 h-4 mr-2" />
                  Upload Prescription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pharmacies Tab */}
        <TabsContent value="pharmacies" className="space-y-4">
          <div className="grid gap-4">
            {nearbyPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Pill className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-900">{pharmacy.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{pharmacy.rating}</span>
                          </div>
                          <Badge className={pharmacy.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {pharmacy.isOpen ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 space-x-4 mb-2">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {pharmacy.address}
                          </span>
                          <span className="flex items-center">
                            <Navigation className="w-4 h-4 mr-1" />
                            {pharmacy.distance}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 space-x-4 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {pharmacy.deliveryTime}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {pharmacy.phone}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pharmacy.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="sm">
                        <Navigation className="w-4 h-4 mr-1" />
                        Directions
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
