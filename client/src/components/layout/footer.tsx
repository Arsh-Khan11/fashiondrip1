import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="playfair text-xl font-medium mb-4">Drip It Out</h3>
            <p className="text-gray-400 mb-4">
              Luxury fashion and tailor services bringing premium designs directly to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/designs">
                  <a className="text-gray-400 hover:text-[#C8A96A] transition-custom">New Arrivals</a>
                </Link>
              </li>
              <li>
                <Link href="/designs">
                  <a className="text-gray-400 hover:text-[#C8A96A] transition-custom">Collections</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="text-gray-400 hover:text-[#C8A96A] transition-custom">Bespoke Services</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">Gift Cards</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">Press</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">Sustainability</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">Shipping & Returns</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#C8A96A] transition-custom">Size Guide</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Drip It Out. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#C8A96A] text-sm transition-custom">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#C8A96A] text-sm transition-custom">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
