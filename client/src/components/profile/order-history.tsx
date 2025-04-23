import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Calendar, Package, ArrowDownToLine, RotateCcw, Star } from "lucide-react";
import { Order, OrderItem } from "@shared/schema";

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returnReason, setReturnReason] = useState("");
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/orders', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const ordersData = await response.json();
        
        // Fetch details for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order: Order) => {
            const itemsResponse = await fetch(`/api/orders/${order.id}`, {
              credentials: 'include'
            });
            
            if (!itemsResponse.ok) {
              return { ...order, items: [] };
            }
            
            const { items } = await itemsResponse.json();
            return { ...order, items };
          })
        );
        
        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Failed to load orders",
          description: "There was a problem loading your order history.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, toast]);
  
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number): string => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };
  
  // Format date
  const formatDate = (dateString: Date): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Handle return request
  const handleReturnRequest = (orderId: number) => {
    if (!returnReason.trim()) {
      toast({
        title: "Return reason required",
        description: "Please provide a reason for your return request.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Return Requested",
      description: "Your return request has been submitted. We'll contact you shortly.",
    });
    
    setReturnReason("");
  };
  
  // Status badge
  const OrderStatusBadge = ({ status }: { status: string }) => {
    const statusMap: { [key: string]: { color: string, label: string } } = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      paid: { color: "bg-blue-100 text-blue-800", label: "Paid" },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" }
    };
    
    const { color, label } = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };
    
    return (
      <Badge className={`${color} rounded-sm font-medium`}>
        {label}
      </Badge>
    );
  };
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Please log in to view your orders</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold playfair">Order History</h2>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Orders Yet</CardTitle>
                <CardDescription>
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white">
                  <Link href="/designs">Shop Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Order #{order.id}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Placed on {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-sm text-gray-400">
                          <Package className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Product #{item.productId}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × Size: {item.size}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.priceAtPurchase)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm">Total Amount</p>
                    <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 border-t border-gray-200 gap-2 flex-wrap">
                  {order.status === "delivered" && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            Write Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                              Share your experience with this order
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="flex items-center justify-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Button key={star} variant="ghost" size="icon" className="text-[#C8A96A]">
                                  <Star className="h-6 w-6 fill-current" />
                                </Button>
                              ))}
                            </div>
                            
                            <Textarea 
                              placeholder="Tell us about your experience with the products and service" 
                              rows={4}
                            />
                          </div>
                          
                          <DialogFooter>
                            <Button className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white">
                              Submit Review
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <RotateCcw className="h-4 w-4" />
                            Return
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request a Return</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for your return request
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <Textarea 
                              placeholder="Why do you want to return this order?" 
                              rows={4}
                              value={returnReason}
                              onChange={(e) => setReturnReason(e.target.value)}
                            />
                            
                            <p className="text-sm text-muted-foreground">
                              Returns are eligible within 30 days of delivery. After submitting, you'll receive instructions via email.
                            </p>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white"
                              onClick={() => handleReturnRequest(order.id)}
                            >
                              Submit Return Request
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ArrowDownToLine className="h-4 w-4" />
                    Download Invoice
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="processing" className="mt-4 space-y-4">
          {orders.filter(order => order.status === "pending" || order.status === "paid").length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Processing Orders</CardTitle>
                <CardDescription>
                  You don't have any orders currently being processed.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            orders
              .filter(order => order.status === "pending" || order.status === "paid")
              .map((order) => (
                <Card key={order.id}>
                  {/* Same card structure as above */}
                  <CardHeader className="bg-gray-50 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Placed on {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    {/* Order items would go here */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm">Total Amount</p>
                      <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
        
        <TabsContent value="shipped" className="mt-4 space-y-4">
          {orders.filter(order => order.status === "shipped").length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Shipped Orders</CardTitle>
                <CardDescription>
                  You don't have any orders currently being shipped.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            orders
              .filter(order => order.status === "shipped")
              .map((order) => (
                <Card key={order.id}>
                  {/* Same card structure as above */}
                </Card>
              ))
          )}
        </TabsContent>
        
        <TabsContent value="delivered" className="mt-4 space-y-4">
          {orders.filter(order => order.status === "delivered").length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Completed Orders</CardTitle>
                <CardDescription>
                  You don't have any completed orders yet.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            orders
              .filter(order => order.status === "delivered")
              .map((order) => (
                <Card key={order.id}>
                  {/* Same card structure as above */}
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderHistory;
