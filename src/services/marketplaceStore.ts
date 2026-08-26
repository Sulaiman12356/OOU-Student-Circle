import {
  MarketplaceCategory,
  VendorProfile,
  ProductItem,
  Cart,
  CartItem,
  WishlistItem,
  MasterOrder,
  VendorOrder,
  ProductReview,
  VendorReview,
  PromotionPackage,
  ProductPromotion,
  PayoutRequest,
  MarketplaceTransaction,
  ProductReport,
  MarketplaceSettings,
  OrderStatus,
  VendorVerificationStatus,
  ProductStatus
} from '../types/marketplace';
import founderImage from '../assets/images/founder_sulaiman.jpg';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

const STORAGE_PREFIX = 'oou_marketplace_';

// Initial Categories
export const initialMarketplaceCategories: MarketplaceCategory[] = [
  { id: 'cat-fashion', name: 'Fashion & Clothing', slug: 'fashion-clothing', iconName: 'Shirt', description: 'Student-designed apparel, thrift, native wear & trendy outfits', featured: true },
  { id: 'cat-food', name: 'Food & Snacks', slug: 'food-snacks', iconName: 'Utensils', description: 'Freshly baked pastries, packaged snacks, drinks & meal deliveries', featured: true },
  { id: 'cat-beauty', name: 'Beauty & Personal Care', slug: 'beauty-personal-care', iconName: 'Sparkles', description: 'Skincare, organic soaps, haircare products & perfumes', featured: true },
  { id: 'cat-electronics', name: 'Electronics', slug: 'electronics', iconName: 'Laptop', description: 'Study lamps, smart devices, power banks & mini-appliances', featured: true },
  { id: 'cat-phones', name: 'Phone Accessories', slug: 'phone-accessories', iconName: 'Smartphone', description: 'Fast chargers, durable cables, phone cases & screen guards', featured: true },
  { id: 'cat-books', name: 'Books & Educational Materials', slug: 'books-educational-materials', iconName: 'BookOpen', description: 'Past questions, textbooks, lab manuals & study stationery', featured: true },
  { id: 'cat-jewelry', name: 'Jewelry & Accessories', slug: 'jewelry-accessories', iconName: 'Gem', description: 'Handmade beaded bracelets, silver rings, chains & wristwatches', featured: true },
  { id: 'cat-shoes', name: 'Shoes', slug: 'shoes', iconName: 'Footprints', description: 'Sneakers, slides, leather sandals & formal campus shoes', featured: true },
  { id: 'cat-bags', name: 'Bags', slug: 'bags', iconName: 'ShoppingBag', description: 'Tote bags, lecture backpacks, laptop carriers & waist packs', featured: true },
  { id: 'cat-home', name: 'Home & Lifestyle', slug: 'home-lifestyle', iconName: 'Home', description: 'Hostel room decor, bedsheets, mini fans & hangers' },
  { id: 'cat-campus', name: 'Campus Essentials', slug: 'campus-essentials', iconName: 'CheckCircle', description: 'Lab coats, drawing boards, scientific calculators & umbrella' },
  { id: 'cat-art', name: 'Art & Handmade', slug: 'art-handmade', iconName: 'Palette', description: 'Custom canvas art, portrait sketches & crafts' },
  { id: 'cat-health', name: 'Health & Fitness', slug: 'health-fitness', iconName: 'Activity', description: 'Water bottles, resistance bands & wellness supplies' },
  { id: 'cat-tech', name: 'Computer & Tech', slug: 'computer-tech', iconName: 'Cpu', description: 'Flash drives, wireless mice, laptop stands & keyboards' },
  { id: 'cat-other', name: 'Other', slug: 'other', iconName: 'Package', description: 'Miscellaneous student items and custom requests' },
];

