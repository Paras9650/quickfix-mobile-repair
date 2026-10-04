import { BookingData, Technician, PaymentRecord, BookingStatus, RateCardItem, GpsSyncHeartbeat } from '../types';

export const INITIAL_RATE_CARD: RateCardItem[] = [
  // Apple
  {
    id: 'rc-apple-1',
    brand: 'Apple',
    model: 'iPhone 15 Pro / 15',
    serviceType: 'Display / Screen',
    costEstimate: '₹3,499 - ₹5,499',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-apple-2',
    brand: 'Apple',
    model: 'iPhone 15 Pro / 15',
    serviceType: 'Battery Replacement',
    costEstimate: '₹1,899 - ₹2,499',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-apple-3',
    brand: 'Apple',
    model: 'iPhone 15 Pro / 15',
    serviceType: 'Charging Port',
    costEstimate: '₹899 - ₹1,299',
    warranty: '3 Months',
    duration: '20 Mins',
  },
  {
    id: 'rc-apple-4',
    brand: 'Apple',
    model: 'iPhone 14 / 13 / 12',
    serviceType: 'Display / Screen',
    costEstimate: '₹2,499 - ₹3,899',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-apple-5',
    brand: 'Apple',
    model: 'iPhone 14 / 13 / 12',
    serviceType: 'Battery Replacement',
    costEstimate: '₹1,499 - ₹1,999',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-apple-6',
    brand: 'Apple',
    model: 'iPhone 14 / 13 / 12',
    serviceType: 'Charging Port',
    costEstimate: '₹799 - ₹1,199',
    warranty: '3 Months',
    duration: '20 Mins',
  },

  // Samsung
  {
    id: 'rc-samsung-1',
    brand: 'Samsung',
    model: 'Galaxy S24 / S23 Ultra',
    serviceType: 'Display / Screen',
    costEstimate: '₹3,299 - ₹4,999',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-samsung-2',
    brand: 'Samsung',
    model: 'Galaxy S24 / S23 Ultra',
    serviceType: 'Battery Replacement',
    costEstimate: '₹1,699 - ₹2,299',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-samsung-3',
    brand: 'Samsung',
    model: 'Galaxy S24 / S23 Ultra',
    serviceType: 'Charging Port',
    costEstimate: '₹799 - ₹1,199',
    warranty: '3 Months',
    duration: '20 Mins',
  },
  {
    id: 'rc-samsung-4',
    brand: 'Samsung',
    model: 'Galaxy A / M Series',
    serviceType: 'Display / Screen',
    costEstimate: '₹1,699 - ₹2,499',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-samsung-5',
    brand: 'Samsung',
    model: 'Galaxy A / M Series',
    serviceType: 'Battery Replacement',
    costEstimate: '₹999 - ₹1,499',
    warranty: '6 Months',
    duration: '25 Mins',
  },

  // OnePlus
  {
    id: 'rc-oneplus-1',
    brand: 'OnePlus',
    model: 'OnePlus 12 / 11 / 10R',
    serviceType: 'Display / Screen',
    costEstimate: '₹2,499 - ₹3,699',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-oneplus-2',
    brand: 'OnePlus',
    model: 'OnePlus 12 / 11 / 10R',
    serviceType: 'Battery Replacement',
    costEstimate: '₹1,299 - ₹1,799',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-oneplus-3',
    brand: 'OnePlus',
    model: 'OnePlus Nord Series',
    serviceType: 'Charging Port',
    costEstimate: '₹599 - ₹899',
    warranty: '3 Months',
    duration: '20 Mins',
  },

  // Xiaomi / Redmi
  {
    id: 'rc-xiaomi-1',
    brand: 'Xiaomi / Redmi',
    model: 'Redmi Note 13 / 12 Pro',
    serviceType: 'Display / Screen',
    costEstimate: '₹1,499 - ₹2,299',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-xiaomi-2',
    brand: 'Xiaomi / Redmi',
    model: 'Redmi Note 13 / 12 Pro',
    serviceType: 'Battery Replacement',
    costEstimate: '₹899 - ₹1,399',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-xiaomi-3',
    brand: 'Xiaomi / Redmi',
    model: 'Redmi Note 13 / 12 Pro',
    serviceType: 'Charging Port',
    costEstimate: '₹499 - ₹799',
    warranty: '3 Months',
    duration: '20 Mins',
  },

  // Vivo
  {
    id: 'rc-vivo-1',
    brand: 'Vivo',
    model: 'Vivo V30 / V29 Series',
    serviceType: 'Display / Screen',
    costEstimate: '₹1,799 - ₹2,599',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-vivo-2',
    brand: 'Vivo',
    model: 'Vivo V30 / V29 Series',
    serviceType: 'Battery Replacement',
    costEstimate: '₹1,099 - ₹1,599',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-vivo-3',
    brand: 'Vivo',
    model: 'Vivo V30 / V29 Series',
    serviceType: 'Charging Port',
    costEstimate: '₹599 - ₹899',
    warranty: '3 Months',
    duration: '20 Mins',
  },

  // Realme
  {
    id: 'rc-realme-1',
    brand: 'Realme',
    model: 'Realme 12 / Narzo 60',
    serviceType: 'Display / Screen',
    costEstimate: '₹1,599 - ₹2,399',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-realme-2',
    brand: 'Realme',
    model: 'Realme 12 / Narzo 60',
    serviceType: 'Battery Replacement',
    costEstimate: '₹899 - ₹1,399',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-realme-3',
    brand: 'Realme',
    model: 'Realme 12 / Narzo 60',
    serviceType: 'Charging Port',
    costEstimate: '₹499 - ₹799',
    warranty: '3 Months',
    duration: '20 Mins',
  },

  // Google Pixel
  {
    id: 'rc-pixel-1',
    brand: 'Google Pixel',
    model: 'Pixel 8 / 7a',
    serviceType: 'Display / Screen',
    costEstimate: '₹3,199 - ₹4,899',
    warranty: '6 Months',
    duration: '30 Mins',
  },
  {
    id: 'rc-pixel-2',
    brand: 'Google Pixel',
    model: 'Pixel 8 / 7a',
    serviceType: 'Battery Replacement',
    costEstimate: '₹1,499 - ₹2,099',
    warranty: '6 Months',
    duration: '25 Mins',
  },
  {
    id: 'rc-pixel-3',
    brand: 'Google Pixel',
    model: 'Pixel 8 / 7a',
    serviceType: 'Charging Port',
    costEstimate: '₹799 - ₹1,199',
    warranty: '3 Months',
    duration: '20 Mins',
  },
];

