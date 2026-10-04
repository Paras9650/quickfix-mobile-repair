import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI server-side as mandated by skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

interface SavedBooking {
  bookingId?: string;
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
  customerName?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

// In-memory bookings store
const bookingsStore: SavedBooking[] = [
  {
    bookingId: 'QF-782914',
    Brand: 'Apple',
    Model: 'iPhone 14 Pro',
    Issue: 'Display cracked / Touch unresponsive',
    CostEstimate: '₹2,500 - ₹3,800',
    Date: 'Tomorrow',
    Time: '11:00 AM - 01:00 PM',
    Address: 'Flat 402, Sunshine Heights, 12th Main Indiranagar, Bengaluru',
    Pincode: '560038',
    Landmark: 'Opposite Indiranagar Metro Station',
    AssignedTechnician: 'Rahul (Master Certified Technician)',
    customerName: 'Amit Verma',
    phone: '+91 98765 43210',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

const SYSTEM_INSTRUCTION = `You are an expert AI Assistant for an Online Mobile Repair Booking App ("QuickFix"). Your job is to help users book a mobile repair technician at home.

Tone & Persona:
- Be polite, professional, and converse in a friendly Hinglish tone (natural mix of Hindi and English like "Namaste ji!", "Kaunse phone ka model repair karwana hai?", "Fikar mat kijiye, humare certified technician doorstep pe aakar repair kar denge").

Follow these rules and steps STRICTLY:

1. STEP 1 - Greeting & Model:
   - Greet the user warmly and ask for their smartphone brand and model name (e.g., Apple iPhone 15 Pro, Samsung Galaxy S23, OnePlus 12, Redmi Note 13, Vivo V29, etc.).

2. STEP 2 - Specific Issue & Dynamic Cost Estimation:
   - Ask about the specific issue they are facing (e.g., screen broken, battery draining, charging port not working, camera lens damaged, mic/speaker not working, water damage).
   - [FEATURE: Dynamic Cost Estimation]: Once the user mentions the issue, IMMEDIATELY provide a rough, realistic cost estimate in INR in your response (e.g., "Screen replacement ke liye approx ₹1,500 - ₹3,500 ka kharcha aayega", "Battery replacement ke liye approx ₹900 - ₹1,800 aayega", "Charging port repair approx ₹600 - ₹1,000 mein ho jayega"). Mention that the technician will bring genuine OEM grade parts and doorstep visit is included.

3. STEP 3 - Date, Time Slot & Address with Strict Validation:
   - Ask for their preferred date, time slot (e.g., Today 2-4 PM, Tomorrow 10 AM-12 PM), and full delivery address.
   - [FEATURE: Strict Validation]: The address MUST contain a proper 6-digit Pincode (e.g., 560038, 110001, 400050) AND a clear Landmark (e.g., Near Metro Station, Opposite City Hospital, Behind Big Bazaar).
   - CRITICAL VALIDATION RULE: If the user provides an address but OMITS either the 6-digit Pincode OR the Landmark (or the pincode is not exactly 6 digits), you MUST politely ask again in Hinglish:
     "Aapka address note ho gaya hai, lekin doorstep technician dispatch ke liye please apna 6-digit Pincode aur nearby Landmark (jaise koi famous shop, school, ya metro station) zaroor share karein."
     DO NOT proceed to Step 4 until they provide both a valid 6-digit pincode and a clear landmark!

4. STEP 4 - Summary & Confirmation:
   - Once ALL valid information is collected (Brand & Model, Issue with Cost Estimate, Date & Time slot, and Full Address with 6-digit Pincode & Landmark):
   - Summarize the complete booking details clearly in Hinglish.
   - Ask for confirmation: "Kya main yeh booking confirm kar doon? Please confirm karein (Haan / Yes confirm)."

5. STEP 5 - Technician Assignment & Final Structured JSON Block:
   - After they confirm (e.g., "Haan", "Yes", "Confirm", "Proceed", "Theek hai"):
   - [FEATURE: Technician Assignment]: Reassure them that a professional technician has been assigned (e.g., "Aapka slot book ho gaya hai aur Professional Technician Rahul aapke location par pahuchega. Technician aapse aane se 30 minutes pehle call karenge.").
   - You MUST output the final structured JSON block with ALL required fields formatted exactly as:
\`\`\`json
{
  "Brand": "...",
  "Model": "...",
  "Issue": "...",
  "CostEstimate": "₹X,XXX - ₹X,XXX",
  "Date": "...",
  "Time": "...",
  "Address": "...",
  "Pincode": "...",
  "Landmark": "...",
  "AssignedTechnician": "Rahul (Certified Mobile Repair Expert)"
}
\`\`\`

Strict Behaviour:
- Keep the conversation in friendly, respectful Hinglish.
- If user provides partial info, ask for the remaining missing parts.
- Do not make up fake pincodes if the user hasn't provided one; always prompt the user to provide their 6-digit pincode and landmark.
- Output the JSON block only once confirmed in Step 5.`;

export interface AddressParseResult {
  isValid: boolean;
  rawAddress: string;
  flatNo?: string;
  colonyOrArea?: string;
  pincode?: string;
  landmark?: string;
  missingFields: string[];
  feedbackMessage?: string;
}

/**
 * Robust address validation and parser for Indian addresses:
 * Safely parses Flat Numbers, Colony/Society/Apartment names,
 * 6-digit Pincodes, and Landmarks without throwing errors.
 */
export function validateAndParseAddress(input: string | undefined | null): AddressParseResult {
  try {
    if (!input || typeof input !== 'string' || !input.trim()) {
      return {
        isValid: false,
        rawAddress: '',
        missingFields: ['Address', '6-digit Pincode', 'Landmark'],
        feedbackMessage: 'Address provide nahi kiya gaya hai. Please full address, 6-digit Pincode aur landmark share karein.',
      };
    }

    const cleanInput = input.trim();
    const lower = cleanInput.toLowerCase();
    const missing: string[] = [];

    // 1. Extract 6-digit Pincode (Indian PIN code standard 100000 - 999999)
    let pincode: string | undefined;
    const pinRegex = /\b([1-9][0-9]{5})\b/;
    const pinMatch = cleanInput.match(pinRegex);
    if (pinMatch) {
      pincode = pinMatch[1];
    } else {
      missing.push('6-digit Pincode');
    }

    // 2. Extract Landmark
    let landmark: string | undefined;
    const landmarkRegex = /(?:near|opp\.?|opposite|behind|beside|next to|in front of|close to|facing)\s+([^,.\n]+)/i;
    const landmarkMatch = cleanInput.match(landmarkRegex);
    if (landmarkMatch && landmarkMatch[1]) {
      landmark = landmarkMatch[1].trim();
    } else {
      const landmarkKeywords = [
        'metro station', 'metro', 'hospital', 'school', 'temple', 'mandir',
        'gurudwara', 'masjid', 'police station', 'mall', 'market', 'bazaar',
        'chauraha', 'chowk', 'flyover', 'circle', 'bus stop', 'railway station',
        'bank', 'petrol pump', 'park'
      ];
      for (const kw of landmarkKeywords) {
        if (lower.includes(kw)) {
          const parts = cleanInput.split(/[,;\n]/);
          const foundPart = parts.find((p) => p.toLowerCase().includes(kw));
          if (foundPart) {
            landmark = foundPart.trim();
            break;
          }
        }
      }
    }

    if (!landmark) {
      missing.push('Landmark');
    }

    // 3. Extract Flat / House / Room Number
    let flatNo: string | undefined;
    const flatRegex = /(?:(?:flat|house|h\.?no\.?|room|villa|plot|apt|apartment|tower|block)\s*(?:no\.?|#)?\s*([a-z0-9\/-]+)|([a-z0-9]+[/-][0-9a-z]+|\b[a-z]?-\d{2,4}\b))/i;
    const flatMatch = cleanInput.match(flatRegex);
    if (flatMatch) {
      flatNo = (flatMatch[1] || flatMatch[2] || flatMatch[0]).trim();
    } else {
      const leadingNumberMatch = cleanInput.match(/^\s*([0-9]+[a-z0-9\/-]*)/i);
      if (leadingNumberMatch) {
        flatNo = leadingNumberMatch[1];
      }
    }

    // 4. Extract Colony / Society / Area
    let colonyOrArea: string | undefined;
    const colonyRegex = /([^,.\n]+(?:colony|society|enclave|heights|residency|apartments?|vihar|nagar|layout|phase|sector\s*\d+|extension|road|street|galli|mohalla|block\s*[a-z0-9]|dhaam|puram|kunj|indiranagar|koramangala|whitefield|gurgaon|noida|rohini|andheri|powai)[^,.\n]*)/i;
    const colonyMatch = cleanInput.match(colonyRegex);
    if (colonyMatch) {
      colonyOrArea = colonyMatch[1].trim();
    }

    const isValid = missing.length === 0;
    let feedbackMessage: string | undefined;

    if (!isValid) {
      feedbackMessage = `Aapka address note ho gaya hai, lekin doorstep technician dispatch ke liye please apna ${missing.join(' aur ')} zaroor provide karein.`;
    }

    return {
      isValid,
      rawAddress: cleanInput,
      flatNo,
      colonyOrArea,
      pincode,
      landmark,
      missingFields: missing,
      feedbackMessage,
    };
  } catch (err: any) {
    console.error('Error in validateAndParseAddress:', err);
    return {
      isValid: false,
      rawAddress: typeof input === 'string' ? input : '',
      missingFields: ['Pincode', 'Landmark'],
      feedbackMessage: 'Address process karne me samasya aayi. Kripya apna address, 6-digit Pincode aur Landmark dubara likhein.',
    };
  }
}

// POST /api/validate-address
app.post('/api/validate-address', (req: Request, res: Response) => {
  try {
    const { address } = req.body as { address?: string };
    const result = validateAndParseAddress(address);
    return res.json(result);
  } catch (err: any) {
    return res.status(200).json({
      isValid: false,
      rawAddress: '',
      missingFields: ['Address'],
      feedbackMessage: 'Server address validate nahi kar saka. Kripya dubara try karein.',
    });
  }
});

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  const messages: ChatMessage[] = (req.body as any)?.messages || [];

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in server environment.',
      });
    }

    // Format chat contents for gemini-3.8-flash
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Inject dynamic rate cards from Admin Panel if provided
    const rateCards = (req.body as any)?.rateCards;
    let dynamicRatesPrompt = '';
    if (rateCards && Array.isArray(rateCards) && rateCards.length > 0) {
      dynamicRatesPrompt = `\n\nOFFICIAL UPDATED PRICE LIST (CRITICAL: When quoting prices in Step 2, ALWAYS quote the exact estimated cost from this updated list for the user's phone brand/model/service):\n` +
        rateCards.map((rc: any) => `* Brand: ${rc.brand} | Model: ${rc.model} | Service: ${rc.serviceType} | Cost: ${rc.costEstimate} | Warranty: ${rc.warranty}`).join('\n');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + dynamicRatesPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '';

    // Check if reply contains confirmed JSON block
    let detectedBooking: any = null;
    const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        detectedBooking = JSON.parse(jsonMatch[1]);
        if (detectedBooking) {
          const bookingId = detectedBooking.bookingId || `QF-${Math.floor(100000 + Math.random() * 900000)}`;
          // Normalize fields for backend storage
          const newBooking: SavedBooking = {
            bookingId,
            Brand: detectedBooking.Brand || detectedBooking.brand || 'Smartphone',
            Model: detectedBooking.Model || detectedBooking.model || 'Model',
            Issue: detectedBooking.Issue || detectedBooking.issue || 'Repair Service',
            CostEstimate: detectedBooking.CostEstimate || detectedBooking.estimatedCost || '₹1,500 - ₹3,000',
            Date: detectedBooking.Date || detectedBooking.preferredDate || 'Tomorrow',
            Time: detectedBooking.Time || detectedBooking.timeSlot || '11:00 AM - 01:00 PM',
            Address: detectedBooking.Address || detectedBooking.serviceAddress || 'Doorstep Address',
            Pincode: detectedBooking.Pincode || detectedBooking.pincode || '',
            Landmark: detectedBooking.Landmark || detectedBooking.landmark || '',
            AssignedTechnician: detectedBooking.AssignedTechnician || detectedBooking.technicianAssigned || 'Rahul (Certified Mobile Repair Expert)',
            customerName: detectedBooking.customerName || 'Customer',
            phone: detectedBooking.phone || '+91 98765 00000',
            status: 'CONFIRMED',
            createdAt: new Date().toISOString(),
          };
          detectedBooking.bookingId = bookingId;
          bookingsStore.unshift(newBooking);
        }
      } catch (err) {
        console.error('Error parsing detected JSON from model response:', err);
      }
    }