// Initial Promotion Packages
export const initialPromotionPackages: PromotionPackage[] = [
  {
    id: 'pkg-featured-7',
    name: 'Featured Spotlight (7 Days)',
    type: 'featured',
    durationDays: 7,
    price: 2500,
    description: 'Prominently displayed in Featured Products row on Marketplace homepage for 7 full days.',
    features: ['Top of homepage placement', 'Distinct "Featured" badge', 'Up to 5x higher student clicks', 'Search ranking boost'],
    isPopular: true
  },
  {
    id: 'pkg-featured-30',
    name: 'Featured Spotlight (30 Days)',
    type: 'featured',
    durationDays: 30,
    price: 8000,
    description: 'Continuous 30-day top-tier placement for serious student brands and volume sellers.',
    features: ['Continuous 30-day top placement', 'Premium gold badge', 'Homepage + Category banner inclusion', 'Detailed weekly impression report']
  },
  {
    id: 'pkg-homepage-7',
    name: 'Homepage Banner Boost (7 Days)',
    type: 'homepage',
    durationDays: 7,
    price: 2000,
    description: 'Spotlight in the Trending Student Businesses & Banner highlights for 7 days.',
    features: ['Spotlight banner placement', 'Direct store profile link', 'Promoted in student newsletter']
  },
  {
    id: 'pkg-category-7',
    name: 'Category Top Placement (7 Days)',
    type: 'category',
    durationDays: 7,
    price: 1500,
    description: 'Pushed to the first 3 positions when buyers browse your category.',
    features: ['Top 3 slot in your category', 'Category badge', 'Ideal for niche items']
  },
  {
    id: 'pkg-search-7',
    name: 'Search Boost (7 Days)',
    type: 'search_boost',
    durationDays: 7,
    price: 1000,
    description: 'Priority ranking for all relevant keyword searches across the marketplace.',
    features: ['Elevated keyword relevance', 'Highlighted border in search list', 'Budget-friendly start']
  }
];

// Initial Demo Vendors (Marked isDemo: true)
// Initial Vendors - Empty by default, registered by real campus vendors
export const initialVendors: VendorProfile[] = [];

// Initial Products - Empty by default, listed by real sellers
export const initialProducts: ProductItem[] = [];

// Initial Product Reviews - Empty by default
export const initialProductReviews: ProductReview[] = [];

export const initialMarketplaceSettings: MarketplaceSettings = {
  commissionPercent: 10,
  paymentProcessingPercent: 1.5,
  paymentProcessingFixedFee: 100,
  minPayoutAmount: 2000,
  testPaymentMode: true,
  prohibitedProductPolicy: `OOU StudentCircle strictly prohibits the sale or listing of:
1. Illegal narcotics, alcohol, vapes, tobacco, or prescription-only medicines.
2. Weapons, fireworks, hazardous chemicals, or explosive materials.
3. Stolen property, counterfeit goods, or academic dishonesty items (such as stolen exams, live test answers, or unapproved certificate forgery).
4. Adult-themed, explicit, or sexually suggestive media.
5. Regulated financial instruments, unregistered SIM cards, or cryptocurrency trading schemes.

All vendors must agree to adhere strictly to Olabisi Onabanjo University community standards and Nigerian Consumer Protection regulations. Products violating these terms will be immediately removed and the vendor account suspended.`,
  categories: initialMarketplaceCategories,
  promotionPackages: initialPromotionPackages
};

