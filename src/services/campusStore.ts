import {
  CampusLocation,
  CampusShop,
  CampusService,
  CampusOrder,
  CampusReview,
  CampusMessage,
  CampusPromotion,
  CampusReport,
  calculateShopAvailability,
  ShopVerificationStatus,
  CampusOrderStatus
} from '../types/campus';
import { db, isConfigured } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';

const STORAGE_PREFIX = 'oou_campus_hub_';

// Initial Scalable Campus Locations - The Five Official OOU Campus Locations
export const initialCampusLocations: CampusLocation[] = [
  {
    id: 'campus-main-permanent',
    name: 'Main Campus (Permanent Site)',
    slug: 'main-campus',
    location: 'Ago-Iwoye',
    subTitle: 'Permanent Site',
    campusType: 'Main Campus (Permanent Site)',
    status: 'Active',
    description: 'The central administrative, academic, and business headquarters of OOU. Houses Senate Building, Science, Social Sciences, Law, and the flagship Motion Ground documentation center.',
    campusId: 'oou-main-campus',
    campusName: 'Main Campus (Permanent Site)',
    code: 'MAIN',
    landmark: 'Motion Ground, Administrative Block & Senate Building Walkway',
    latitude: 6.9458,
    longitude: 3.9167,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    serviceAreas: ['Motion Ground', 'School Gate', 'Hostel Area', 'Faculty Area', 'Student Centre', 'Quadrangle Walkway', 'Science Complex', 'SMS Arcade'],
    popularServices: ['Project Printing & Hardcover Binding', 'JAMB Screening & Verification', 'Instant Passport Photographs', 'Graphic Design & Tech Support', 'Course Pack Photocopying'],
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'campus-mini',
    name: 'Mini Campus',
    slug: 'mini-campus',
    location: 'Ago-Iwoye',
    subTitle: 'Ago-Iwoye',
    campusType: 'Mini Campus',
    status: 'Active',
    description: 'Historic campus precinct hosting specialized lecture theatres, law libraries, faculty wings, student hostels, and busy typing & photocopy kiosks.',
    campusId: 'oou-mini-campus',
    campusName: 'Mini Campus',
    code: 'MINI',
    landmark: 'Old Law Library Arcade & Mini Campus Security Gate',
    latitude: 6.9321,
    longitude: 3.9054,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    serviceAreas: ['School Gate', 'Hostel Area', 'Faculty Area', 'Student Centre', 'Law Library Arcade', 'Old Admin Block'],
    popularServices: ['Document Photocopying', 'Legal Draft Formatting', 'Course Material Duplication', 'Stationery Supply', 'Spiral Binding'],
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'campus-ibogun',
    name: 'Ibogun Campus',
    slug: 'ibogun',
    location: 'Ibogun',
    subTitle: 'Ibogun',
    campusType: 'College of Engineering & Technology (COET)',
    status: 'Active',
    description: 'Seat of the College of Engineering and Technology (COET), fostering engineering drafting, CAD blueprints, hardware repairs, and technical documentation.',
    campusId: 'oou-ibogun',
    campusName: 'Ibogun Campus',
    code: 'IBG',
    landmark: 'Engineering Workshop & COET Faculty Auditorium Complex',
    latitude: 6.8833,
    longitude: 3.2500,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    serviceAreas: ['School Gate', 'Hostel Area', 'Faculty Area', 'Student Centre', 'Engineering Workshop', 'COET Tech Lab'],
    popularServices: ['Engineering Blueprint Plotting', 'CAD/Technical Documentation', 'Laptop & Gadget Repairs', 'Spiral & Hardcover Binding'],
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'campus-ayetoro',
    name: 'Ayetoro Campus',
    slug: 'ayetoro',
    location: 'Ayetoro',
    subTitle: 'Ayetoro',
    campusType: 'College of Agricultural Sciences (CAS)',
    status: 'Active',
    description: 'Home of the College of Agricultural Sciences (CAS), supporting agribusiness research, farm practicals, and dedicated student commercial print centers.',
    campusId: 'oou-ayetoro',
    campusName: 'Ayetoro Campus',
    code: 'AYT',
    landmark: 'Agricultural Farm Complex & Lecture Theatres Arcade',
    latitude: 7.2333,
    longitude: 3.0333,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=800&auto=format&fit=crop&q=80',
    serviceAreas: ['School Gate', 'Hostel Area', 'Faculty Area', 'Student Centre', 'Agric Complex Arcade', 'Farm Practical Center'],
    popularServices: ['Agric Project Documentation', 'Field Work Reports', 'Full Color Printing', 'Stationery & Provisions', 'Project Binding'],
    displayOrder: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'campus-sagamu',
    name: 'Sagamu Campus',
    slug: 'sagamu',
    location: 'Sagamu',
    subTitle: 'Sagamu',
    campusType: 'College of Health Sciences (CHS & OOUTH)',
    status: 'Active',
    description: 'Home to the Obafemi Awolowo College of Health Sciences and OOUTH, serving medical, nursing, pharmacology, and clinical research students.',
    campusId: 'oou-sagamu',
    campusName: 'Sagamu Campus',
    code: 'SGM',
    landmark: 'OOUTH Complex & Clinical Sciences Quadrangle',
    latitude: 6.8400,
    longitude: 3.6500,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    serviceAreas: ['School Gate', 'Hostel Area', 'Faculty Area', 'Student Centre', 'OOUTH Gate Area', 'Clinical Sciences Complex'],
    popularServices: ['Medical Thesis & Case Study Binding', 'Logbook Formatting', 'Fast Screening Printing', 'Clinical Research Docs', 'Instant ID Photos'],
    displayOrder: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Initial Campus Shops (with Alhaja Biz Venture Shop E6 at Motion Ground as the primary flagship)
// Initial Campus Shops - Empty by default, created by registered shop operators
export const initialCampusShops: CampusShop[] = [];

// Initial Campus Services - Empty by default, added by real shops
export const initialCampusServices: CampusService[] = [];

// Initial Campus Orders - Empty by default, placed by real students/aspirants
export const initialCampusOrders: CampusOrder[] = [];

// Initial Campus Reviews - Empty by default
export const initialCampusReviews: CampusReview[] = [];

export class CampusStore {
  // 1. LOCATIONS
  static getLocations(): CampusLocation[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'locations');
    let list: CampusLocation[] = initialCampusLocations;
    if (raw) {
      try { 
        list = JSON.parse(raw); 
      } catch (e) { 
        list = initialCampusLocations;
      }
    }
    // Calculate live accurate shop counts & active providers dynamically
    const shops = this.getShops();
    const computed = list.map(loc => {
      const liveShops = shops.filter(s => 
        (s.locationId === loc.id || s.campusId === loc.campusId || s.campusName === loc.name || s.campusName === loc.campusName) && 
        s.verificationStatus === 'verified'
      );
      return {
        ...loc,
        shopCount: liveShops.length,
        activeProvidersCount: liveShops.length,
        isActive: loc.status === 'Active'
      };
    });
    return computed.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }

  static getPublicLocations(): CampusLocation[] {
    return this.getLocations().filter(loc => loc.status === 'Active');
  }

  static getActiveProvidersCount(locationIdOrSlug: string): number {
    const loc = this.getLocations().find(l => l.id === locationIdOrSlug || l.slug === locationIdOrSlug || l.campusId === locationIdOrSlug);
    if (!loc) return 0;
    const shops = this.getShops().filter(s => 
      (s.locationId === loc.id || s.campusId === loc.campusId || s.campusName === loc.name || s.campusName === loc.campusName) && 
      s.verificationStatus === 'verified'
    );
    return shops.length;
  }

  static getShopCountForLocation(locationId: string): number {
    return this.getShops().filter(s => 
      (s.locationId === locationId || s.campusId === locationId) && 
      s.verificationStatus === 'verified'
    ).length;
  }

  static saveLocation(location: Partial<CampusLocation> & { name: string; slug: string }): CampusLocation {
    const list = this.getLocations();
    const now = new Date().toISOString();
    const id = location.id || `campus-${location.slug || Date.now()}`;
    const newLocation: CampusLocation = {
      id,
      name: location.name,
      slug: location.slug || id,
      location: location.location || 'Ago-Iwoye',
      subTitle: location.subTitle || location.campusType || '',
      description: location.description || '',
      campusType: location.campusType || 'Main Campus',
      status: location.status || 'Active',
      image: location.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
      latitude: location.latitude,
      longitude: location.longitude,
      landmark: location.landmark || '',
      serviceAreas: location.serviceAreas || ['School Gate', 'Hostel Area', 'Faculty Area', 'Student Centre'],
      popularServices: location.popularServices || ['Project Printing & Binding', 'Photocopying', 'Screening Verification'],
      displayOrder: location.displayOrder ?? list.length + 1,
      isActive: (location.status || 'Active') === 'Active',
      createdAt: location.createdAt || now,
      updatedAt: now,
    };

    const idx = list.findIndex(l => l.id === id);
    if (idx >= 0) {
      list[idx] = newLocation;
    } else {
      list.push(newLocation);
    }
    localStorage.setItem(STORAGE_PREFIX + 'locations', JSON.stringify(list));
    return newLocation;
  }

  static deleteLocation(locationId: string): boolean {
    const list = this.getLocations().filter(l => l.id !== locationId);
    localStorage.setItem(STORAGE_PREFIX + 'locations', JSON.stringify(list));
    return true;
  }

  static reorderLocations(orderedIds: string[]): CampusLocation[] {
    const list = this.getLocations();
    const updated = list.map(loc => {
      const idx = orderedIds.indexOf(loc.id);
      return {
        ...loc,
        displayOrder: idx >= 0 ? idx + 1 : loc.displayOrder || 99
      };
    });
    localStorage.setItem(STORAGE_PREFIX + 'locations', JSON.stringify(updated));
    return this.getLocations();
  }

  // 2. SHOPS
  static getShops(): CampusShop[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'shops');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallback */ }
    }
    localStorage.setItem(STORAGE_PREFIX + 'shops', JSON.stringify(initialCampusShops));
    return initialCampusShops;
  }

  static getShopById(shopId: string): CampusShop | undefined {
    return this.getShops().find(s => s.id === shopId);
  }

  static getShopsByLocation(locationId: string): CampusShop[] {
    return this.getShops().filter(s => s.locationId === locationId && s.verificationStatus === 'verified');
  }

  static saveShop(shop: CampusShop): void {
    const list = this.getShops();
    const idx = list.findIndex(s => s.id === shop.id);
    if (idx >= 0) {
      list[idx] = { ...shop, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(shop);
    }
    localStorage.setItem(STORAGE_PREFIX + 'shops', JSON.stringify(list));
  }

  static updateShopStatus(shopId: string, status: ShopVerificationStatus, notes?: string): void {
    const shop = this.getShopById(shopId);
    if (shop) {
      shop.verificationStatus = status;
      if (notes) shop.verificationNotes = notes;
      shop.updatedAt = new Date().toISOString();
      this.saveShop(shop);
    }
  }

  static setShopManualOverride(shopId: string, override: 'open' | 'closed' | 'busy' | 'auto'): void {
    const shop = this.getShopById(shopId);
    if (shop) {
      shop.manualStatusOverride = override;
      shop.updatedAt = new Date().toISOString();
      this.saveShop(shop);
    }
  }

  // 3. SERVICES
  static getServices(): CampusService[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'services');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallback */ }
    }
    localStorage.setItem(STORAGE_PREFIX + 'services', JSON.stringify(initialCampusServices));
    return initialCampusServices;
  }

  static getServicesByShop(shopId: string): CampusService[] {
    return this.getServices().filter(s => s.shopId === shopId && s.status === 'active');
  }

  static getServiceById(serviceId: string): CampusService | undefined {
    return this.getServices().find(s => s.id === serviceId);
  }

  static saveService(service: CampusService): void {
    const list = this.getServices();
    const idx = list.findIndex(s => s.id === service.id);
    if (idx >= 0) {
      list[idx] = { ...service, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(service);
    }
    localStorage.setItem(STORAGE_PREFIX + 'services', JSON.stringify(list));
  }

  // 4. ORDERS & REQUESTS
  static getOrders(): CampusOrder[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'orders');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallback */ }
    }
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(initialCampusOrders));
    return initialCampusOrders;
  }

  static getOrderById(orderId: string): CampusOrder | undefined {
    return this.getOrders().find(o => o.id === orderId);
  }

  static getOrderByReference(reference: string): CampusOrder | undefined {
    return this.getOrders().find(o => o.referenceNumber.toLowerCase() === reference.trim().toLowerCase());
  }

  static getOrdersByCustomer(customerId: string): CampusOrder[] {
    return this.getOrders().filter(o => o.customerId === customerId);
  }

  static getOrdersByShop(shopId: string): CampusOrder[] {
    return this.getOrders().filter(o => o.shopId === shopId);
  }

  static createOrder(orderData: Partial<CampusOrder>): CampusOrder {
    const orders = this.getOrders();
    const locationCode = orderData.locationName?.includes('Motion') ? 'MG' : (orderData.locationName?.substring(0, 2).toUpperCase() || 'CP');
    const shopCode = orderData.shopCode || 'SH';
    const randDigits = Math.floor(10000 + Math.random() * 90000);
    const referenceNumber = `SC-${locationCode}-${shopCode}-${randDigits}`;

    const newOrder: CampusOrder = {
      id: `cord-${Date.now()}`,
      referenceNumber,
      customerId: orderData.customerId || 'guest',
      customerName: orderData.customerName || 'Customer',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail || '',
      customerType: orderData.customerType || 'student',
      customerMatricOrJamb: orderData.customerMatricOrJamb,
      shopId: orderData.shopId || '',
      shopName: orderData.shopName || '',
      shopCode: orderData.shopCode || '',
      locationName: orderData.locationName || 'Motion Ground',
      serviceId: orderData.serviceId || '',
      serviceName: orderData.serviceName || 'Campus Service',
      serviceCategory: orderData.serviceCategory || 'Printing',
      uploadedFiles: orderData.uploadedFiles || [],
      specifications: orderData.specifications || { copies: 1 },
      pricing: orderData.pricing || {
        pricingType: 'fixed',
        subtotal: 0,
        platformCommission: 0,
        processingFee: 0,
        netShopEarnings: 0,
        totalAmount: 0
      },
      quote: orderData.quote,
      payment: orderData.payment || { status: 'pending' },
      status: orderData.status || 'request_submitted',
      pickupVerification: {
        pickupCode: String(randDigits).substring(0, 4)
      },
      statusHistory: [
        {
          status: orderData.status || 'request_submitted',
          note: 'Order submitted online.',
          timestamp: new Date().toISOString(),
          updatedBy: orderData.customerName || 'Customer'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));

    // Update shop stats
    const shop = this.getShopById(newOrder.shopId);
    if (shop) {
      shop.totalOrdersCount = (shop.totalOrdersCount || 0) + 1;
      this.saveShop(shop);
    }

    return newOrder;
  }

  static updateOrderStatus(
    orderId: string, 
    status: CampusOrderStatus, 
    note: string, 
    updatedBy: string
  ): CampusOrder | null {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const order = orders[idx];
    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status,
      note,
      timestamp: new Date().toISOString(),
      updatedBy
    });

    if (status === 'collected') {
      order.pickupVerification.collectedAt = new Date().toISOString();
      order.pickupVerification.verifiedBy = updatedBy;
    }

    orders[idx] = order;
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));
    return order;
  }

  static submitQuote(
    orderId: string, 
    amount: number, 
    notes: string, 
    estimatedReadyTime: string, 
    hoursValid = 24
  ): CampusOrder | null {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const order = orders[idx];
    const commission = Math.round(amount * 0.10);
    const fee = 100;
    const total = amount + fee;

    order.quote = {
      quoteId: `qt-${Date.now()}`,
      amount,
      notes,
      estimatedReadyTime,
      expiresAt: new Date(Date.now() + hoursValid * 3600000).toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    order.pricing = {
      ...order.pricing,
      subtotal: amount,
      platformCommission: commission,
      processingFee: fee,
      netShopEarnings: amount - commission,
      totalAmount: total
    };

    order.status = 'price_confirmed';
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: 'price_confirmed',
      note: `Shop submitted quote of ₦${amount.toLocaleString()}. Ready by ${estimatedReadyTime}.`,
      timestamp: new Date().toISOString(),
      updatedBy: order.shopName
    });

    orders[idx] = order;
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));
    return order;
  }

  static respondToQuote(orderId: string, accept: boolean, customerName: string): CampusOrder | null {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const order = orders[idx];
    if (!order.quote) return null;

    if (accept) {
      order.quote.status = 'accepted';
      order.pricing.isQuoteAccepted = true;
      order.status = 'awaiting_payment';
      order.statusHistory.push({
        status: 'awaiting_payment',
        note: `Quote of ₦${order.pricing.subtotal.toLocaleString()} accepted by customer. Awaiting payment.`,
        timestamp: new Date().toISOString(),
        updatedBy: customerName
      });
    } else {
      order.quote.status = 'declined';
      order.status = 'cancelled';
      order.statusHistory.push({
        status: 'cancelled',
        note: 'Customer declined shop quote.',
        timestamp: new Date().toISOString(),
        updatedBy: customerName
      });
    }

    order.updatedAt = new Date().toISOString();
    orders[idx] = order;
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));
    return order;
  }

  static confirmPayment(
    orderId: string, 
    paymentMethod: 'paystack' | 'wallet' | 'card' | 'transfer', 
    reference: string
  ): CampusOrder | null {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const order = orders[idx];
    order.payment = {
      status: 'paid',
      paymentMethod,
      reference,
      paidAt: new Date().toISOString()
    };
    order.status = 'payment_confirmed';
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: 'payment_confirmed',
      note: `Payment of ₦${order.pricing.totalAmount.toLocaleString()} confirmed via ${paymentMethod.toUpperCase()} (${reference}).`,
      timestamp: new Date().toISOString(),
      updatedBy: 'Payment Gateway'
    });

    orders[idx] = order;
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));

    // Update shop revenue
    const shop = this.getShopById(order.shopId);
    if (shop) {
      shop.totalRevenue = (shop.totalRevenue || 0) + order.pricing.netShopEarnings;
      this.saveShop(shop);
    }

    return order;
  }

  static verifyAndCollectOrder(
    referenceOrCode: string, 
    verifiedBy: string
  ): { success: boolean; order?: CampusOrder; message: string } {
    const orders = this.getOrders();
    const cleanInput = referenceOrCode.trim().toUpperCase();

    const order = orders.find(
      o => o.referenceNumber.toUpperCase() === cleanInput || 
           o.pickupVerification.pickupCode === cleanInput
    );

    if (!order) {
      return { success: false, message: 'Order reference or PIN code not found.' };
    }

    if (order.status === 'collected' || order.status === 'completed') {
      return { success: false, order, message: `Order was already collected on ${new Date(order.pickupVerification.collectedAt || '').toLocaleString()}` };
    }

    if (order.status === 'cancelled') {
      return { success: false, order, message: 'This order was cancelled.' };
    }

    order.status = 'collected';
    order.pickupVerification.collectedAt = new Date().toISOString();
    order.pickupVerification.verifiedBy = verifiedBy;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: 'collected',
      note: `Physical pickup verified and package handed over to customer.`,
      timestamp: new Date().toISOString(),
      updatedBy: verifiedBy
    });

    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));
    return { success: true, order, message: `Successfully verified! Package handed over to ${order.customerName}.` };
  }

  // 5. REVIEWS
  static getReviews(): CampusReview[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'reviews');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallback */ }
    }
    localStorage.setItem(STORAGE_PREFIX + 'reviews', JSON.stringify(initialCampusReviews));
    return initialCampusReviews;
  }

  static getReviewsByShop(shopId: string): CampusReview[] {
    return this.getReviews().filter(r => r.shopId === shopId);
  }

  static addReview(reviewData: Partial<CampusReview>): CampusReview {
    const list = this.getReviews();
    const newRev: CampusReview = {
      id: `rev-c-${Date.now()}`,
      shopId: reviewData.shopId || '',
      orderId: reviewData.orderId || '',
      referenceNumber: reviewData.referenceNumber || '',
      customerId: reviewData.customerId || '',
      customerName: reviewData.customerName || 'OOU Student',
      customerType: reviewData.customerType || 'Student',
      rating: reviewData.rating || 5,
      comment: reviewData.comment || '',
      serviceName: reviewData.serviceName || 'Campus Service',
      createdAt: new Date().toISOString()
    };

    list.unshift(newRev);
    localStorage.setItem(STORAGE_PREFIX + 'reviews', JSON.stringify(list));

    // Update shop rating
    const shopReviews = list.filter(r => r.shopId === newRev.shopId);
    const avg = shopReviews.reduce((sum, r) => sum + r.rating, 0) / shopReviews.length;
    const shop = this.getShopById(newRev.shopId);
    if (shop) {
      shop.rating = Number(avg.toFixed(1));
      shop.reviewsCount = shopReviews.length;
      this.saveShop(shop);
    }

    return newRev;
  }

  // 6. MESSAGES
  static getMessages(): CampusMessage[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'messages');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallback */ }
    }
    return [];
  }

  static getMessagesForThread(shopId: string, customerId: string): CampusMessage[] {
    return this.getMessages().filter(
      m => m.shopId === shopId && m.customerId === customerId
    );
  }

  static sendMessage(msg: Partial<CampusMessage>): CampusMessage {
    const list = this.getMessages();
    const newMsg: CampusMessage = {
      id: `cmsg-${Date.now()}`,
      orderId: msg.orderId,
      shopId: msg.shopId || '',
      customerId: msg.customerId || '',
      senderId: msg.senderId || '',
      senderName: msg.senderName || '',
      senderRole: msg.senderRole || 'customer',
      text: msg.text || '',
      createdAt: new Date().toISOString(),
      read: false
    };
    list.push(newMsg);
    localStorage.setItem(STORAGE_PREFIX + 'messages', JSON.stringify(list));
    return newMsg;
  }

  // 7. REPORTS
  static getReports(): CampusReport[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'reports');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallback */ }
    }
    return [];
  }

  static submitReport(report: Partial<CampusReport>): CampusReport {
    const list = this.getReports();
    const newRep: CampusReport = {
      id: `crep-${Date.now()}`,
      shopId: report.shopId || '',
      orderId: report.orderId,
      reporterId: report.reporterId || '',
      reporterName: report.reporterName || '',
      reason: report.reason || 'Service Issue',
      description: report.description || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    list.unshift(newRep);
    localStorage.setItem(STORAGE_PREFIX + 'reports', JSON.stringify(list));
    return newRep;
  }

  static updateReportStatus(reportId: string, status: 'pending' | 'investigating' | 'resolved' | 'dismissed'): void {
    const list = this.getReports();
    const item = list.find(r => r.id === reportId);
    if (item) {
      item.status = status;
      localStorage.setItem(STORAGE_PREFIX + 'reports', JSON.stringify(list));
    }
  }

  // 8. PROMOTIONS
  static getPromotions(): CampusPromotion[] {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'promotions');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fallback */ }
    }
    return [];
  }

  static createPromotion(promo: Partial<CampusPromotion>): CampusPromotion {
    const list = this.getPromotions();
    const newPromo: CampusPromotion = {
      id: `cpromo-${Date.now()}`,
      shopId: promo.shopId || '',
      shopName: promo.shopName || '',
      type: promo.type || 'featured_shop',
      startDate: promo.startDate || new Date().toISOString(),
      endDate: promo.endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      amount: promo.amount || 5000,
      paymentStatus: 'paid',
      active: true,
      createdAt: new Date().toISOString()
    };
    list.unshift(newPromo);
    localStorage.setItem(STORAGE_PREFIX + 'promotions', JSON.stringify(list));
    return newPromo;
  }
}
