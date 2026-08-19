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
export const initialVendors: VendorProfile[] = [
  {
    id: 'student-1',
    studentId: 'student-1',
    studentName: 'Onifade Sulaiman',
    studentEmail: 'sulaiman@ooustudentcircle.com',
    studentMatric: 'CSC/2021/0482',
    studentDepartment: 'Computer Science',
    studentLevel: '400L',
    storeName: 'Clarity Prints & Branding',
    profileImage: founderImage,
    bannerImage: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=1200&auto=format&fit=crop&q=80',
    businessDescription: 'Student-owned printing, customized apparel, branded merchandise, student ID card lanyards, and premium marketing fliers.',
    category: 'Art & Handmade',
    location: 'Ago-Iwoye Main Campus (Near ICT Centre)',
    whatsappNumber: '08051780169',
    contactPreferences: {
      whatsapp: true,
      inAppChat: true,
      phone: true,
      email: true
    },
    verificationStatus: 'approved',
    rating: 4.9,
    reviewsCount: 34,
    totalSales: 48,
    totalProducts: 4,
    isDemo: true,
    bankInfo: {
      bankName: 'Kuda Bank',
      accountNumber: '2001928374',
      accountName: 'Onifade Sulaiman'
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-05-15T12:00:00Z'
  },
  {
    id: 'student-2',
    studentId: 'student-2',
    studentName: 'Adebayo Samuel',
    studentEmail: 'adebayo.samuel@gmail.com',
    studentMatric: 'FAA/2022/0119',
    studentDepartment: 'Fine & Applied Arts',
    studentLevel: '300L',
    storeName: 'Adebayo Art & Custom Kicks',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    businessDescription: 'Custom hand-painted sneakers, personalized denim jackets, and canvas portraits made with premium water-resistant textile acrylics.',
    category: 'Fashion & Clothing',
    location: 'Mini Campus & Ago-Iwoye Main Campus',
    whatsappNumber: '08031112233',
    contactPreferences: {
      whatsapp: true,
      inAppChat: true,
      phone: false,
      email: true
    },
    verificationStatus: 'approved',
    rating: 4.8,
    reviewsCount: 18,
    totalSales: 25,
    totalProducts: 3,
    isDemo: true,
    bankInfo: {
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0129483726',
      accountName: 'Adebayo Samuel'
    },
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-05-10T14:00:00Z'
  },
  {
    id: 'student-3',
    studentId: 'student-3',
    studentName: 'Maryam Adeola',
    studentEmail: 'maryam.adeola@gmail.com',
    studentMatric: 'MAC/2022/0304',
    studentDepartment: 'Mass Communication',
    studentLevel: '300L',
    storeName: 'Gourmet Campus Bites & Parfait',
    profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    businessDescription: 'Fresh fruit parfaits, Belgian waffles, mini chinchin jars, and gourmet snack packs delivered directly to your faculty or hostel.',
    category: 'Food & Snacks',
    location: 'Ago-Iwoye Main Campus (Delivery to SMS, Science, Law, Education)',
    whatsappNumber: '08149987766',
    contactPreferences: {
      whatsapp: true,
      inAppChat: true,
      phone: true,
      email: true
    },
    verificationStatus: 'approved',
    rating: 4.9,
    reviewsCount: 42,
    totalSales: 85,
    totalProducts: 3,
    isDemo: true,
    bankInfo: {
      bankName: 'Opay',
      accountNumber: '8149987766',
      accountName: 'Maryam Adeola'
    },
    createdAt: '2024-02-18T11:00:00Z',
    updatedAt: '2024-05-12T16:00:00Z'
  }
];

// Initial Demo Products (Marked isDemo: true)
export const initialProducts: ProductItem[] = [
  {
    id: 'prod-1',
    vendorId: 'student-1',
    vendorName: 'Onifade Sulaiman',
    vendorStoreName: 'Clarity Prints & Branding',
    vendorPhoto: founderImage,
    isVendorVerified: true,
    title: 'Customized OOU Heavyweight Graphic Hoodie',
    name: 'Customized OOU Heavyweight Graphic Hoodie',
    description: 'Premium 380GSM fleece-lined cotton hoodie customized with clean OOU typographic campus branding or your custom department name. Shrink-resistant, vibrant DTF heat transfer print, extremely cozy for cold morning lectures.',
    category: 'Fashion & Clothing',
    price: 12500,
    discountPrice: 10500,
    quantity: 14,
    sku: 'CP-HD-001',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
    ],
    mainImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    condition: 'brand_new',
    location: 'Ago-Iwoye Main Campus',
    deliveryOptions: 'both',
    pickupAvailable: true,
    pickupLocationDescription: 'Front of ICT Centre / Faculty of Science complex, Ago-Iwoye',
    deliveryAvailable: true,
    deliveryFee: 500,
    estimatedDeliveryTime: '24-48 Hours',
    status: 'published',
    views: 312,
    ordersCount: 22,
    salesCount: 22,
    rating: 4.9,
    reviewsCount: 16,
    isPromoted: true,
    promotionType: 'featured',
    isDemo: true,
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-05-14T09:00:00Z'
  },
  {
    id: 'prod-2',
    vendorId: 'student-1',
    vendorName: 'Onifade Sulaiman',
    vendorStoreName: 'Clarity Prints & Branding',
    vendorPhoto: founderImage,
    isVendorVerified: true,
    title: 'Executive Metal Engraved Pen & Notebook Set',
    name: 'Executive Metal Engraved Pen & Notebook Set',
    description: 'Matte black hardcover notebook (192 ruled ivory pages) with a refillable laser-engraved metal ballpoint pen. Perfect for university lectures, student executive meetings, project defense notes, and gifts.',
    category: 'Books & Educational Materials',
    price: 6000,
    discountPrice: 4800,
    quantity: 25,
    sku: 'CP-NB-002',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80'
    ],
    mainImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    condition: 'brand_new',
    location: 'Ago-Iwoye Main Campus',
    deliveryOptions: 'both',
    pickupAvailable: true,
    pickupLocationDescription: 'Front of ICT Centre, Ago-Iwoye',
    deliveryAvailable: true,
    deliveryFee: 400,
    estimatedDeliveryTime: 'Same Day / 24 Hours',
    status: 'published',
    views: 184,
    ordersCount: 15,
    salesCount: 15,
    rating: 4.8,
    reviewsCount: 11,
    isPromoted: true,
    promotionType: 'homepage',
    isDemo: true,
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-05-12T10:00:00Z'
  },
  {
    id: 'prod-3',
    vendorId: 'student-3',
    vendorName: 'Maryam Adeola',
    vendorStoreName: 'Gourmet Campus Bites & Parfait',
    vendorPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    isVendorVerified: true,
    title: 'Triple-Layer Greek Yogurt Fruit Parfait (500ml)',
    name: 'Triple-Layer Greek Yogurt Fruit Parfait (500ml)',
    description: 'Chilled rich unsweetened Greek yogurt layered with organic chia seeds, roasted crunchy granola, fresh strawberries, sweet grapes, apples, and raw honey drizzle. Prepared fresh every morning on campus.',
    category: 'Food & Snacks',
    price: 2500,
    quantity: 18,
    sku: 'GB-PF-001',
    images: [
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80'
    ],
    mainImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
    condition: 'handmade',
    location: 'Ago-Iwoye Main Campus',
    deliveryOptions: 'both',
    pickupAvailable: true,
    pickupLocationDescription: 'Faculty of Social & Management Sciences Pavilion, Ago-Iwoye',
    deliveryAvailable: true,
    deliveryFee: 300,
    estimatedDeliveryTime: '30-45 Minutes across Ago-Iwoye Campus',
    status: 'published',
    views: 420,
    ordersCount: 54,
    salesCount: 54,
    rating: 5.0,
    reviewsCount: 26,
    isPromoted: true,
    promotionType: 'featured',
    isDemo: true,
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-05-15T15:00:00Z'
  },
  {
    id: 'prod-4',
    vendorId: 'student-2',
    vendorName: 'Adebayo Samuel',
    vendorStoreName: 'Adebayo Art & Custom Kicks',
    vendorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    isVendorVerified: true,
    title: 'Custom Hand-Painted Minimalist Canvas Low-Tops',
    name: 'Custom Hand-Painted Minimalist Canvas Low-Tops',
    description: 'Clean white canvas sneakers custom detailed with waterproof anime, geometric, or floral art. Sealed with hydrophobic protective coating that withstands rain and campus dust.',
    category: 'Shoes',
    price: 18500,
    discountPrice: 16000,
    quantity: 8,
    sku: 'AA-SH-001',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'
    ],
    mainImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    condition: 'handmade',
    location: 'Ago-Iwoye Mini Campus / Main Campus',
    deliveryOptions: 'both',
    pickupAvailable: true,
    pickupLocationDescription: 'Fine Arts Studio or Ago-Iwoye Main Gate',
    deliveryAvailable: true,
    deliveryFee: 600,
    estimatedDeliveryTime: '3-4 Days (Hand-painted to size)',
    status: 'published',
    views: 290,
    ordersCount: 12,
    salesCount: 12,
    rating: 4.8,
    reviewsCount: 9,
    isPromoted: false,
    isDemo: true,
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-05-11T13:00:00Z'
  },
  {
    id: 'prod-5',
    vendorId: 'student-1',
    vendorName: 'Onifade Sulaiman',
    vendorStoreName: 'Clarity Prints & Branding',
    vendorPhoto: founderImage,
    isVendorVerified: true,
    title: 'Dual USB Fast Charging Power Bank 20,000mAh',
    name: 'Dual USB Fast Charging Power Bank 20,000mAh',
    description: 'Original high-capacity power bank with digital LED battery percentage display, Type-C 22.5W Power Delivery, and dual USB-A quick charge ports. Essential for long lecture days and hostel power management.',
    category: 'Electronics',
    price: 14500,
    discountPrice: 13000,
    quantity: 12,
    sku: 'CP-PB-003',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    mainImage: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
    condition: 'brand_new',
    location: 'Ago-Iwoye Main Campus',
    deliveryOptions: 'both',
    pickupAvailable: true,
    pickupLocationDescription: 'ICT Centre Building, Ago-Iwoye',
    deliveryAvailable: true,
    deliveryFee: 500,
    estimatedDeliveryTime: 'Same Day Delivery',
    status: 'published',
    views: 510,
    ordersCount: 31,
    salesCount: 31,
    rating: 4.9,
    reviewsCount: 19,
    isPromoted: true,
    promotionType: 'featured',
    isDemo: true,
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-05-14T10:00:00Z'
  },
  {
    id: 'prod-6',
    vendorId: 'student-3',
    vendorName: 'Maryam Adeola',
    vendorStoreName: 'Gourmet Campus Bites & Parfait',
    vendorPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    isVendorVerified: true,
    title: 'Crunchy Spiced Milky Chinchin Jar (1kg Family Size)',
    name: 'Crunchy Spiced Milky Chinchin Jar (1kg Family Size)',
    description: 'Ultra-crunchy, rich vanilla-infused Nigerian chinchin made with premium creamery butter, nutmeg, and powdered milk. Sealed in a reusable airtight 1kg jar.',
    category: 'Food & Snacks',
    price: 3200,
    quantity: 20,
    sku: 'GB-CC-002',
    images: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&auto=format&fit=crop&q=80'
    ],
    mainImage: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&auto=format&fit=crop&q=80',
    condition: 'handmade',
    location: 'Ago-Iwoye Main Campus',
    deliveryOptions: 'both',
    pickupAvailable: true,
    pickupLocationDescription: 'SMS Faculty Cafeteria, Ago-Iwoye',
    deliveryAvailable: true,
    deliveryFee: 300,
    estimatedDeliveryTime: 'Within 2 Hours',
    status: 'published',
    views: 240,
    ordersCount: 28,
    salesCount: 28,
    rating: 4.9,
    reviewsCount: 14,
    isPromoted: false,
    isDemo: true,
    createdAt: '2024-03-20T09:00:00Z',
    updatedAt: '2024-05-13T12:00:00Z'
  }
];