export class MarketplaceStore {
  // Helper storage getters/setters
  private static getItem<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!stored) return fallback;
      return JSON.parse(stored);
    } catch {
      return fallback;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn('MarketplaceStore storage error:', err);
    }
  }

  // ==========================================
  // CATEGORIES
  // ==========================================
  static getCategories(): MarketplaceCategory[] {
    return this.getItem<MarketplaceCategory[]>('categories', initialMarketplaceCategories);
  }

  static saveCategory(category: MarketplaceCategory): void {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      cats[idx] = category;
    } else {
      cats.push(category);
    }
    this.setItem('categories', cats);
  }

  static deleteCategory(categoryId: string): void {
    const cats = this.getCategories().filter(c => c.id !== categoryId);
    this.setItem('categories', cats);
  }

  // ==========================================
  // VENDORS
  // ==========================================
  static getVendors(): VendorProfile[] {
    return this.getItem<VendorProfile[]>('vendors', initialVendors);
  }

  static getVendorById(vendorId: string): VendorProfile | null {
    const vendors = this.getVendors();
    return vendors.find(v => v.id === vendorId || v.studentId === vendorId) || null;
  }

  static getVendorByStudentId(studentId: string): VendorProfile | null {
    const vendors = this.getVendors();
    return vendors.find(v => v.studentId === studentId || v.id === studentId) || null;
  }

  static saveVendor(vendor: VendorProfile): void {
    const vendors = this.getVendors();
    const idx = vendors.findIndex(v => v.id === vendor.id || v.studentId === vendor.studentId);
    if (idx >= 0) {
      vendors[idx] = { ...vendors[idx], ...vendor, updatedAt: new Date().toISOString() };
    } else {
      vendors.unshift({ ...vendor, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem('vendors', vendors);

    // Sync to Firestore asynchronously
    if (db) {
      const docRef = doc(db, 'vendors', vendor.id);
      setDoc(docRef, { ...vendor, updatedAt: new Date().toISOString() }, { merge: true }).catch(err => {
        console.warn('Firestore vendor save notice:', err);
      });
    }
  }

  static updateVendorStatus(vendorId: string, status: VendorVerificationStatus, notes?: string): void {
    const vendors = this.getVendors();
    const target = vendors.find(v => v.id === vendorId || v.studentId === vendorId);
    if (target) {
      target.verificationStatus = status;
      if (notes) target.adminNotes = notes;
      target.updatedAt = new Date().toISOString();
      this.setItem('vendors', vendors);

      if (db) {
        const docRef = doc(db, 'vendors', target.id);
        setDoc(docRef, { verificationStatus: status, adminNotes: notes || '', updatedAt: target.updatedAt }, { merge: true }).catch(console.warn);
      }
    }
  }

  // ==========================================
  // PRODUCTS
  // ==========================================
  static getProducts(): ProductItem[] {
    return this.getItem<ProductItem[]>('products', initialProducts);
  }

  static getProductById(productId: string): ProductItem | null {
    const prods = this.getProducts();
    return prods.find(p => p.id === productId) || null;
  }

  static getProductsByVendor(vendorId: string): ProductItem[] {
    return this.getProducts().filter(p => p.vendorId === vendorId);
  }

  static getPublishedProducts(): ProductItem[] {
    return this.getProducts().filter(p => p.status === 'published' && p.quantity > 0);
  }

  static saveProduct(product: ProductItem): void {
    const prods = this.getProducts();
    const idx = prods.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      prods[idx] = { ...prods[idx], ...product, updatedAt: new Date().toISOString() };
    } else {
      prods.unshift({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem('products', prods);

    // Sync to Firestore
    if (db) {
      const docRef = doc(db, 'products', product.id);
      setDoc(docRef, { ...product, updatedAt: new Date().toISOString() }, { merge: true }).catch(err => {
        console.warn('Firestore product save notice:', err);
      });
    }
  }

  static updateProductStatus(productId: string, status: ProductStatus): void {
    const prods = this.getProducts();
    const target = prods.find(p => p.id === productId);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      this.setItem('products', prods);

      if (db) {
        setDoc(doc(db, 'products', productId), { status, updatedAt: target.updatedAt }, { merge: true }).catch(console.warn);
      }
    }
  }

  static deleteProduct(productId: string): void {
    const prods = this.getProducts().filter(p => p.id !== productId);
    this.setItem('products', prods);

    if (db) {
      deleteDoc(doc(db, 'products', productId)).catch(console.warn);
    }
  }

  static updateProductStock(productId: string, deltaOrExact: number, isExact = false): void {
    const prods = this.getProducts();
    const target = prods.find(p => p.id === productId);
    if (target) {
      if (isExact) {
        target.quantity = Math.max(0, deltaOrExact);
      } else {
        target.quantity = Math.max(0, target.quantity + deltaOrExact);
      }
      if (target.quantity === 0) {
        target.status = 'out_of_stock';
      } else if (target.status === 'out_of_stock' && target.quantity > 0) {
        target.status = 'published';
      }
      target.updatedAt = new Date().toISOString();
      this.setItem('products', prods);

      if (db) {
        setDoc(doc(db, 'products', productId), { quantity: target.quantity, status: target.status, updatedAt: target.updatedAt }, { merge: true }).catch(console.warn);
      }
    }
  }

  // ==========================================
  // SHOPPING CART (PERSISTENT)
  // ==========================================
  static getCart(userId: string): Cart {
    const key = `cart_${userId}`;
    return this.getItem<Cart>(key, {
      id: `cart-${userId}`,
      userId,
      items: [],
      updatedAt: new Date().toISOString()
    });
  }

  static saveCart(cart: Cart): void {
    this.setItem(`cart_${cart.userId}`, {
      ...cart,
      updatedAt: new Date().toISOString()
    });
  }

  static addToCart(userId: string, product: ProductItem, quantity = 1, deliveryMethod: 'pickup' | 'delivery' = 'pickup'): { success: boolean; message: string } {
    const cart = this.getCart(userId);
    const existing = cart.items.find(i => i.productId === product.id);

    // Check stock
    const currentQtyInCart = existing ? existing.quantity : 0;
    const requestedTotal = currentQtyInCart + quantity;

    if (requestedTotal > product.quantity) {
      return {
        success: false,
        message: `Only ${product.quantity} items available in stock.`
      };
    }

    if (existing) {
      existing.quantity = requestedTotal;
      existing.selectedDeliveryMethod = deliveryMethod;
    } else {
      cart.items.push({
        productId: product.id,
        vendorId: product.vendorId,
        vendorStoreName: product.vendorStoreName,
        title: product.title,
        price: product.discountPrice || product.price,
        discountPrice: product.discountPrice,
        image: product.mainImage || product.images[0],
        quantity,
        maxAvailable: product.quantity,
        deliveryFee: product.deliveryFee || 0,
        pickupAvailable: product.pickupAvailable,
        selectedDeliveryMethod: deliveryMethod
      });
    }

    this.saveCart(cart);
    return { success: true, message: `${product.title} added to cart!` };
  }

  static updateCartQuantity(userId: string, productId: string, quantity: number): void {
    const cart = this.getCart(userId);
    const product = this.getProductById(productId);
    const item = cart.items.find(i => i.productId === productId);

    if (item && product) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.productId !== productId);
      } else {
        item.quantity = Math.min(quantity, product.quantity);
      }
      this.saveCart(cart);
    }
  }

  static removeFromCart(userId: string, productId: string): void {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    this.saveCart(cart);
  }

  static clearCart(userId: string): void {
    this.saveCart({
      id: `cart-${userId}`,
      userId,
      items: [],
      updatedAt: new Date().toISOString()
    });
  }

  // ==========================================
  // WISHLIST
  // ==========================================
  static getWishlist(userId: string): WishlistItem[] {
    return this.getItem<WishlistItem[]>(`wishlist_${userId}`, []);
  }

  static addToWishlist(userId: string, product: ProductItem): void {
    const list = this.getWishlist(userId);
    if (!list.some(w => w.productId === product.id)) {
      list.unshift({
        id: `wish-${Date.now()}-${product.id}`,
        userId,
        productId: product.id,
        product,
        createdAt: new Date().toISOString()
      });
      this.setItem(`wishlist_${userId}`, list);
    }
  }

  static removeFromWishlist(userId: string, productId: string): void {
    const list = this.getWishlist(userId).filter(w => w.productId !== productId);
    this.setItem(`wishlist_${userId}`, list);
  }

  static isInWishlist(userId: string, productId: string): boolean {
    const list = this.getWishlist(userId);
    return list.some(w => w.productId === productId);
  }

  // ==========================================
  // ORDERS & MULTI-VENDOR SUBORDERS
  // ==========================================
  static getMasterOrders(): MasterOrder[] {
    return this.getItem<MasterOrder[]>('orders', []);
  }

  static getVendorOrders(): VendorOrder[] {
    return this.getItem<VendorOrder[]>('vendorOrders', []);
  }

  static getOrderById(orderId: string): MasterOrder | null {
    return this.getMasterOrders().find(o => o.id === orderId) || null;
  }

  static getVendorOrderById(vendorOrderId: string): VendorOrder | null {
    return this.getVendorOrders().find(vo => vo.id === vendorOrderId) || null;
  }

  static getVendorOrdersForMasterOrder(masterOrderId: string): VendorOrder[] {
    return this.getVendorOrders().filter(vo => vo.parentOrderId === masterOrderId);
  }

  static getOrdersForCustomer(customerId: string): MasterOrder[] {
    return this.getMasterOrders().filter(o => o.customerId === customerId);
  }

  static getVendorOrdersForVendor(vendorId: string): VendorOrder[] {
    return this.getVendorOrders().filter(vo => vo.vendorId === vendorId);
  }

  static createMasterOrder(
    customerInfo: {
      customerId: string;
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      deliveryAddress: string;
      location: string;
      customerNotes?: string;
    },
    cartItems: CartItem[],
    paymentRef = `PAY-OOU-${Date.now()}`
  ): { masterOrder: MasterOrder; vendorOrders: VendorOrder[] } {
    const settings = this.getMarketplaceSettings();
    const commissionPercent = settings.commissionPercent || 10;

    const masterOrderId = `ORD-${Date.now().toString().slice(-6)}`;
    const createdDate = new Date().toISOString();

    // Group cart items by vendor
    const vendorMap: { [vendorId: string]: CartItem[] } = {};
    cartItems.forEach(item => {
      if (!vendorMap[item.vendorId]) {
        vendorMap[item.vendorId] = [];
      }
      vendorMap[item.vendorId].push(item);
    });

    const vendorOrders: VendorOrder[] = [];
    let grandSubtotal = 0;
    let grandDeliveryFee = 0;

    Object.keys(vendorMap).forEach((vId, idx) => {
      const items = vendorMap[vId];
      const vendorSubtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const deliveryNeeded = items.some(i => i.selectedDeliveryMethod === 'delivery');
      const vendorDeliveryFee = deliveryNeeded ? Math.max(...items.map(i => i.deliveryFee || 0)) : 0;
      
      const platformCommission = Math.round((vendorSubtotal * commissionPercent) / 100);
      const netVendorEarnings = vendorSubtotal - platformCommission;

      grandSubtotal += vendorSubtotal;
      grandDeliveryFee += vendorDeliveryFee;

      const vendorOrderId = `VO-${masterOrderId.slice(4)}-${idx + 1}`;
      const vendorStoreName = items[0].vendorStoreName || 'Student Vendor';

      const vOrder: VendorOrder = {
        id: vendorOrderId,
        parentOrderId: masterOrderId,
        vendorId: vId,
        vendorStoreName,
        customerId: customerInfo.customerId,
        customerName: customerInfo.customerName,
        customerPhone: customerInfo.customerPhone,
        customerEmail: customerInfo.customerEmail,
        items: items.map(i => ({
          productId: i.productId,
          title: i.title,
          price: i.price,
          discountPrice: i.discountPrice,
          quantity: i.quantity,
          image: i.image,
          vendorId: i.vendorId,
          vendorStoreName: i.vendorStoreName
        })),
        subtotal: vendorSubtotal,
        deliveryFee: vendorDeliveryFee,
        platformCommission,
        netVendorEarnings,
        deliveryMethod: deliveryNeeded ? 'delivery' : 'pickup',
        deliveryAddress: customerInfo.deliveryAddress,
        location: customerInfo.location,
        customerNotes: customerInfo.customerNotes,
        status: 'confirmed',
        paymentStatus: 'paid',
        trackingUpdates: [
          { status: 'confirmed', timestamp: createdDate, note: 'Order placed & payment received.' }
        ],
        createdAt: createdDate,
        updatedAt: createdDate
      };

      vendorOrders.push(vOrder);

      // Decrement inventory for each product
      items.forEach(i => {
        this.updateProductStock(i.productId, -i.quantity);
        // Increment product order count
        const p = this.getProductById(i.productId);
        if (p) {
          p.ordersCount = (p.ordersCount || 0) + i.quantity;
          p.salesCount = (p.salesCount || 0) + i.quantity;
          this.saveProduct(p);
        }
      });

      // Record marketplace transaction for the vendor
      this.recordTransaction({
        id: `tx-${Date.now()}-${vId}`,
        orderId: masterOrderId,
        vendorOrderId,
        type: 'order_payment',
        amount: vendorSubtotal + vendorDeliveryFee,
        platformFee: platformCommission,
        vendorNetAmount: netVendorEarnings + vendorDeliveryFee,
        vendorId: vId,
        customerId: customerInfo.customerId,
        status: 'completed',
        reference: paymentRef,
        notes: `Order payment for ${items.length} items from ${vendorStoreName}`,
        createdAt: createdDate
      });
    });

    const masterOrder: MasterOrder = {
      id: masterOrderId,
      customerId: customerInfo.customerId,
      customerName: customerInfo.customerName,
      customerPhone: customerInfo.customerPhone,
      customerEmail: customerInfo.customerEmail,
      deliveryAddress: customerInfo.deliveryAddress,
      location: customerInfo.location,
      deliveryMethod: grandDeliveryFee > 0 ? 'delivery' : 'pickup',
      customerNotes: customerInfo.customerNotes,
      vendorOrderIds: vendorOrders.map(vo => vo.id),
      itemsCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: grandSubtotal,
      totalDeliveryFee: grandDeliveryFee,
      platformFee: 0,
      grandTotal: grandSubtotal + grandDeliveryFee,
      paymentStatus: 'paid',
      paymentReference: paymentRef,
      paymentChannel: 'paystack_test',
      overallStatus: 'confirmed',
      createdAt: createdDate,
      updatedAt: createdDate
    };

    // Save master order
    const allMaster = this.getMasterOrders();
    allMaster.unshift(masterOrder);
    this.setItem('orders', allMaster);

    // Save vendor suborders
    const allVO = this.getVendorOrders();
    vendorOrders.forEach(vo => allVO.unshift(vo));
    this.setItem('vendorOrders', allVO);

    // Clear buyer's cart
    this.clearCart(customerInfo.customerId);

    // Sync to Firestore
    if (db) {
      setDoc(doc(db, 'orders', masterOrder.id), masterOrder).catch(console.warn);
      vendorOrders.forEach(vo => {
        setDoc(doc(db, 'vendorOrders', vo.id), vo).catch(console.warn);
      });
    }

    return { masterOrder, vendorOrders };
  }

  static updateVendorOrderStatus(
    vendorOrderId: string,
    status: OrderStatus,
    note?: string
  ): void {
    const allVO = this.getVendorOrders();
    const target = allVO.find(vo => vo.id === vendorOrderId);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      target.trackingUpdates.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Order updated to ${status.replace('_', ' ')}`
      });
      this.setItem('vendorOrders', allVO);

      // Check parent master order status
      const parentOrder = this.getOrderById(target.parentOrderId);
      if (parentOrder) {
        const siblingVOs = this.getVendorOrdersForMasterOrder(parentOrder.id);
        const allDelivered = siblingVOs.every(v => v.status === 'delivered' || v.status === 'completed');
        const allCompleted = siblingVOs.every(v => v.status === 'completed');
        const allCancelled = siblingVOs.every(v => v.status === 'cancelled');

        if (allCompleted) parentOrder.overallStatus = 'completed';
        else if (allDelivered) parentOrder.overallStatus = 'delivered';
        else if (allCancelled) parentOrder.overallStatus = 'cancelled';
        else parentOrder.overallStatus = status;

        parentOrder.updatedAt = new Date().toISOString();
        const allOrders = this.getMasterOrders();
        const mIdx = allOrders.findIndex(o => o.id === parentOrder.id);
        if (mIdx >= 0) allOrders[mIdx] = parentOrder;
        this.setItem('orders', allOrders);

        if (db) {
          setDoc(doc(db, 'orders', parentOrder.id), parentOrder, { merge: true }).catch(console.warn);
        }
      }

      if (db) {
        setDoc(doc(db, 'vendorOrders', vendorOrderId), target, { merge: true }).catch(console.warn);
      }
    }
  }

  // ==========================================
  // REVIEWS (VERIFIED PURCHASE ONLY)
  // ==========================================
  static getProductReviews(productId: string): ProductReview[] {
    const allReviews = this.getItem<ProductReview[]>('productReviews', initialProductReviews);
    return allReviews.filter(r => r.productId === productId);
  }

  static getAllProductReviews(): ProductReview[] {
    return this.getItem<ProductReview[]>('productReviews', initialProductReviews);
  }

  static canUserReviewProduct(customerId: string, productId: string): { eligible: boolean; orderId?: string; reason?: string } {
    const allOrders = this.getMasterOrders().filter(o => o.customerId === customerId);
    const vendorOrders = this.getVendorOrders().filter(vo => vo.customerId === customerId && (vo.status === 'completed' || vo.status === 'delivered'));

    let matchedOrder: VendorOrder | undefined;
    for (const vo of vendorOrders) {
      if (vo.items.some(i => i.productId === productId)) {
        matchedOrder = vo;
        break;
      }
    }

    if (!matchedOrder) {
      return { eligible: false, reason: 'You can only review products from a completed or delivered order.' };
    }

    // Check if already reviewed
    const existing = this.getProductReviews(productId).find(r => r.customerId === customerId && r.orderId === matchedOrder?.parentOrderId);
    if (existing) {
      return { eligible: false, reason: 'You have already submitted a review for this purchase.' };
    }

    return { eligible: true, orderId: matchedOrder.parentOrderId };
  }

  static submitProductReview(review: ProductReview): void {
    const reviews = this.getAllProductReviews();
    reviews.unshift(review);
    this.setItem('productReviews', reviews);

    // Recalculate product rating
    const productReviews = reviews.filter(r => r.productId === review.productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const p = this.getProductById(review.productId);
    if (p) {
      p.rating = Math.round(avgRating * 10) / 10;
      p.reviewsCount = productReviews.length;
      this.saveProduct(p);
    }

    // Recalculate vendor rating
    const vendorReviews = reviews.filter(r => r.vendorId === review.vendorId);
    const vAvg = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
    const v = this.getVendorById(review.vendorId);
    if (v) {
      v.rating = Math.round(vAvg * 10) / 10;
      v.reviewsCount = vendorReviews.length;
      this.saveVendor(v);
    }

    if (db) {
      setDoc(doc(db, 'productReviews', review.id), review).catch(console.warn);
    }
  }

  // ==========================================
  // PRODUCT PROMOTIONS / ADVERTISING
  // ==========================================
  static getPromotions(): ProductPromotion[] {
    return this.getItem<ProductPromotion[]>('promotions', []);
  }

  static getVendorPromotions(vendorId: string): ProductPromotion[] {
    return this.getPromotions().filter(p => p.vendorId === vendorId);
  }

  static createPromotion(promo: ProductPromotion): void {
    const promos = this.getPromotions();
    promos.unshift(promo);
    this.setItem('promotions', promos);

    // Mark product as promoted
    const prod = this.getProductById(promo.productId);
    if (prod) {
      prod.isPromoted = true;
      prod.promotionType = promo.type;
      this.saveProduct(prod);
    }

    // Record promotion transaction
    this.recordTransaction({
      id: `tx-promo-${Date.now()}`,
      orderId: promo.id,
      type: 'promotion_fee',
      amount: promo.cost,
      platformFee: promo.cost,
      vendorNetAmount: 0,
      vendorId: promo.vendorId,
      status: 'completed',
      reference: `PROMO-${Date.now()}`,
      notes: `Product Advertising Package: ${promo.packageName} for ${promo.productTitle}`,
      createdAt: new Date().toISOString()
    });

    if (db) {
      setDoc(doc(db, 'promotions', promo.id), promo).catch(console.warn);
    }
  }

  // ==========================================
  // VENDOR WALLET & PAYOUTS
  // ==========================================
  static getPayoutRequests(): PayoutRequest[] {
    return this.getItem<PayoutRequest[]>('payoutRequests', []);
  }

  static getVendorPayouts(vendorId: string): PayoutRequest[] {
    return this.getPayoutRequests().filter(p => p.vendorId === vendorId);
  }

  static requestPayout(
    vendorId: string,
    vendorStoreName: string,
    amount: number,
    bankInfo: { bankName: string; accountNumber: string; accountName: string }
  ): { success: boolean; message: string; payout?: PayoutRequest } {
    const metrics = this.getVendorMetrics(vendorId);
    const settings = this.getMarketplaceSettings();

    if (amount < settings.minPayoutAmount) {
      return { success: false, message: `Minimum payout request is ₦${settings.minPayoutAmount.toLocaleString()}` };
    }

    if (amount > metrics.availableBalance) {
      return { success: false, message: `Requested amount exceeds available balance (₦${metrics.availableBalance.toLocaleString()})` };
    }

    const payout: PayoutRequest = {
      id: `PAYOUT-${Date.now().toString().slice(-6)}`,
      vendorId,
      vendorStoreName,
      amount,
      bankName: bankInfo.bankName,
      accountNumber: bankInfo.accountNumber,
      accountName: bankInfo.accountName,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    const payouts = this.getPayoutRequests();
    payouts.unshift(payout);
    this.setItem('payoutRequests', payouts);

    if (db) {
      setDoc(doc(db, 'payoutRequests', payout.id), payout).catch(console.warn);
    }

    return { success: true, message: 'Payout withdrawal requested successfully.', payout };
  }

  static updatePayoutStatus(payoutId: string, status: PayoutRequest['status'], adminNotes?: string): void {
    const payouts = this.getPayoutRequests();
    const target = payouts.find(p => p.id === payoutId);
    if (target) {
      target.status = status;
      if (adminNotes) target.adminNotes = adminNotes;
      if (status === 'paid') target.processedAt = new Date().toISOString();
      this.setItem('payoutRequests', payouts);

      if (db) {
        setDoc(doc(db, 'payoutRequests', payoutId), target, { merge: true }).catch(console.warn);
      }
    }
  }

  // ==========================================
  // REAL VENDOR METRICS CALCULATION
  // ==========================================
  static getVendorMetrics(vendorId: string) {
    const vendorOrders = this.getVendorOrdersForVendor(vendorId);
    const products = this.getProductsByVendor(vendorId);
    const payouts = this.getVendorPayouts(vendorId);

    const totalSales = vendorOrders.filter(vo => vo.paymentStatus === 'paid' && vo.status !== 'cancelled').length;
    const pendingOrders = vendorOrders.filter(vo => vo.status === 'confirmed' || vo.status === 'processing' || vo.status === 'ready_for_pickup' || vo.status === 'out_for_delivery').length;
    const completedOrders = vendorOrders.filter(vo => vo.status === 'delivered' || vo.status === 'completed').length;
    const outOfStockProducts = products.filter(p => p.quantity === 0 || p.status === 'out_of_stock').length;

    // Gross Earnings (all paid non-cancelled subtotal + delivery)
    const paidOrders = vendorOrders.filter(vo => vo.paymentStatus === 'paid' && vo.status !== 'cancelled');
    const grossEarnings = paidOrders.reduce((sum, vo) => sum + vo.subtotal + vo.deliveryFee, 0);
    const platformFees = paidOrders.reduce((sum, vo) => sum + vo.platformCommission, 0);
    const netEarnings = grossEarnings - platformFees;

    // Payout calculations
    const withdrawnAmount = payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayoutAmount = payouts.filter(p => p.status === 'pending' || p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);
    
    // Completed earnings available vs pending earnings
    const completedPaidOrders = vendorOrders.filter(vo => (vo.status === 'delivered' || vo.status === 'completed') && vo.paymentStatus === 'paid');
    const completedNetEarnings = completedPaidOrders.reduce((sum, vo) => sum + vo.netVendorEarnings + vo.deliveryFee, 0);
    const pendingNetEarnings = netEarnings - completedNetEarnings;

    const availableBalance = Math.max(0, completedNetEarnings - withdrawnAmount - pendingPayoutAmount);

    return {
      totalSales,
      pendingOrders,
      completedOrders,
      totalProducts: products.length,
      outOfStockProducts,
      grossEarnings,
      platformFees,
      netEarnings,
      pendingBalance: pendingNetEarnings,
      availableBalance,
      withdrawnAmount,
      pendingPayoutAmount
    };
  }

  // ==========================================
  // TRANSACTIONS
  // ==========================================
  static getTransactions(): MarketplaceTransaction[] {
    return this.getItem<MarketplaceTransaction[]>('marketplaceTransactions', []);
  }

  static recordTransaction(tx: MarketplaceTransaction): void {
    const txs = this.getTransactions();
    txs.unshift(tx);
    this.setItem('marketplaceTransactions', txs);

    if (db) {
      setDoc(doc(db, 'marketplaceTransactions', tx.id), tx).catch(console.warn);
    }
  }

  // ==========================================
  // PRODUCT REPORTS
  // ==========================================
  static getProductReports(): ProductReport[] {
    return this.getItem<ProductReport[]>('productReports', []);
  }

  static submitProductReport(report: ProductReport): void {
    const reports = this.getProductReports();
    reports.unshift(report);
    this.setItem('productReports', reports);

    if (db) {
      setDoc(doc(db, 'productReports', report.id), report).catch(console.warn);
    }
  }

  static updateProductReportStatus(reportId: string, status: ProductReport['status'], adminNotes?: string): void {
    const reports = this.getProductReports();
    const target = reports.find(r => r.id === reportId);
    if (target) {
      target.status = status;
      if (adminNotes) target.adminNotes = adminNotes;
      if (status === 'resolved' || status === 'dismissed') target.resolvedAt = new Date().toISOString();
      this.setItem('productReports', reports);

      if (db) {
        setDoc(doc(db, 'productReports', reportId), target, { merge: true }).catch(console.warn);
      }
    }
  }

  // ==========================================
  // SETTINGS
  // ==========================================
  static getMarketplaceSettings(): MarketplaceSettings {
    return this.getItem<MarketplaceSettings>('marketplaceSettings', initialMarketplaceSettings);
  }

  static saveMarketplaceSettings(settings: MarketplaceSettings): void {
    this.setItem('marketplaceSettings', settings);
    if (db) {
      setDoc(doc(db, 'marketplaceSettings', 'global'), settings, { merge: true }).catch(console.warn);
    }
  }

  // ==========================================
  // CONVENIENCE ALIASES
  // ==========================================
  static getAllProducts(): ProductItem[] {
    return this.getProducts();
  }

  static getAllVendors(): VendorProfile[] {
    return this.getVendors();
  }

  static getAllReports(): ProductReport[] {
    return this.getProductReports();
  }

  static updateReportStatus(reportId: string, status: ProductReport['status'], adminNotes?: string): void {
    return this.updateProductReportStatus(reportId, status, adminNotes);
  }

  static getAllPayouts(): PayoutRequest[] {
    return this.getPayoutRequests();
  }

  static getCustomerOrders(customerId: string): MasterOrder[] {
    return this.getOrdersForCustomer(customerId);
  }

  static getVendorOrdersForMaster(masterOrderId: string): VendorOrder[] {
    return this.getVendorOrdersForMasterOrder(masterOrderId);
  }
}
