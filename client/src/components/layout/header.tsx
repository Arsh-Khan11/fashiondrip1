import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "@/lib/auth";
import { useCartStore } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, ShoppingBag, LogOut } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header className="w-full bg-[#F9F6F1] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center">
              <span className="playfair text-2xl md:text-3xl font-bold tracking-tight">
                <span>Drip</span>
                <span className="text-[#C8A96A]">It</span>
                <span>Out</span>
              </span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-sm">
            <Link href="/">
              <a className={`py-2 font-medium hover:text-[#C8A96A] transition-custom ${location === '/' ? 'text-[#C8A96A]' : ''}`}>
                Home
              </a>
            </Link>
            <Link href="/designs">
              <a className={`py-2 font-medium hover:text-[#C8A96A] transition-custom ${location === '/designs' ? 'text-[#C8A96A]' : ''}`}>
                Designs
              </a>
            </Link>
            <Link href="/booking">
              <a className={`py-2 font-medium hover:text-[#C8A96A] transition-custom ${location === '/booking' ? 'text-[#C8A96A]' : ''}`}>
                Book Tailor
              </a>
            </Link>
            <Link href="/appointment">
              <a className={`py-2 font-medium hover:text-[#C8A96A] transition-custom ${location === '/appointment' ? 'text-[#C8A96A]' : ''}`}>
                Appointments
              </a>
            </Link>
            <Link href="/cart">
              <a className={`py-2 font-medium hover:text-[#C8A96A] transition-custom ${location === '/cart' ? 'text-[#C8A96A]' : ''}`}>
                Cart
              </a>
            </Link>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:text-[#C8A96A] transition-custom">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.fullName || user?.username}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="w-full cursor-pointer">Profile</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <a className="hover:text-[#C8A96A] transition-custom">
                  <User className="h-5 w-5" />
                </a>
              </Link>
            )}
            
            <Link href="/cart">
              <a className="hover:text-[#C8A96A] transition-custom relative">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center bg-[#C8A96A] text-white text-xs">
                    {items.length}
                  </span>
                )}
              </a>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:text-[#C8A96A] transition-custom"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-200 mt-2">
            <nav className="flex flex-col space-y-3 text-sm">
              <Link href="/">
                <a className={`py-1 font-medium hover:text-[#C8A96A] transition-custom ${location === '/' ? 'text-[#C8A96A]' : ''}`}>
                  Home
                </a>
              </Link>
              <Link href="/designs">
                <a className={`py-1 font-medium hover:text-[#C8A96A] transition-custom ${location === '/designs' ? 'text-[#C8A96A]' : ''}`}>
                  Designs
                </a>
              </Link>
              <Link href="/booking">
                <a className={`py-1 font-medium hover:text-[#C8A96A] transition-custom ${location === '/booking' ? 'text-[#C8A96A]' : ''}`}>
                  Book Tailor
                </a>
              </Link>
              <Link href="/appointment">
                <a className={`py-1 font-medium hover:text-[#C8A96A] transition-custom ${location === '/appointment' ? 'text-[#C8A96A]' : ''}`}>
                  Appointments
                </a>
              </Link>
              <Link href="/cart">
                <a className={`py-1 font-medium hover:text-[#C8A96A] transition-custom ${location === '/cart' ? 'text-[#C8A96A]' : ''}`}>
                  Cart
                </a>
              </Link>
              {!isAuthenticated && (
                <>
                  <Link href="/login">
                    <a className={`py-1 font-medium hover:text-[#C8A96A] transition-custom ${location === '/login' ? 'text-[#C8A96A]' : ''}`}>
                      Login
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a className={`py-1 font-medium hover:text-[#C8A96A] transition-custom ${location === '/signup' ? 'text-[#C8A96A]' : ''}`}>
                      Register
                    </a>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