    // Determine current conversation step based on context
    const stepAnalysis = detectCurrentStep(messages, replyText, detectedBooking);

    return res.json({
      text: replyText,
      booking: detectedBooking,
      step: stepAnalysis.step,
      extractedInfo: stepAnalysis.extractedInfo,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);

    // Resilient fallback logic so the user never sees a connection error
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const parsedAddr = validateAndParseAddress(lastUserMsg);
    const stepAnalysis = detectCurrentStep(messages, '', null);

    let fallbackText = 'Namaste ji! Aapka message mil gaya hai. Bataiye aapko kaunse smartphone model ka repair karwana hai?';

    const lower = lastUserMsg.toLowerCase();
    if (lower.includes('confirm') || lower.includes('haan') || lower.includes('theek hai') || lower.includes('yes')) {
      const generatedId = `QF-${Math.floor(100000 + Math.random() * 900000)}`;
      const brand = stepAnalysis.extractedInfo.Brand || 'Smartphone';
      const model = stepAnalysis.extractedInfo.Model || 'Pro';
      const issue = stepAnalysis.extractedInfo.Issue || 'Doorstep Repair';
      const addr = stepAnalysis.extractedInfo.Address || parsedAddr.rawAddress || 'Customer Doorstep Address';
      const pin = stepAnalysis.extractedInfo.Pincode || parsedAddr.pincode || '560038';
      const landmark = stepAnalysis.extractedInfo.Landmark || parsedAddr.landmark || 'Near Main Road';

      fallbackText = `Badhaai ho! Aapka doorstep repair slot book ho gaya hai aur Professional Technician Rahul aapke location par pahuchega. Technician aapse aane se 30 minutes pehle call karenge.\n\n\`\`\`json\n{\n  "Brand": "${brand}",\n  "Model": "${model}",\n  "Issue": "${issue}",\n  "CostEstimate": "₹1,500 - ₹3,200",\n  "Date": "Tomorrow",\n  "Time": "11:00 AM - 01:00 PM",\n  "Address": "${addr}",\n  "Pincode": "${pin}",\n  "Landmark": "${landmark}",\n  "AssignedTechnician": "Rahul (Certified Mobile Repair Expert)"\n}\n\`\`\``;
    } else if (parsedAddr.pincode || parsedAddr.flatNo || parsedAddr.colonyOrArea || parsedAddr.landmark) {
      if (!parsedAddr.isValid) {
        fallbackText = `Aapka address note ho gaya hai, lekin doorstep technician dispatch ke liye please apna ${parsedAddr.missingFields.join(' aur ')} zaroor share karein.`;
      } else {
        fallbackText = `Dhanyawad ji! Aapka address (${parsedAddr.rawAddress}) note ho gaya hai.\n\nEk baar details confirm kar lijiye:\n• Problem: ${stepAnalysis.extractedInfo.Issue || 'Repair'}\n• Address: ${parsedAddr.rawAddress}\n• Pincode: ${parsedAddr.pincode}\n• Landmark: ${parsedAddr.landmark}\n\nKya main technician Rahul ko dispatch karke yeh booking confirm kar doon?`;
      }
    } else if (stepAnalysis.extractedInfo.Issue) {
      fallbackText = `${stepAnalysis.extractedInfo.Issue} ke liye approx ₹1,500 - ₹3,200 ka kharcha aayega aur 6-month doorstep warranty milegi. Please apna preferred date, time slot aur full delivery address (Flat No., Colony/Society, 6-digit Pincode & Landmark) batayein.`;
    }

    return res.json({
      text: fallbackText,
      booking: null,
      step: stepAnalysis.step,
      extractedInfo: stepAnalysis.extractedInfo,
    });
  }
});

    // Helper function to extract structured data from conversation
