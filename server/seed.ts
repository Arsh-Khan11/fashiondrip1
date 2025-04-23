import { db } from "./db";
import { products, type InsertProduct } from "@shared/schema";

async function seedProducts() {
  // Check if products already exist
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length > 0) {
    console.log("Products already seeded, skipping...");
    return;
  }
  
  console.log("Seeding products...");
  
  // Sample products data
  const sampleProducts: InsertProduct[] = [
    {
      name: "Silk Evening Dress",
      description: "Elegant silk evening dress perfect for formal occasions. Features intricate embroidery and a flattering silhouette.",
      price: 89500, // $895.00
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Dresses",
      collection: "Evening Wear",
      inStock: true
    },
    {
      name: "Cashmere Overcoat",
      description: "Luxurious cashmere overcoat that provides exceptional warmth and style. Tailored to perfection with premium detailing.",
      price: 125000, // $1,250.00
      imageUrl: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Outerwear",
      collection: "Winter Essentials",
      inStock: true
    },
    {
      name: "Italian Wool Suit",
      description: "Expertly crafted Italian wool suit that showcases traditional tailoring techniques with a modern fit.",
      price: 185000, // $1,850.00
      imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Suits",
      collection: "Business Collection",
      inStock: true
    },
    {
      name: "Handcrafted Leather Shoes",
      description: "Premium leather shoes handcrafted by expert artisans. Features Goodyear welting for durability and comfort.",
      price: 42500, // $425.00
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Footwear",
      collection: "Classic Essentials",
      inStock: true
    },
    {
      name: "Silk Blend Scarf",
      description: "Luxurious silk blend scarf with hand-rolled edges and an elegant pattern designed by our in-house artists.",
      price: 18500, // $185.00
      imageUrl: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Accessories",
      collection: "Fall Accessories",
      inStock: true
    },
    {
      name: "Designer Blouse",
      description: "Sophisticated designer blouse made from premium materials with meticulous attention to detail and perfect fit.",
      price: 32500, // $325.00
      imageUrl: "https://images.unsplash.com/photo-1552874869-5c39ec9288dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Tops",
      collection: "Summer 2023",
      inStock: true
    }
  ];
  
  // Insert products
  await db.insert(products).values(sampleProducts);
  console.log("Products seeded successfully!");
}

// Run all seed functions
async function seed() {
  try {
    await seedProducts();
    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

// Execute the seed function
seed();