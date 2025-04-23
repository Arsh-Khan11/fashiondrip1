import { useEffect, useState } from "react";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ui/product-card";
import { PRODUCT_CATEGORIES, PRODUCT_COLLECTIONS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const DesignList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("All Collections");
  const [collection, setCollection] = useState("All Collections");
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = "/api/products";
        const params = new URLSearchParams();
        
        if (category !== "All Collections") {
          params.append("category", category);
        }
        
        if (collection !== "All Collections") {
          params.append("collection", collection);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
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
  }, [category, collection]);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
        <div>
          <h2 className="playfair text-3xl md:text-4xl font-semibold">Our Designs</h2>
          <div className="w-20 h-1 bg-[#C8A96A] mt-4"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Category:</span>
            <Select onValueChange={setCategory} defaultValue={category}>
              <SelectTrigger className="bg-white border border-gray-200 text-sm rounded-sm w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Collection:</span>
            <Select onValueChange={setCollection} defaultValue={collection}>
              <SelectTrigger className="bg-white border border-gray-200 text-sm rounded-sm w-[180px]">
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_COLLECTIONS.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-4 h-[480px] animate-pulse">
              <div className="w-full h-[400px] bg-gray-200 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesignList;