// Standard default technicians with coordinates on simulated city grid (0-100%)
export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'Rahul Kumar',
    phone: '+91 98234 56781',
    rating: 4.9,
    totalRepairs: 854,
    status: 'EnRoute',
    specialization: 'Display & Glass Master Specialist',
    coords: { x: 38, y: 42 },
    currentBookingId: 'QF-782914',
    speedKmH: 28,
  },
  {
    id: 'tech-2',
    name: 'Amit Sharma',
    phone: '+91 98765 12345',
    rating: 4.8,
    totalRepairs: 620,
    status: 'Available',
    specialization: 'Battery & Charging Logic Expert',
    coords: { x: 68, y: 62 },
    currentBookingId: null,
    speedKmH: 0,
  },
  {
    id: 'tech-3',
    name: 'Vikram Singh',
    phone: '+91 98111 22334',
    rating: 4.9,
    totalRepairs: 912,
    status: 'Repairing',
    specialization: 'Motherboard & Camera Engineer',
    coords: { x: 24, y: 28 },
    currentBookingId: 'QF-654812',
    speedKmH: 0,
  },
];

export const INITIAL_BOOKINGS: BookingData[] = [
  {
    bookingId: 'QF-782914',
    Brand: 'Apple',
    Model: 'iPhone 14 Pro',
    Issue: 'Display cracked / Touch unresponsive',
    CostEstimate: '₹2,500 - ₹3,800',
    Date: 'Today',
    Time: '02:00 PM - 04:00 PM',
    Address: 'Flat 402, Sunshine Heights, 12th Main Indiranagar, Bengaluru',
    Pincode: '560038',
    Landmark: 'Opposite Indiranagar Metro Station',
    AssignedTechnician: 'Rahul Kumar',
    technicianId: 'tech-1',
    customerName: 'Amit Verma',
    phone: '+91 98765 43210',
    warranty: '6 Months Doorstep Warranty',
    technicianPhone: '+91 98234 56781',
    technicianRating: 4.9,
    status: 'EnRoute',
    securityOtp: '4829',
    customerCoords: { x: 44, y: 48, label: 'Indiranagar' },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    paidAmount: '₹3,200',
  },
  {
    bookingId: 'QF-910243',
    Brand: 'Samsung',
    Model: 'Galaxy S23 Ultra',
    Issue: 'Battery draining fast & overheating',
    CostEstimate: '₹1,499 - ₹2,200',
    Date: 'Today',
    Time: '04:30 PM - 06:30 PM',
    Address: 'Villa 18, Palm Meadows, Sony World Signal, Koramangala',
    Pincode: '560034',
    Landmark: 'Near Sony Signal & Cult Gym',
    AssignedTechnician: 'Amit Sharma',
    technicianId: 'tech-2',
    customerName: 'Priya Sundaram',
    phone: '+91 98450 98765',
    warranty: '6 Months Doorstep Warranty',
    technicianPhone: '+91 98765 12345',
    technicianRating: 4.8,
    status: 'Pending',
    securityOtp: '7192',
    customerCoords: { x: 74, y: 68, label: 'Koramangala' },
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    bookingId: 'QF-654812',
    Brand: 'OnePlus',
    Model: 'OnePlus 11',
    Issue: 'Charging port loose / No charging indicator',
    CostEstimate: '₹799 - ₹1,199',
    Date: 'Today',
    Time: '11:00 AM - 01:00 PM',
    Address: 'Flat B-201, ITPL Residency, Whitefield',
    Pincode: '560066',
    Landmark: 'Opposite ITPL Main Gate',
    AssignedTechnician: 'Vikram Singh',
    technicianId: 'tech-3',
    customerName: 'Karthik Raja',
    phone: '+91 99001 23456',
    warranty: '3 Months Doorstep Warranty',
    technicianPhone: '+91 98111 22334',
    technicianRating: 4.9,
    status: 'Repairing',
    securityOtp: '3391',
    customerCoords: { x: 26, y: 30, label: 'Whitefield' },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    transactionId: 'TXN-984210',
    bookingId: 'QF-782914',
    amount: '₹3,200',
    method: 'UPI',
    upiApp: 'GooglePay',
    status: 'Completed',
    timestamp: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    customerName: 'Amit Verma',
  },
];

