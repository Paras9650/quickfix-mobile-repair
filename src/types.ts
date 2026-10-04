export type BookingStatus = 'Pending' | 'EnRoute' | 'Repairing' | 'Completed' | 'Paid';

export interface BookingData {
  bookingId: string;
  Brand: string;
  Model: string;
  Issue: string;
  CostEstimate: string;
  Date: string;
  Time: string;
  Address: string;
  Pincode: string;
  Landmark: string;
  AssignedTechnician: string;
  technicianId?: string;
  customerName?: string;
  phone?: string;
  warranty?: string;
  technicianPhone?: string;
  technicianRating?: number;
  status: BookingStatus;
  securityOtp?: string;
  customerCoords?: { x: number; y: number; label: string };
  createdAt?: string;
  paidAmount?: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalRepairs: number;
  status: 'Available' | 'EnRoute' | 'Repairing' | 'Offline';
  specialization: string;
  coords: { x: number; y: number }; // Percentage on SVG city map (0-100)
  currentBookingId?: string | null;
  speedKmH?: number;
}

export interface PaymentRecord {
  transactionId: string;
  bookingId: string;
  amount: string;
  method: 'UPI' | 'Cash' | 'Card';
  upiApp?: 'GooglePay' | 'PhonePe' | 'Paytm';
  status: 'Pending' | 'Completed' | 'Refunded';
  timestamp: string;
  customerName: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  bookingData?: BookingData;
  isStreaming?: boolean;
}

export type StepNumber = 1 | 2 | 3 | 4 | 5;

export interface ExtractedInfo {
  Brand?: string;
  Model?: string;
  Issue?: string;
  CostEstimate?: string;
  Date?: string;
  Time?: string;
  Address?: string;
  Pincode?: string;
  Landmark?: string;
  customerName?: string;
  phone?: string;
  flatNo?: string;
  colonyOrArea?: string;
  isAddressValid?: boolean;
}

export type AppViewMode = 'customer' | 'technician' | 'admin';

export interface RateCardItem {
  id: string;
  brand: string;
  model: string;
  serviceType: string;
  costEstimate: string;
  warranty: string;
  duration: string;
}

export interface GpsSyncHeartbeat {
  timestamp: number;
  techId: string;
  techName: string;
  distanceDeltaMeters: number;
  remainingDistanceMeters: number;
  newCoords: { x: number; y: number };
}

