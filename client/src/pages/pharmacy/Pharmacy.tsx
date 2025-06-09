import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pill, 
  MapPin, 
  Search, 
  ShoppingCart, 
  Star, 
  Clock, 
  Truck,
  Package,
  Filter,
  Heart,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Building,
  Phone,
  Navigation,
  CreditCard,
  Timer
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<any[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch pharmacies (2000+ partners)
  const { data: pharmacies, isLoading: pharmaciesLoading } = useQuery({
    queryKey: ["pharmacies", searchQuery],
    queryFn: () => apiRequest(`/api/pharmacies?search=${searchQuery}`),
  });

  // Fetch medications
  const { data: medications, isLoading: medicationsLoading } = useQuery({
    queryKey: ["medications", searchQuery, selectedCategory],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      return apiRequest(`/api/medications?${params.toString()}`);
    },
  });

  // Fetch user's orders
  const { data: orders } = useQuery({
    queryKey: ["pharmacy-orders"],
    queryFn: () => apiRequest("/api/pharmacy-orders"),
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("/api/pharmacy-orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
    },
    onSuccess: () => {
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ["pharmacy-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      toast({
        title: "Order Placed Successfully",
        description: "Your medication order has been confirmed",
      });
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToCart = (medication: any, pharmacy: any) => {
    const existingItem = cart.find(item => 
      item.medication.id === medication.id && item.pharmacy.id === pharmacy.id
    );
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.medication.id === medication.id && item.pharmacy.id === pharmacy.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { medication, pharmacy, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${medication.name} added to your cart`,
    });
  };

  const removeFromCart = (medicationId: number, pharmacyId: number) => {
    setCart(cart.filter(item => 
      !(item.medication.id === medicationId && item.pharmacy.id === pharmacyId)
    ));
  };

  const updateQuantity = (medicationId: number, pharmacyId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.medication.id === medicationId && item.pharmacy.id === pharmacyId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const price = item.medication.mrp || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    
    const orderData = {
      pharmacyId: cart[0].pharmacy.id,
      medications: cart.map(item => ({
        medicationId: item.medication.id,
        name: item.medication.name,
        quantity: item.quantity,
        price: item.medication.mrp,
        total: item.medication.mrp * item.quantity
      })),
      totalAmount: getTotalAmount(),
      finalAmount: getTotalAmount(),
      deliveryAddress: {
        street: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India"
      }
    };

    await placeOrderMutation.mutateAsync(orderData);
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "antibiotics", label: "Antibiotics" },
    { value: "painkillers", label: "Pain Relief" },
    { value: "vitamins", label: "Vitamins & Supplements" },
    { value: "skincare", label: "Skin Care" },
    { value: "diabetes", label: "Diabetes Care" },
    { value: "cardiac", label: "Cardiac Care" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pharmacy Marketplace</h1>
          <p className="text-gray-600 mt-1">
            2000+ verified pharmacy partners across India with real-time inventory
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="px-3 py-1">
            <Building className="mr-1 h-4 w-4" />
            2000+ Partners
          </Badge>
          <Button className="relative">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {cart.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medications, pharmacies, or conditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="medications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-6">
          {medicationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : medications && medications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map((medication: any) => (
                <Card key={medication.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{medication.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {medication.manufacturer} • {medication.strength}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{medication.mrp}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          per {medication.packSize}
                        </span>
                      </div>
                      {medication.prescriptionRequired && (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          Rx Required
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Availability:</span>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">In Stock</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Form:</span>
                        <span className="font-medium">{medication.form}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => addToCart(medication, pharmacies?.[0])}
                        className="w-full"
                        disabled={!pharmacies || pharmacies.length === 0}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Pill className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No medications found</h3>
                <p className="text-gray-600">Try adjusting your search or category filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pharmacies" className="space-y-6">
          {pharmaciesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-5 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pharmacies && pharmacies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pharmacies.map((pharmacy: any) => (
                <Card key={pharmacy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          {pharmacy.name}
                          {pharmacy.isVerified && (
                            <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                          )}
                        </CardTitle>
                        <CardDescription>{pharmacy.ownerName}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{pharmacy.rating || "4.8"}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {pharmacy.address?.city}, {pharmacy.address?.state}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{pharmacy.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          Delivery within {pharmacy.deliveryRadius || 10} km
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {pharmacy.totalOrders || 1200}+ orders delivered
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={pharmacy.isActive ? "default" : "secondary"}>
                        {pharmacy.isActive ? "Open" : "Closed"}
                      </Badge>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          <Navigation className="mr-1 h-3 w-3" />
                          Directions
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedPharmacy(pharmacy)}
                        >
                          View Store
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pharmacies found</h3>
                <p className="text-gray-600">Try adjusting your search location</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                        <CardDescription>
                          {new Date(order.createdAt).toLocaleDateString()} • 
                          {order.medications?.length || 0} items
                        </CardDescription>
                      </div>
                      <Badge variant={
                        order.status === "delivered" ? "default" :
                        order.status === "shipped" ? "secondary" :
                        order.status === "confirmed" ? "outline" : "destructive"
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-green-600">₹{order.finalAmount}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-gray-600">Delivery Status</p>
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {order.status === "delivered" ? "Delivered" : "In Transit"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tracking Number:</span>
                          <span className="text-sm font-mono">{order.trackingNumber}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1">
                        <Package className="mr-2 h-4 w-4" />
                        Track Order
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="mr-2 h-4 w-4" />
                        Contact Pharmacy
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" className="flex-1">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Start shopping to see your orders here</p>
                <Button className="mt-4">
                  <Pill className="mr-2 h-4 w-4" />
                  Browse Medications
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card key={`${item.medication.id}-${item.pharmacy.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.medication.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.medication.manufacturer} • {item.medication.strength}
                          </p>
                          <p className="text-sm text-gray-600">
                            From: {item.pharmacy.name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.medication.id, item.pharmacy.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.medication.id, item.pharmacy.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.medication.mrp * item.quantity}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => removeFromCart(item.medication.id, item.pharmacy.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{getTotalAmount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>₹{getTotalAmount()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Free delivery on orders above ₹500</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <Timer className="h-4 w-4" />
                      <span>Expected delivery: 24-48 hours</span>
                    </div>
                  </div>

                  <Button
                    onClick={placeOrder}
                    className="w-full"
                    disabled={placeOrderMutation.isPending}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Add medications to your cart to proceed</p>
                <Button className="mt-4">
                  <Pill className="mr-2 h-4 w-4" />
                  Browse Medications
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}