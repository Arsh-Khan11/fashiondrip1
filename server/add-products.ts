import { db } from "./db";
import { products, type InsertProduct } from "@shared/schema";
import { eq } from "drizzle-orm";

async function addNewProducts() {
  console.log("Adding new products with custom images...");
  
  // New products data
  const newProducts: InsertProduct[] = [
    {
      name: "Grey Pinstripe Suit",
      description: "Elegant grey pinstripe suit with a modern oversized fit. Perfect for formal occasions or making a fashion statement.",
      price: 159500, // $1,595.00
      imageUrl: "https://i.imgur.com/FqgQBR4.png", 
      category: "Suits",
      collection: "Fashion Forward",
      inStock: true
    },
    {
      name: "Navy Embroidered Kurta",
      description: "Navy blue embroidered kurta with intricate traditional patterns. Crafted from premium cotton for comfort and style.",
      price: 78500, // $785.00
      imageUrl: "https://i.imgur.com/dZwNhvh.png",
      category: "Ethnic Wear",
      collection: "Cultural Classics",
      inStock: true
    },
    {
      name: "White Embroidered Kurta",
      description: "Luxurious white embroidered kurta with gold detailing. Paired with classic white trousers for a complete traditional look.",
      price: 92000, // $920.00
      imageUrl: "https://i.imgur.com/1AHaULG.png",
      category: "Ethnic Wear",
      collection: "Cultural Classics",
      inStock: true
    },
    {
      name: "Navy Business Suit",
      description: "Classic navy business suit with a modern slim fit. Perfect for professional settings with its tailored silhouette.",
      price: 145000, // $1,450.00
      imageUrl: "https://i.imgur.com/n0UXdif.png",
      category: "Suits",
      collection: "Business Collection",
      inStock: true
    }
  ];
  
  // Insert products
  for (const product of newProducts) {
    // Check if product already exists with the same name
    const existingProduct = await db.select().from(products).where(eq(products.name, product.name));
    
    if (existingProduct.length === 0) {
      await db.insert(products).values(product);
      console.log(`Added: ${product.name}`);
    } else {
      console.log(`Product already exists: ${product.name}`);
    }
  }
  
  console.log("New products added successfully!");
}

// Run function
async function run() {
  try {
    await addNewProducts();
    console.log("Product addition completed successfully.");
  } catch (error) {
    console.error("Error adding new products:", error);
  } finally {
    process.exit(0);
  }
}

// Execute the function
run();