import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/profile/profile-form";
import OrderHistory from "@/components/profile/order-history";
import { 
  User, 
  ShoppingBag, 
  CalendarDays, 
  Heart, 
  HelpCircle, 
  LogOut
} from "lucide-react";

const ProfilePage = () => {
  const [, navigate] = useLocation();
  const { isAuthenticated, checkAuthStatus, logout } = useAuthStore();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !useAuthStore.getState().isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold playfair mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white shadow-sm p-4 rounded-sm">
            <Tabs defaultValue="profile" orientation="vertical" className="w-full">
              <TabsList className="flex flex-col items-stretch h-auto bg-transparent space-y-1">
                <TabsTrigger 
                  value="profile" 
                  className="justify-start data-[state=active]:bg-[#F9F6F1] data-[state=active]:text-[#C8A96A]"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                
                <TabsTrigger 
                  value="orders" 
                  className="justify-start data-[state=active]:bg-[#F9F6F1] data-[state=active]:text-[#C8A96A]"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Orders
                </TabsTrigger>
                
                <TabsTrigger 
                  value="appointments" 
                  className="justify-start data-[state=active]:bg-[#F9F6F1] data-[state=active]:text-[#C8A96A]"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Appointments
                </TabsTrigger>
                
                <TabsTrigger 
                  value="wishlist" 
                  className="justify-start data-[state=active]:bg-[#F9F6F1] data-[state=active]:text-[#C8A96A]"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </TabsTrigger>
                
                <TabsTrigger 
                  value="support" 
                  className="justify-start data-[state=active]:bg-[#F9F6F1] data-[state=active]:text-[#C8A96A]"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support
                </TabsTrigger>
              </TabsList>
              
              <button 
                onClick={handleLogout}
                className="flex items-center mt-6 px-3 py-2 w-full text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors text-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </Tabs>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsContent value="profile" className="mt-0">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="orders" className="mt-0">
              <OrderHistory />
            </TabsContent>
            
            <TabsContent value="appointments" className="mt-0">
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-xl font-semibold playfair mb-4">My Appointments</h2>
                <p className="text-gray-600">
                  This section will show your upcoming and past appointments with our tailors and stylists.
                </p>
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You don't have any appointments scheduled yet.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="wishlist" className="mt-0">
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-xl font-semibold playfair mb-4">My Wishlist</h2>
                <p className="text-gray-600">
                  Save your favorite items here for later.
                </p>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your wishlist is empty.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="mt-0">
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-xl font-semibold playfair mb-4">Support</h2>
                <p className="text-gray-600 mb-6">
                  Need help with your order or have questions about our products and services?
                </p>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 p-4 rounded-sm">
                    <h3 className="font-medium mb-2">Contact Customer Service</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Our team is available Monday through Friday, 9am to 6pm EST.
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Email:</span>
                      <a href="mailto:support@dripitout.com" className="text-[#C8A96A] hover:underline">
                        support@dripitout.com
                      </a>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <span className="font-medium mr-2">Phone:</span>
                      <a href="tel:+11234567890" className="text-[#C8A96A] hover:underline">
                        +1 (123) 456-7890
                      </a>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-sm">
                    <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#" className="text-[#C8A96A] hover:underline">
                          How do I track my order?
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-[#C8A96A] hover:underline">
                          What is your return policy?
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-[#C8A96A] hover:underline">
                          How do I schedule a tailor appointment?
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-[#C8A96A] hover:underline">
                          Do you offer international shipping?
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
