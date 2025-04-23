import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  reviews, type Review, type InsertReview,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  tailorBookings, type TailorBooking, type InsertTailorBooking,
  onlineAppointments, type OnlineAppointment, type InsertOnlineAppointment,
  contactSupport, type ContactSupport, type InsertContactSupport
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByCollection(collection: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;
  
  // Review methods
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Items methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Tailor Booking methods
  getTailorBookings(userId: number): Promise<TailorBooking[]>;
  getTailorBooking(id: number): Promise<TailorBooking | undefined>;
  createTailorBooking(booking: InsertTailorBooking): Promise<TailorBooking>;
  updateTailorBookingStatus(id: number, status: string): Promise<TailorBooking | undefined>;
  
  // Online Appointment methods
  getOnlineAppointments(userId: number): Promise<OnlineAppointment[]>;
  getOnlineAppointment(id: number): Promise<OnlineAppointment | undefined>;
  createOnlineAppointment(appointment: InsertOnlineAppointment): Promise<OnlineAppointment>;
  updateOnlineAppointmentStatus(id: number, status: string): Promise<OnlineAppointment | undefined>;
  
  // Contact Support methods
  createContactSupport(contact: InsertContactSupport): Promise<ContactSupport>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private reviews: Map<number, Review>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private tailorBookings: Map<number, TailorBooking>;
  private onlineAppointments: Map<number, OnlineAppointment>;
  private contactSupport: Map<number, ContactSupport>;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentReviewId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentTailorBookingId: number;
  private currentOnlineAppointmentId: number;
  private currentContactSupportId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.reviews = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.tailorBookings = new Map();
    this.onlineAppointments = new Map();
    this.contactSupport = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentReviewId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentTailorBookingId = 1;
    this.currentOnlineAppointmentId = 1;
    this.currentContactSupportId = 1;
    
    // Initialize with some sample products
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample products
    const products: InsertProduct[] = [
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
    
    // Add sample products to storage
    products.forEach(product => this.createProduct(product));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }
  
  async getProductsByCollection(collection: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.collection === collection
    );
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const createdAt = new Date();
    const product: Product = { ...insertProduct, id, createdAt };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  // Review methods
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.productId === productId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const createdAt = new Date();
    const review: Review = { ...insertReview, id, createdAt };
    this.reviews.set(id, review);
    return review;
  }
  
  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const createdAt = new Date();
    const order: Order = { ...insertOrder, id, createdAt };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Items methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  // Tailor Booking methods
  async getTailorBookings(userId: number): Promise<TailorBooking[]> {
    return Array.from(this.tailorBookings.values()).filter(
      booking => booking.userId === userId
    );
  }
  
  async getTailorBooking(id: number): Promise<TailorBooking | undefined> {
    return this.tailorBookings.get(id);
  }
  
  async createTailorBooking(insertBooking: InsertTailorBooking): Promise<TailorBooking> {
    const id = this.currentTailorBookingId++;
    const createdAt = new Date();
    const booking: TailorBooking = { ...insertBooking, id, createdAt };
    this.tailorBookings.set(id, booking);
    return booking;
  }
  
  async updateTailorBookingStatus(id: number, status: string): Promise<TailorBooking | undefined> {
    const booking = this.tailorBookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.tailorBookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Online Appointment methods
  async getOnlineAppointments(userId: number): Promise<OnlineAppointment[]> {
    return Array.from(this.onlineAppointments.values()).filter(
      appointment => appointment.userId === userId
    );
  }
  
  async getOnlineAppointment(id: number): Promise<OnlineAppointment | undefined> {
    return this.onlineAppointments.get(id);
  }
  
  async createOnlineAppointment(insertAppointment: InsertOnlineAppointment): Promise<OnlineAppointment> {
    const id = this.currentOnlineAppointmentId++;
    const createdAt = new Date();
    const appointment: OnlineAppointment = { ...insertAppointment, id, createdAt };
    this.onlineAppointments.set(id, appointment);
    return appointment;
  }
  
  async updateOnlineAppointmentStatus(id: number, status: string): Promise<OnlineAppointment | undefined> {
    const appointment = this.onlineAppointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, status };
    this.onlineAppointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  // Contact Support methods
  async createContactSupport(insertContact: InsertContactSupport): Promise<ContactSupport> {
    const id = this.currentContactSupportId++;
    const createdAt = new Date();
    const contact: ContactSupport = { ...insertContact, id, createdAt, resolved: false };
    this.contactSupport.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
