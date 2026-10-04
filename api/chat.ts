import { GoogleGenAI } from '@google/genai';

interface VercelRequest {
  method?: string;
  body?: any;
  query?: any;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: any) => void;
  send: (body: any) => void;
}

const SYSTEM_INSTRUCTION = `You are "QuickFix Sahayak", a polite, friendly, and professional AI repair assistant for "QuickFix Doorstep Mobile Repair" in India.
Your mission is to guide the customer step-by-step through a 5-step doorstep repair booking.
Communicate primarily in natural, conversational Hinglish (a polite blend of Hindi and English written in Latin script, e.g., "Namaste ji! Welcome to QuickFix. Aapko kaunse smartphone model ka repair karwana hai?").

STRICT 5-STEP PROTOCOL:
Step 1: Greet the user politely and ask for their smartphone brand and model name.
Step 2: Ask about the specific issue they are facing. Once they mention the issue, IMMEDIATELY provide a rough, realistic cost estimate in INR (₹) and reassure them about doorstep repair and warranty.
Step 3: Ask for their preferred date, time slot, and full delivery address. STRICT VALIDATION: The address MUST contain a proper 6-digit Pincode and a clear Landmark. If missing, politely ask again before proceeding.
Step 4: Summarize all booking details and ask for confirmation.
Step 5: Once confirmed, assign technician "Rahul Kumar (Master Certified Technician)" and output the final structured JSON block:
\`\`\`json
{
  "Brand": "...",
  "Model": "...",
  "Issue": "...",
  "CostEstimate": "₹...",
  "Date": "...",
  "Time": "...",
  "Address": "...",
  "Pincode": "...",
  "Landmark": "...",
  "AssignedTechnician": "Rahul Kumar (Master Certified Technician)"
}
\`\`\``;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, rateCards } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response for free static Vercel deployments without env key
      return res.status(200).json({
        text: 'Namaste ji! QuickFix Doorstep service mein aapka swagat hai. Aapka message note ho gaya hai. Kripya apna phone model aur exact problem batayein.',
        step: 2,
        extractedInfo: {},
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let dynamicRatesPrompt = '';
    if (rateCards && Array.isArray(rateCards) && rateCards.length > 0) {
      dynamicRatesPrompt = `\n\nOFFICIAL UPDATED PRICE LIST (CRITICAL: When quoting prices in Step 2, ALWAYS quote the exact estimated cost from this updated list for the user's phone brand/model/service):\n` +
        rateCards.map((rc: any) => `* Brand: ${rc.brand} | Model: ${rc.model} | Service: ${rc.serviceType} | Cost: ${rc.costEstimate} | Warranty: ${rc.warranty}`).join('\n');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + dynamicRatesPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '';
    let detectedBooking = null;
    const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        detectedBooking = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // Ignored
      }
    }

    return res.status(200).json({
      text: replyText,
      booking: detectedBooking,
      step: detectedBooking ? 5 : 3,
    });
  } catch (error: any) {
    console.error('Vercel API chat error:', error);
    return res.status(200).json({
      text: 'Namaste ji! Aapka request receive ho gaya hai. Kripya apna phone model, problem, 6-digit Pincode aur Landmark batayein.',
      step: 2,
      extractedInfo: {},
    });
  }
}