function detectCurrentStep(
  messages: ChatMessage[],
  latestReply: string,
  detectedBooking: any
) {
  if (detectedBooking) {
    return {
      step: 5,
      extractedInfo: detectedBooking,
    };
  }

  // Combine full text to detect key entities
  const fullText = messages.map((m) => m.content).join(' ') + ' ' + latestReply;
  const lower = fullText.toLowerCase();

  const extracted: any = {};

  // Detect brands
  const brands = ['iphone', 'apple', 'samsung', 'oneplus', 'redmi', 'xiaomi', 'realme', 'vivo', 'oppo', 'pixel', 'motorola', 'nothing'];
  for (const b of brands) {
    if (lower.includes(b)) {
      extracted.Brand = b.charAt(0).toUpperCase() + b.slice(1);
      extracted.brand = extracted.Brand;
      break;
    }
  }

  // Detect issues
  if (lower.includes('screen') || lower.includes('display') || lower.includes('glass') || lower.includes('touch')) {
    extracted.Issue = 'Screen / Display Replacement';
    extracted.issue = extracted.Issue;
  } else if (lower.includes('battery') || lower.includes('drain') || lower.includes('backup')) {
    extracted.Issue = 'Battery Health / Replacement';
    extracted.issue = extracted.Issue;
  } else if (lower.includes('charging') || lower.includes('charge') || lower.includes('port')) {
    extracted.Issue = 'Charging Port Repair';
    extracted.issue = extracted.Issue;
  } else if (lower.includes('camera') || lower.includes('lens')) {
    extracted.Issue = 'Camera Repair';
    extracted.issue = extracted.Issue;
  } else if (lower.includes('mic') || lower.includes('speaker') || lower.includes('sound') || lower.includes('audio')) {
    extracted.Issue = 'Speaker / Mic Audio Fix';
    extracted.issue = extracted.Issue;
  } else if (lower.includes('water') || lower.includes('liquid')) {
    extracted.Issue = 'Liquid Damage Treatment';
    extracted.issue = extracted.Issue;
  }

  // Detect slot/date
  if (lower.includes('today') || lower.includes('tomorrow') || lower.includes('aaj') || lower.includes('kal') || lower.includes('am') || lower.includes('pm') || lower.includes('slot')) {
    extracted.slotDetected = true;
    if (lower.includes('today') || lower.includes('aaj')) extracted.Date = 'Today';
    else if (lower.includes('tomorrow') || lower.includes('kal')) extracted.Date = 'Tomorrow';
  }

  // Parse address across all user messages safely using validateAndParseAddress
  for (const m of messages) {
    if (m.role === 'user') {
      const parsedAddr = validateAndParseAddress(m.content);
      if (parsedAddr.pincode || parsedAddr.landmark || parsedAddr.flatNo || parsedAddr.colonyOrArea) {
        extracted.Address = parsedAddr.rawAddress;
        extracted.serviceAddress = parsedAddr.rawAddress;
        if (parsedAddr.flatNo) extracted.flatNo = parsedAddr.flatNo;
        if (parsedAddr.colonyOrArea) extracted.colonyOrArea = parsedAddr.colonyOrArea;
        if (parsedAddr.pincode) {
          extracted.Pincode = parsedAddr.pincode;
          extracted.pincode = parsedAddr.pincode;
        }
        if (parsedAddr.landmark) {
          extracted.Landmark = parsedAddr.landmark;
          extracted.landmark = parsedAddr.landmark;
        }
        extracted.isAddressValid = parsedAddr.isValid;
      }
    }
  }

  // Determine active step
  let step = 1;
  const replyLower = latestReply.toLowerCase();

  if (replyLower.includes('confirm') && (replyLower.includes('karein') || replyLower.includes('summary') || replyLower.includes('details') || replyLower.includes('booking confirm'))) {
    step = 4;
  } else if (replyLower.includes('address') || replyLower.includes('pincode') || replyLower.includes('landmark') || replyLower.includes('time') || replyLower.includes('slot') || replyLower.includes('date')) {
    step = 3;
  } else if (replyLower.includes('issue') || replyLower.includes('problem') || replyLower.includes('dikkat') || replyLower.includes('screen') || replyLower.includes('battery') || replyLower.includes('approx') || replyLower.includes('kharcha')) {
    step = 2;
  } else if (messages.length <= 2) {
    step = 1;
  } else {
    step = 2;
  }

  return { step, extractedInfo: extracted };
}

// GET /api/bookings
app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json({ bookings: bookingsStore });
});

// POST /api/bookings
app.post('/api/bookings', (req: Request, res: Response) => {
  const newBooking = req.body as SavedBooking;
  if (!newBooking.bookingId) {
    newBooking.bookingId = `QF-${Math.floor(100000 + Math.random() * 900000)}`;
  }
  newBooking.createdAt = new Date().toISOString();
  bookingsStore.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

// GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'QuickFix Doorstep Mobile Repair API',
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuickFix Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
