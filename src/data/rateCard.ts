export interface RepairService {
  name: string;
  hindiName: string;
  icon: string;
  basePrice: string;
  duration: string;
  warranty: string;
  description: string;
}

export const REPAIR_SERVICES: RepairService[] = [
  {
    name: 'Screen & Touch Display Replacement',
    hindiName: 'स्क्रीन और टच डिस्प्ले बदलना',
    icon: 'Smartphone',
    basePrice: '₹1,499 - ₹4,499',
    duration: '30 Mins',
    warranty: '6 Months',
    description: 'Cracked glass, touch not working, color lines, black spots or blank display.',
  },
  {
    name: 'Battery Replacement',
    hindiName: 'बैटरी बदलना',
    icon: 'BatteryCharging',
    basePrice: '₹899 - ₹1,899',
    duration: '25 Mins',
    warranty: '6 Months',
    description: 'Fast draining, sudden shutdown, swollen battery, or slow charging backup.',
  },
  {
    name: 'Charging Port / Jack Repair',
    hindiName: 'चार्जिंग पोर्ट ठीक करना',
    icon: 'Zap',
    basePrice: '₹599 - ₹999',
    duration: '20 Mins',
    warranty: '3 Months',
    description: 'Loose charging connector, cable not holding, or phone not charging at all.',
  },
  {
    name: 'Back Glass / Camera Lens',
    hindiName: 'कैमरा लेंस और बैक ग्लास',
    icon: 'Camera',
    basePrice: '₹499 - ₹1,299',
    duration: '35 Mins',
    warranty: '6 Months',
    description: 'Cracked rear camera glass lens or broken smartphone back panel.',
  },
  {
    name: 'Ear Speaker & Mic Repair',
    hindiName: 'स्पीकर और माइक रिपेयर',
    icon: 'Volume2',
    basePrice: '₹499 - ₹899',
    duration: '25 Mins',
    warranty: '3 Months',
    description: 'Low calling sound, other person cannot hear you, or cracked loudspeaker.',
  },
  {
    name: 'Water & Liquid Damage Treatment',
    hindiName: 'पानी या लिक्विड डैमेज इलाज',
    icon: 'Droplets',
    basePrice: '₹799 - ₹1,499',
    duration: '45 Mins',
    warranty: 'Service Warranty',
    description: 'Ultrasonic chemical motherboard drying, rust cleaning, and component rescue.',
  },
];

export const POPULAR_PHONES = [
  { brand: 'Apple', model: 'iPhone 15 / 15 Pro', popular: true },
  { brand: 'Apple', model: 'iPhone 14 / 13 / 12', popular: true },
  { brand: 'Samsung', model: 'Galaxy S24 / S23 Ultra', popular: true },
  { brand: 'Samsung', model: 'Galaxy M / A Series', popular: true },
  { brand: 'OnePlus', model: 'OnePlus 12 / 11 / 10R', popular: true },
  { brand: 'OnePlus', model: 'OnePlus Nord CE 3 / 4', popular: true },
  { brand: 'Xiaomi / Redmi', model: 'Redmi Note 13 / 12 Pro', popular: true },
  { brand: 'Vivo', model: 'Vivo V30 / V29 / T2x', popular: true },
  { brand: 'Realme', model: 'Realme 12 / Narzo 60', popular: true },
  { brand: 'Google', model: 'Pixel 8 / 7a', popular: true },
];
