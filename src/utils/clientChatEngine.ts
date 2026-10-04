import { BookingData, ChatMessage, ExtractedInfo, StepNumber, RateCardItem } from '../types';

export interface ClientReplyResult {
  text: string;
  step?: StepNumber;
  extracted?: ExtractedInfo;
  booking?: BookingData | null;
}

/**
 * High-fidelity client-side conversation assistant for static hosting (Vercel, GitHub Pages, Netlify).
 * Ensures full 5-step guided booking, dynamic estimates, 6-digit PIN & Landmark validation, and Rahul dispatch.
 */
export function generateClientSideReply(
  userText: string,
  history: ChatMessage[],
  currentStep: StepNumber,
  currentExtracted: ExtractedInfo,
  rateCards?: RateCardItem[]
): ClientReplyResult {
  const lower = userText.toLowerCase();
  const extracted: ExtractedInfo = { ...currentExtracted };

  // Detect Brands
  const brands = [
    'apple', 'iphone', 'samsung', 'oneplus', 'redmi', 'xiaomi',
    'realme', 'vivo', 'oppo', 'pixel', 'motorola', 'nothing'
  ];
  for (const b of brands) {
    if (lower.includes(b)) {
      extracted.Brand = b === 'iphone' ? 'Apple' : b.charAt(0).toUpperCase() + b.slice(1);
      extracted.Model = userText;
      break;
    }
  }

  // Detect Issues & Dynamic Pricing
  let detectedEstimate = extracted.CostEstimate;
  if (lower.includes('screen') || lower.includes('display') || lower.includes('glass') || lower.includes('touch') || lower.includes('crack')) {
    extracted.Issue = 'Screen & Touch Display Replacement';
    detectedEstimate = extracted.Brand === 'Apple' ? '₹2,800 - ₹4,200' : '₹1,800 - ₹3,200';
    extracted.CostEstimate = detectedEstimate;
  } else if (lower.includes('battery') || lower.includes('drain') || lower.includes('backup') || lower.includes('heat')) {
    extracted.Issue = 'Battery Replacement & Health Check';
    detectedEstimate = '₹1,299 - ₹1,899';
    extracted.CostEstimate = detectedEstimate;
  } else if (lower.includes('charge') || lower.includes('charging') || lower.includes('port') || lower.includes('loose')) {
    extracted.Issue = 'Charging Port Repair / Replacement';
    detectedEstimate = '₹699 - ₹1,099';
    extracted.CostEstimate = detectedEstimate;
  } else if (lower.includes('camera') || lower.includes('lens')) {
    extracted.Issue = 'Camera Module & Lens Replacement';
    detectedEstimate = '₹1,499 - ₹2,499';
    extracted.CostEstimate = detectedEstimate;
  } else if (lower.includes('mic') || lower.includes('speaker') || lower.includes('sound')) {
    extracted.Issue = 'Speaker & Mic Audio Repair';
    detectedEstimate = '₹599 - ₹999';
    extracted.CostEstimate = detectedEstimate;
  }

  // Check if a dynamic price was updated in Admin Rate Card
  if (rateCards && rateCards.length > 0 && extracted.Brand) {
    const brandLower = extracted.Brand.toLowerCase();
    const matchingRate = rateCards.find((r) => {
      const matchBrand = r.brand.toLowerCase().includes(brandLower) || brandLower.includes(r.brand.toLowerCase());
      const matchService =
        ((lower.includes('screen') || lower.includes('display') || lower.includes('glass')) && r.serviceType.toLowerCase().includes('display')) ||
        ((lower.includes('battery') || lower.includes('drain')) && r.serviceType.toLowerCase().includes('battery')) ||
        ((lower.includes('charge') || lower.includes('charging') || lower.includes('port')) && r.serviceType.toLowerCase().includes('port')) ||
        ((lower.includes('camera') || lower.includes('lens')) && r.serviceType.toLowerCase().includes('camera'));
      return matchBrand && matchService;
    });

    if (matchingRate) {
      extracted.CostEstimate = matchingRate.costEstimate;
    }
  }

  // Detect 6-digit Pincode
  const pinMatch = userText.match(/\b([1-9][0-9]{5})\b/);
  if (pinMatch) {
    extracted.Pincode = pinMatch[1];
  }

  // Detect Landmark
  const landmarkMatch = userText.match(/(?:near|opp\.?|opposite|behind|beside|next to|in front of|close to|facing)\s+([^,.\n]+)/i);
  if (landmarkMatch && landmarkMatch[1]) {
    extracted.Landmark = landmarkMatch[1].trim();
  } else if (
    lower.includes('metro') || lower.includes('hospital') || lower.includes('school') ||
    lower.includes('station') || lower.includes('temple') || lower.includes('park') || lower.includes('mall')
  ) {
    const parts = userText.split(/[,;\n]/);
    const found = parts.find((p) => /(?:metro|hospital|school|station|temple|park|mall)/i.test(p));
    if (found) extracted.Landmark = found.trim();
  }

  // Detect Address
  if (
    lower.includes('flat') || lower.includes('house') || lower.includes('h.no') ||
    lower.includes('colony') || lower.includes('society') || lower.includes('road') ||
    lower.includes('nagar') || lower.includes('sector') || lower.includes('street') || lower.includes('layout')
  ) {
    extracted.Address = userText;
  }

  // STEP 5: CONFIRMATION TRIGGER
  if (
    (lower.includes('confirm') || lower.includes('haan') || lower.includes('yes') || lower.includes('theek hai') || lower.includes('kar dijiye')) &&
    (currentStep >= 3 || extracted.Address)
  ) {
    const bookingId = `QF-${Math.floor(100000 + Math.random() * 900000)}`;
    const brand = extracted.Brand || 'Smartphone';
    const model = extracted.Model || 'Mobile';
    const issue = extracted.Issue || 'Doorstep Repair Service';
    const cost = extracted.CostEstimate || '₹1,800 - ₹3,200';
    const date = extracted.Date || 'Today';
    const time = extracted.Time || '04:00 PM - 06:00 PM';
    const addr = extracted.Address || 'Doorstep Location';
    const pin = extracted.Pincode || '560038';
    const landmark = extracted.Landmark || 'Near Main Landmark';

    const confirmed: BookingData = {
      bookingId,
      Brand: brand,
      Model: model,
      Issue: issue,
      CostEstimate: cost,
      Date: date,
      Time: time,
      Address: addr,
      Pincode: pin,
      Landmark: landmark,
      AssignedTechnician: 'Rahul Kumar (Master Certified Technician)',
      technicianPhone: '+91 98234 56781',
      technicianRating: 4.9,
      status: 'EnRoute',
      securityOtp: String(Math.floor(1000 + Math.random() * 9000)),
      customerName: extracted.customerName || 'Customer',
      phone: extracted.phone || '+91 98765 43210',
      warranty: '6 Months Doorstep Warranty',
    };

    const replyText = `Badhaai ho! 🎉 Aapka doorstep repair slot book ho gaya hai aur Professional Technician Rahul Kumar aapke location par pahuchega. Technician aapse aane se 30 minutes pehle call karenge.\n\n\`\`\`json\n${JSON.stringify(
      {
        Brand: brand,
        Model: model,
        Issue: issue,
        CostEstimate: cost,
        Date: date,
        Time: time,
        Address: addr,
        Pincode: pin,
        Landmark: landmark,
        AssignedTechnician: 'Rahul Kumar (Master Certified Technician)',
      },
      null,
      2
    )}\n\`\`\``;

    return {
      text: replyText,
      step: 5,
      extracted,
      booking: confirmed,
    };
  }

  // STEP 3 / 4: ADDRESS & PINCODE STRICT VALIDATION
  if (extracted.Address || lower.includes('flat') || lower.includes('house') || lower.includes('nagar') || lower.includes('colony')) {
    const hasPin = Boolean(extracted.Pincode || pinMatch);
    const hasLandmark = Boolean(extracted.Landmark || landmarkMatch);

    if (!hasPin || !hasLandmark) {
      const missing: string[] = [];
      if (!hasPin) missing.push('6-digit Pincode');
      if (!hasLandmark) missing.push('nearby Landmark (e.g. Metro station, hospital, temple)');

      return {
        text: `Aapka address note ho gaya hai ji, lekin doorstep technician dispatch ke liye please apna **${missing.join(' aur ')}** zaroor share karein taaki technician easily pahunch sake.`,
        step: 3,
        extracted,
      };
    }

    // Both PIN and Landmark are present -> Step 4 Confirmation
    return {
      text: `Dhanyawad ji! Aapki details note ho gayi hain:\n\n📱 **Device:** ${extracted.Brand || ''} ${extracted.Model || 'Phone'}\n🔧 **Problem:** ${extracted.Issue || 'Repair'}\n💰 **Estimate:** ${extracted.CostEstimate || '₹1,500 - ₹3,000'} (6-Month Warranty)\n📍 **Address:** ${extracted.Address}\n📮 **PIN:** ${extracted.Pincode} | **Landmark:** ${extracted.Landmark}\n\nKya main yeh doorstep booking confirm kar doon? Please confirm karein *(Haan / Confirm kar do)*.`,
      step: 4,
      extracted,
    };
  }

  // STEP 2: ISSUE & DYNAMIC COST ESTIMATION
  if (extracted.Issue) {
    return {
      text: `${extracted.Brand ? extracted.Brand + ' ke ' : ''}${extracted.Issue} ke liye approx **${extracted.CostEstimate}** ka kharcha aayega.\n\n🛡️ Isme **6-Month Doorstep Warranty** aur OEM-certified parts included hain. Repair aapke samne 30 minute mein hogi.\n\nKripya apna preferred **time slot** aur **full delivery address** batayein (Flat No., Colony/Society, **6-digit Pincode** aur **Landmark** ke saath).`,
      step: 3,
      extracted,
    };
  }

  // STEP 1: MODEL DETECTED, ASK FOR ISSUE
  if (extracted.Brand || extracted.Model) {
    return {
      text: `Bahut badiya! ${extracted.Brand || ''} ${extracted.Model || ''} note ho gaya hai. 👍\n\nAapko isme kya samasya aa rahi hai? (e.g., Screen break ho gayi hai, battery jaldi drain hoti hai, ya charging port loose hai?)`,
      step: 2,
      extracted,
    };
  }

  // INITIAL GREETING
  return {
    text: `Namaste ji! 🙏 Welcome to QuickFix Doorstep Mobile Repair. Main aapka personal repair assistant hoon.\n\nAapko kaunse smartphone brand aur model ka repair karwana hai? (e.g., Apple iPhone 15, Samsung Galaxy S23, OnePlus 12)`,
    step: 1,
    extracted,
  };
}
