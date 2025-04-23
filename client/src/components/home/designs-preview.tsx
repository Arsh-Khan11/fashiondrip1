import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/product-card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PRODUCT_COLLECTIONS } from "@/lib/constants";
import { Product } from "@shared/schema";

const DesignsPreview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("All Collections");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCollection === "All Collections"
          ? "/api/products"
          : `/api/products?collection=${encodeURIComponent(selectedCollection)}`;
          
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCollection]);
  
  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
  };
  
  // Show only 3 products for the preview
  const previewProducts = products.slice(0, 3);
  
  return (
    <section id="designs" className="py-16 bg-[#F9F6F1]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
          <div>
            <h2 className="playfair text-3xl md:text-4xl font-semibold">Exclusive Collections</h2>
            <div className="w-20 h-1 bg-[#C8A96A] mt-4"></div>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <span className="text-sm font-medium">Filter:</span>
            <Select onValueChange={handleCollectionChange} defaultValue={selectedCollection}>
              <SelectTrigger className="bg-white border border-gray-200 text-sm rounded-sm w-[180px]">
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_COLLECTIONS.map((collection) => (
                  <SelectItem key={collection} value={collection}>
                    {collection}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 h-[480px] animate-pulse">
                <div className="w-full h-[400px] bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {previewProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button 
            asChild
            className="px-8 py-3 border border-black hover:bg-black hover:text-white font-medium transition-custom h-auto bg-transparent text-black"
          >
            <Link href="/designs">View All Collections</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DesignsPreview;