class MockDatabaseService {
  private bookings: BookingData[] = [...INITIAL_BOOKINGS];
  private technicians: Technician[] = [...INITIAL_TECHNICIANS];
  private payments: PaymentRecord[] = [...INITIAL_PAYMENTS];
  private rateCards: RateCardItem[] = [...INITIAL_RATE_CARD];
  private lastGpsHeartbeat: GpsSyncHeartbeat | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    // Attempt to load from sessionStorage/localStorage if available
    try {
      const savedBookings = localStorage.getItem('qf_mock_bookings');
      if (savedBookings) this.bookings = JSON.parse(savedBookings);
      const savedTechs = localStorage.getItem('qf_mock_technicians');
      if (savedTechs) this.technicians = JSON.parse(savedTechs);
      const savedPayments = localStorage.getItem('qf_mock_payments');
      if (savedPayments) this.payments = JSON.parse(savedPayments);
      const savedRateCards = localStorage.getItem('qf_mock_rate_cards');
      if (savedRateCards) this.rateCards = JSON.parse(savedRateCards);
    } catch (e) {
      console.warn('LocalStorage unavailable in mock DB:', e);
    }
  }

  private persist() {
    try {
      localStorage.setItem('qf_mock_bookings', JSON.stringify(this.bookings));
      localStorage.setItem('qf_mock_technicians', JSON.stringify(this.technicians));
      localStorage.setItem('qf_mock_payments', JSON.stringify(this.payments));
      localStorage.setItem('qf_mock_rate_cards', JSON.stringify(this.rateCards));
    } catch (e) {
      // Ignored
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- Bookings API ---
  public getBookings(): BookingData[] {
    return [...this.bookings];
  }

  public getBookingById(bookingId: string): BookingData | undefined {
    return this.bookings.find((b) => b.bookingId === bookingId);
  }

  public addBooking(newBooking: BookingData): BookingData {
    // If technician wasn't explicitly assigned, assign Rahul by default
    if (!newBooking.AssignedTechnician) {
      newBooking.AssignedTechnician = 'Rahul Kumar';
      newBooking.technicianId = 'tech-1';
    }
    if (!newBooking.securityOtp) {
      newBooking.securityOtp = String(Math.floor(1000 + Math.random() * 9000));
    }
    if (!newBooking.customerCoords) {
      // Generate randomized city coordinates near tech-1 or customer landmark
      newBooking.customerCoords = {
        x: Math.floor(40 + Math.random() * 25),
        y: Math.floor(45 + Math.random() * 25),
        label: newBooking.Landmark || 'Customer Home',
      };
    }
    newBooking.status = newBooking.status || 'Pending';
    newBooking.createdAt = newBooking.createdAt || new Date().toISOString();

    this.bookings.unshift(newBooking);
    this.persist();
    return newBooking;
  }

  public updateBookingStatus(bookingId: string, status: BookingStatus): void {
    const booking = this.bookings.find((b) => b.bookingId === bookingId);
    if (booking) {
      booking.status = status;

      // Update technician status accordingly
      if (booking.technicianId) {
        const tech = this.technicians.find((t) => t.id === booking.technicianId);
        if (tech) {
          if (status === 'EnRoute') tech.status = 'EnRoute';
          else if (status === 'Repairing') tech.status = 'Repairing';
          else if (status === 'Completed' || status === 'Paid') {
            tech.status = 'Available';
            tech.totalRepairs += 1;
          }
        }
      }

      this.persist();
    }
  }

  // --- Technicians API ---
  public getTechnicians(): Technician[] {
    return [...this.technicians];
  }

  public getTechnicianById(techId: string): Technician | undefined {
    return this.technicians.find((t) => t.id === techId);
  }

  public updateTechnicianCoords(techId: string, coords: { x: number; y: number }): void {
    const tech = this.technicians.find((t) => t.id === techId);
    if (tech) {
      tech.coords = {
        x: Math.max(5, Math.min(95, coords.x)),
        y: Math.max(5, Math.min(95, coords.y)),
      };
      this.persist();
    }
  }

  /**
   * Simulates background GPS movement of technician closer to the target customer location.
   */
  public moveTechnicianCloserToJob(techId: string, meters: number = 100): { x: number; y: number; distanceRemainingMeters: number } {
    const tech = this.technicians.find((t) => t.id === techId);
    if (!tech) return { x: 50, y: 50, distanceRemainingMeters: 0 };

    // Find the technician's assigned active job
    const activeBooking = this.bookings.find(
      (b) => (b.technicianId === techId || b.AssignedTechnician?.includes(tech.name.split(' ')[0])) &&
             b.status !== 'Completed' && b.status !== 'Paid'
    ) || this.bookings[0];

    const target = activeBooking?.customerCoords || { x: 50, y: 50 };

    // Move 10-15% of the distance closer towards target
    const dx = target.x - tech.coords.x;
    const dy = target.y - tech.coords.y;
    const distanceNorm = Math.sqrt(dx * dx + dy * dy);

    if (distanceNorm < 2) {
      // Arrived!
      tech.coords.x = target.x;
      tech.coords.y = target.y;
      if (activeBooking && activeBooking.status === 'EnRoute') {
        activeBooking.status = 'Repairing';
      }
      this.lastGpsHeartbeat = {
        timestamp: Date.now(),
        techId: tech.id,
        techName: tech.name,
        distanceDeltaMeters: 100,
        remainingDistanceMeters: 0,
        newCoords: { ...tech.coords },
      };
      this.persist();
      return { x: tech.coords.x, y: tech.coords.y, distanceRemainingMeters: 0 };
    }

    const stepSize = Math.min(3.5, distanceNorm * 0.35);
    const newX = tech.coords.x + (dx / distanceNorm) * stepSize;
    const newY = tech.coords.y + (dy / distanceNorm) * stepSize;

    tech.coords = {
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10,
    };
    tech.status = 'EnRoute';
    tech.speedKmH = Math.floor(22 + Math.random() * 15);

    const remainingMeters = Math.max(0, Math.round(distanceNorm * 45));
    this.lastGpsHeartbeat = {
      timestamp: Date.now(),
      techId: tech.id,
      techName: tech.name,
      distanceDeltaMeters: 100,
      remainingDistanceMeters: remainingMeters,
      newCoords: { ...tech.coords },
    };
    this.persist();

    return {
      x: tech.coords.x,
      y: tech.coords.y,
      distanceRemainingMeters: remainingMeters,
    };
  }

  public getLastGpsHeartbeat(): GpsSyncHeartbeat | null {
    return this.lastGpsHeartbeat;
  }

  // --- Payments API ---
  public getPayments(): PaymentRecord[] {
    return [...this.payments];
  }

  public recordPayment(payment: Omit<PaymentRecord, 'transactionId' | 'timestamp'>): PaymentRecord {
    const newPayment: PaymentRecord = {
      ...payment,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.payments.unshift(newPayment);

    // Update booking status to Paid
    const booking = this.bookings.find((b) => b.bookingId === payment.bookingId);
    if (booking) {
      booking.status = 'Paid';
      booking.paidAmount = payment.amount;
    }

    this.persist();
    return newPayment;
  }

  // --- Rate Card API ---
  public getRateCardItems(): RateCardItem[] {
    return [...this.rateCards];
  }

  public updateRateCardPrice(id: string, newCost: string): void {
    const item = this.rateCards.find((r) => r.id === id);
    if (item) {
      item.costEstimate = newCost.trim();
      this.persist();
    }
  }

  public addRateCardItem(item: Omit<RateCardItem, 'id'>): RateCardItem {
    const newItem: RateCardItem = {
      ...item,
      id: `rc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      warranty: item.warranty || '6 Months Doorstep Warranty',
      duration: item.duration || '30 Mins',
    };
    this.rateCards.unshift(newItem);
    this.persist();
    return newItem;
  }

  public deleteRateCardItem(id: string): void {
    this.rateCards = this.rateCards.filter((r) => r.id !== id);
    this.persist();
  }

  public resetToDefault() {
    this.bookings = [...INITIAL_BOOKINGS];
    this.technicians = [...INITIAL_TECHNICIANS];
    this.payments = [...INITIAL_PAYMENTS];
    this.rateCards = [...INITIAL_RATE_CARD];
    this.persist();
  }
}

export const mockDatabase = new MockDatabaseService();
