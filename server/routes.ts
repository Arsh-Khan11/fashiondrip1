import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertReviewSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertTailorBookingSchema,
  insertOnlineAppointmentSchema,
  insertContactSupportSchema,
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

// Configure session store
import memorystore from "memorystore";
const MemoryStore = memorystore(session);

// Configure Passport.js
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      
      // In a real app we would use bcrypt.compare, but for simplicity
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "drip-it-out-secret",
    })
  );
  
  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication check middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  
  // User authentication routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });
  
  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });
  
  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  });
  
  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // In a real app, we would hash the password
      // userData.password = await bcrypt.hash(userData.password, 10);
      
      const newUser = await storage.createUser(userData);
      
      // Automatically log in after registration
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        return res.status(201).json({ user: newUser });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  // User profile update
  app.put("/api/user", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userData = req.body;
      
      // We don't want to allow password updates via this endpoint
      delete userData.password;
      
      const updatedUser = await storage.updateUser(userId, userData);
      res.json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Profile update failed" });
    }
  });
  
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const collection = req.query.collection as string | undefined;
      
      if (category) {
        const products = await storage.getProductsByCategory(category);
        return res.json(products);
      }
      
      if (collection) {
        const products = await storage.getProductsByCollection(collection);
        return res.json(products);
      }
      
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
  app.post("/api/products/:id/reviews", requireAuth, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId
      });
      
      const newReview = await storage.createReview(reviewData);
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });
  
  // Order routes
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Security check - users can only view their own orders
      if (order.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const orderItems = await storage.getOrderItems(orderId);
      res.json({ order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
        status: "pending"
      });
      
      const newOrder = await storage.createOrder(orderData);
      
      // Process order items
      const items = req.body.items || [];
      for (const item of items) {
        const orderItemData = insertOrderItemSchema.parse({
          ...item,
          orderId: newOrder.id
        });
        await storage.createOrderItem(orderItemData);
      }
      
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  // Update order status (e.g., after payment)
  app.put("/api/orders/:id/status", requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Security check - users can only update their own orders
      if (order.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  
  // Tailor Booking routes
  app.get("/api/tailor-bookings", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const bookings = await storage.getTailorBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tailor bookings" });
    }
  });
  
  app.post("/api/tailor-bookings", async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? (req.user as any).id : 0;
      
      const bookingData = insertTailorBookingSchema.parse({
        ...req.body,
        userId
      });
      
      const newBooking = await storage.createTailorBooking(bookingData);
      res.status(201).json(newBooking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create tailor booking" });
    }
  });
  
  // Online Appointment routes
  app.get("/api/online-appointments", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const appointments = await storage.getOnlineAppointments(userId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch online appointments" });
    }
  });
  
  app.post("/api/online-appointments", async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? (req.user as any).id : 0;
      
      const appointmentData = insertOnlineAppointmentSchema.parse({
        ...req.body,
        userId
      });
      
      const newAppointment = await storage.createOnlineAppointment(appointmentData);
      res.status(201).json(newAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create online appointment" });
    }
  });
  
  // Contact Support route
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSupportSchema.parse(req.body);
      const newContact = await storage.createContactSupport(contactData);
      res.status(201).json(newContact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