// Initial Demo Reviews
export const initialProductReviews: ProductReview[] = [
  {
    id: 'rev-p-1',
    productId: 'prod-1',
    productTitle: 'Customized OOU Heavyweight Graphic Hoodie',
    vendorId: 'student-1',
    orderId: 'ORD-DEMO-001',
    customerId: 'student-4',
    customerName: 'Praise Daniel',
    customerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    rating: 5,
    reviewTitle: 'Top quality material and print!',
    comment: 'The hoodie fabric is very thick and warm, perfect for 8 AM CSC lectures in cold weather. Sulaiman delivered it to my hostel in Ago-Iwoye promptly.',
    isVerifiedPurchase: true,
    createdAt: '2024-04-10T14:30:00Z'
  },
  {
    id: 'rev-p-2',
    productId: 'prod-3',
    productTitle: 'Triple-Layer Greek Yogurt Fruit Parfait (500ml)',
    vendorId: 'student-3',
    orderId: 'ORD-DEMO-002',
    customerId: 'student-1',
    customerName: 'Onifade Sulaiman',
    customerPhoto: founderImage,
    rating: 5,
    reviewTitle: 'So fresh and delicious!',
    comment: 'Ordered this during exam revision week. It arrived ice cold and packed with generous fresh fruits. Highly recommended!',
    isVerifiedPurchase: true,
    createdAt: '2024-04-18T11:20:00Z'
  }
];

// Initial Settings
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
