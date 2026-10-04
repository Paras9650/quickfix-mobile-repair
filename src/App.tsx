import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bot,
  User,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  LayoutDashboard,
  Bike,
  QrCode,
} from 'lucide-react';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { BookingConfirmationCard } from './components/BookingConfirmationCard';
import { LiveBookingSummary } from './components/LiveBookingSummary';
import { RateCardModal } from './components/RateCardModal';
import { SavedBookingsModal } from './components/SavedBookingsModal';
import { AdminPanel } from './components/AdminPanel';
import { TechnicianApp } from './components/TechnicianApp';
import { PaymentModal } from './components/PaymentModal';
import { mockDatabase } from './data/mockDatabase';
import { generateClientSideReply } from './utils/clientChatEngine';
import {
  ChatMessage,
  BookingData,
  StepNumber,
  ExtractedInfo,
  AppViewMode,
  Technician,
  PaymentRecord,
  BookingStatus,
  RateCardItem,
  GpsSyncHeartbeat,
} from './types';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-msg',
  role: 'assistant',
  content:
    'Namaste ji! 🙏 Welcome to QuickFix Doorstep Mobile Repair. Main aapka personal repair assistant hoon.\n\nAapko kaunse smartphone brand aur model ka repair karwana hai? (e.g., Apple iPhone 15, Samsung Galaxy S23, OnePlus 12, Redmi Note 13)',
  timestamp: new Date(),
};

export default function App() {
  // 3-in-1 View Mode: customer | technician | admin
  const [viewMode, setViewMode] = useState<AppViewMode>('customer');

  // Unified Shared State from mockDatabase
  const [bookings, setBookings] = useState<BookingData[]>(mockDatabase.getBookings());
  const [technicians, setTechnicians] = useState<Technician[]>(mockDatabase.getTechnicians());
  const [payments, setPayments] = useState<PaymentRecord[]>(mockDatabase.getPayments());
  const [rateCards, setRateCards] = useState<RateCardItem[]>(mockDatabase.getRateCardItems());
  const [lastGpsHeartbeat, setLastGpsHeartbeat] = useState<GpsSyncHeartbeat | null>(mockDatabase.getLastGpsHeartbeat());

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);

  // Rapido Driver Incoming Alert Target
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState<BookingData | null>(null);

  // Modals
  const [isRateCardOpen, setIsRateCardOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentBooking, setActivePaymentBooking] = useState<BookingData | null>(null);

  // Audio / Speech
  const [isListening, setIsListening] = useState(false);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Subscribe to mockDatabase changes across all views
  useEffect(() => {
    const unsubscribe = mockDatabase.subscribe(() => {
      setBookings(mockDatabase.getBookings());
      setTechnicians(mockDatabase.getTechnicians());
      setPayments(mockDatabase.getPayments());
      setRateCards(mockDatabase.getRateCardItems());
      setLastGpsHeartbeat(mockDatabase.getLastGpsHeartbeat());
    });
    return unsubscribe;
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    initSpeechRecognition();
  }, []);

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  };

  const toggleMic = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isAudioSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsAudioSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/```json[\s\S]*?```/g, 'Aapka booking JSON generate ho gaya hai.')
      .replace(/[*_#]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('en-IN')
    );
    if (indVoice) utterance.voice = indVoice;

    utterance.onend = () => setIsAudioSpeaking(null);
    utterance.onerror = () => setIsAudioSpeaking(null);

    setIsAudioSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsAudioSpeaking(null);

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    updateExtractedInfoFromUser(text);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          rateCards: rateCards,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      let detectedBooking: BookingData | null = data.booking || null;

      if (!detectedBooking) {
        const jsonMatch = data.text?.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            detectedBooking = JSON.parse(jsonMatch[1]);
          } catch (e) {
            console.error('Failed to parse json on client:', e);
          }
        }
      }

      if (detectedBooking) {
        // Save to mock database
        const saved = mockDatabase.addBooking({
          ...detectedBooking,
          bookingId: detectedBooking.bookingId || `QF-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'EnRoute',
        });

        setConfirmedBooking(saved);
        setLatestConfirmedBooking(saved);
        setActivePaymentBooking(saved);
        setCurrentStep(5);
      } else if (data.step) {
        setCurrentStep(data.step);
      }

      if (data.extractedInfo) {
        setExtractedInfo((prev) => ({
          ...prev,
          ...data.extractedInfo,
        }));
      }

      extractCostFromAssistantText(data.text);

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Koi samasya aayi hai, please try again.',
        timestamp: new Date(),
        bookingData: detectedBooking || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.warn('Backend API unavailable (typical on static drag-and-drop hosts). Falling back to client-side engine:', err);
      // Run smart client-side conversational AI engine so static drag-and-drop hosting works 100%
      const fallbackReply = generateClientSideReply(text, newMessages, currentStep, extractedInfo, rateCards);

      let fallbackBooking: BookingData | null = null;
      if (fallbackReply.booking) {
        fallbackBooking = mockDatabase.addBooking(fallbackReply.booking);
        setConfirmedBooking(fallbackBooking);
        setLatestConfirmedBooking(fallbackBooking);
        setActivePaymentBooking(fallbackBooking);
        setCurrentStep(5);
      } else if (fallbackReply.step) {
        setCurrentStep(fallbackReply.step);
      }

      if (fallbackReply.extracted) {
        setExtractedInfo((prev) => ({
          ...prev,
          ...fallbackReply.extracted,
        }));
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply.text,
        timestamp: new Date(),
        bookingData: fallbackBooking || undefined,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExtractedInfoFromUser = (text: string) => {
    const lower = text.toLowerCase();

    const pinMatch = text.match(/\b([1-9][0-9]{5})\b/);
    if (pinMatch) {
      setExtractedInfo((prev) => ({ ...prev, Pincode: pinMatch[1] }));
    }

    const landmarkMatch = text.match(/(?:near|opp\.?|opposite|behind|beside|next to|in front of|close to|facing)\s+([^,.\n]+)/i);
    if (landmarkMatch && landmarkMatch[1]) {
      setExtractedInfo((prev) => ({ ...prev, Landmark: landmarkMatch[1].trim() }));
    } else if (
      lower.includes('metro') ||
      lower.includes('hospital') ||
      lower.includes('school') ||
      lower.includes('station') ||
      lower.includes('temple') ||
      lower.includes('mandir') ||
      lower.includes('park') ||
      lower.includes('mall') ||
      lower.includes('bazaar')
    ) {
      const parts = text.split(/[,;\n]/);
      const found = parts.find((p) =>
        /(?:metro|hospital|school|station|temple|mandir|park|mall|bazaar)/i.test(p)
      );
      if (found) {
        setExtractedInfo((prev) => ({ ...prev, Landmark: found.trim() }));
      }
    }

    if (
      lower.includes('flat') ||
      lower.includes('house') ||
      lower.includes('h.no') ||
      lower.includes('room') ||
      lower.includes('colony') ||
      lower.includes('society') ||
      lower.includes('enclave') ||
      lower.includes('residency') ||
      lower.includes('nagar') ||
      lower.includes('sector') ||
      lower.includes('road') ||
      lower.includes('street') ||
      lower.includes('vihar') ||
      lower.includes('apartment')
    ) {
      setExtractedInfo((prev) => ({
        ...prev,
        Address: text,
      }));
    }

    const brands = [
      'apple',
      'iphone',
      'samsung',
      'oneplus',
      'redmi',
      'xiaomi',
      'realme',
      'vivo',
      'oppo',
      'pixel',
      'motorola',
    ];
    for (const b of brands) {
      if (lower.includes(b)) {
        setExtractedInfo((prev) => ({
          ...prev,
          Brand: b.charAt(0).toUpperCase() + b.slice(1),
          Model: text,
        }));
        if (currentStep === 1) setCurrentStep(2);
        break;
      }
    }

    if (
      lower.includes('screen') ||
      lower.includes('display') ||
      lower.includes('touch') ||
      lower.includes('glass')
    ) {
      setExtractedInfo((prev) => ({
        ...prev,
        Issue: 'Screen / Display Replacement',
      }));
      if (currentStep === 2) setCurrentStep(3);
    } else if (
      lower.includes('battery') ||
      lower.includes('drain') ||
      lower.includes('backup')
    ) {
      setExtractedInfo((prev) => ({
        ...prev,
        Issue: 'Battery Replacement',
      }));
      if (currentStep === 2) setCurrentStep(3);
    } else if (
      lower.includes('charge') ||
      lower.includes('charging') ||
      lower.includes('port')
    ) {
      setExtractedInfo((prev) => ({
        ...prev,
        Issue: 'Charging Port Repair',
      }));
      if (currentStep === 2) setCurrentStep(3);
    }
  };

  const extractCostFromAssistantText = (text: string) => {
    if (!text) return;
    const costMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\s*-\s*[\d,]+)?)/i);
    if (costMatch) {
      setExtractedInfo((prev) => ({
        ...prev,
        CostEstimate: `₹${costMatch[1]}`,
      }));
    }
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([INITIAL_MESSAGE]);
    setCurrentStep(1);
    setExtractedInfo({});
    setConfirmedBooking(null);
  };

  const handleOpenPaymentModal = (b?: BookingData) => {
    const target = b || confirmedBooking || bookings[0];
    if (target) {
      setActivePaymentBooking(target);
      setIsPaymentModalOpen(true);
    }
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    mockDatabase.updateBookingStatus(bookingId, status);
  };

  const handleMoveTech = (techId: string) => {
    mockDatabase.moveTechnicianCloserToJob(techId);
  };

  const handleUpdateRateCardPrice = (id: string, newCost: string) => {
    mockDatabase.updateRateCardPrice(id, newCost);
  };

  const handleAddRateCardItem = (item: Omit<RateCardItem, 'id'>) => {
    mockDatabase.addRateCardItem(item);
  };

  const handleDeleteRateCardItem = (id: string) => {
    mockDatabase.deleteRateCardItem(id);
  };

  const renderQuickChips = () => {
    if (isLoading) return null;

    let chips: { label: string; text: string }[] = [];

    if (currentStep === 1) {
      chips = [
        { label: '🍎 iPhone 15 Pro', text: 'Apple iPhone 15 Pro' },
        { label: '📱 Samsung Galaxy S24 Ultra', text: 'Samsung Galaxy S24 Ultra' },
        { label: '⚡ OnePlus 12', text: 'OnePlus 12' },
        { label: '🔥 Redmi Note 13 Pro', text: 'Redmi Note 13 Pro' },
        { label: '✨ Vivo V30', text: 'Vivo V30' },
      ];
    } else if (currentStep === 2) {
      chips = [
        {
          label: '📱 Screen Broken / Display Crack',
          text: 'Screen toot gayi hai aur display flickering ho rahi hai',
        },
        {
          label: '🔋 Battery Draining Fast',
          text: 'Battery bahut jaldi drain ho rahi hai aur phone garam hota hai',
        },
        {
          label: '🔌 Charging Port Loose',
          text: 'Charging port loose hai, cable pakad nahi raha aur charge nahi ho raha',
        },
        {
          label: '📷 Camera Lens Cracked',
          text: 'Back camera lens crack ho gaya hai, photos blurry aa rahi hain',
        },
        {
          label: '🔊 Speaker / Mic Low Sound',
          text: 'Calling ke waqt samne wale ko meri awaz nahi jaati aur speaker low hai',
        },
      ];
    } else if (currentStep === 3) {
      chips = [
        {
          label: '📅 Aaj Shaam 4-6 PM',
          text: 'Preferred slot: Aaj shaam 4:00 PM se 6:00 PM ke beech',
        },
        {
          label: '📅 Kal Subah 10-12 AM',
          text: 'Preferred slot: Kal subah 10:00 AM se 12:00 PM ke beech',
        },
        {
          label: '📍 Valid Sample Address (PIN + Landmark)',
          text: 'Flat 402, Sunshine Heights, Opposite Indiranagar Metro Station, Indiranagar Bengaluru - 560038',
        },
      ];
    } else if (currentStep === 4) {
      chips = [
        {
          label: '✅ Haan, bilkul confirm kar dijiye!',
          text: 'Haan ji, sabhi details sahi hain. Booking confirm kar dijiye!',
        },
        {
          label: '✏️ Address update karna hai',
          text: 'Mujhe delivery address mein landmark change karna hai',
        },
        {
          label: '⏰ Time slot badalna hai',
          text: 'Kya time slot shaam ko 5 baje ka ho sakta hai?',
        },
      ];
    } else if (currentStep === 5) {
      chips = [
        {
          label: '💳 Pay via In-App UPI QR',
          text: 'Pay Now',
        },
        {
          label: '🔄 Book Another Repair',
          text: 'Mujhe ek aur phone repair karwana hai',
        },
        {
          label: '📍 Technician Status Check',
          text: 'Technician kitne baje tak pahuchega?',
        },
      ];
    }

    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-4 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Quick:
        </span>
        {chips.map((c, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (c.text === 'Pay Now') {
                handleOpenPaymentModal();
              } else {
                handleSendMessage(c.text);
              }
            }}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 border border-slate-700 hover:border-amber-400 text-slate-200 font-medium transition duration-150 shadow-sm"
          >
            {c.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar with 3-in-1 Switcher */}
      <Header
        onOpenRateCard={() => setIsRateCardOpen(true)}
        onOpenBookings={() => setIsBookingsOpen(true)}
        bookingCount={bookings.length}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
      />

      {/* Main View Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6">
        {/* VIEW 1: ADMIN CONTROL PANEL */}
        {viewMode === 'admin' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6 text-purple-400" />
                  <span>Admin Fleet & Order Command Center</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live GPS telemetry, status toggles, and multi-technician dispatch control
                </p>
              </div>

              <button
                onClick={() => setViewMode('customer')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
              >
                Go to Customer Chat →
              </button>
            </div>

            <AdminPanel
              bookings={bookings}
              technicians={technicians}
              payments={payments}
              rateCards={rateCards}
              onUpdateStatus={handleUpdateBookingStatus}
              onMoveTech={handleMoveTech}
              onUpdateRateCardPrice={handleUpdateRateCardPrice}
              onAddRateCardItem={handleAddRateCardItem}
              onDeleteRateCardItem={handleDeleteRateCardItem}
              lastGpsHeartbeat={lastGpsHeartbeat}
            />
          </div>
        )}

        {/* VIEW 2: TECHNICIAN JOB APP */}
        {viewMode === 'technician' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Bike className="w-6 h-6 text-blue-400" />
                  <span>Technician On-Duty Portal</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Active job assignment, simulated GPS moves, security OTP verification & anti-spoofing
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('admin')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 transition"
                >
                  View Admin Radar →
                </button>
              </div>
            </div>

            <TechnicianApp
              technicians={technicians}
              bookings={bookings}
              onMoveTech={handleMoveTech}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              latestConfirmedBooking={latestConfirmedBooking}
            />
          </div>
        )}

        {/* VIEW 3: CUSTOMER BOOKING APP */}
        {viewMode === 'customer' && (
          <div className="space-y-4 animate-in fade-in">
            {/* 5-Step Progress Bar */}
            <StepProgressBar currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left / Center Chat Column */}
              <div className="lg:col-span-8 flex flex-col h-[calc(100vh-14rem)] min-h-[550px] bg-slate-900/60 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
                {/* Chat Header Bar */}
                <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          QuickFix Sahayak
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Online
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Doorstep Repair Assistant • Speaks Hinglish
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {confirmedBooking && (
                      <button
                        onClick={() => handleOpenPaymentModal(confirmedBooking)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Pay via UPI</span>
                      </button>
                    )}

                    <button
                      onClick={handleResetChat}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                      title="Restart Conversation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restart</span>
                    </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {messages.map((m) => {
                    const isAssistant = m.role === 'assistant';
                    const cleanContent = m.content.replace(/```json[\s\S]*?```/g, '').trim();

                    return (
                      <div
                        key={m.id}
                        className={`flex gap-3 items-start ${
                          isAssistant ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {isAssistant && (
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                            isAssistant
                              ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                              : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-medium rounded-tr-sm shadow-amber-500/10'
                          }`}
                        >
                          <div className="whitespace-pre-line leading-relaxed">
                            {cleanContent}
                          </div>

                          {/* Confirmed Booking Card with In-App UPI Payment Trigger */}
                          {m.bookingData && (
                            <BookingConfirmationCard
                              booking={m.bookingData}
                              onBookAnother={handleResetChat}
                              onOpenPayment={() => handleOpenPaymentModal(m.bookingData)}
                              lastGpsHeartbeat={lastGpsHeartbeat}
                            />
                          )}

                          {isAssistant && (
                            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                              <span className="text-[10px]">QuickFix Doorstep</span>
                              <button
                                onClick={() => speakText(m.content, m.id)}
                                className="flex items-center gap-1 hover:text-amber-400 transition"
                                title="Listen in Voice"
                              >
                                {isAudioSpeaking === m.id ? (
                                  <>
                                    <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                    <span className="text-amber-400">Stop Voice</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>Listen</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {!isAssistant && (
                          <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex gap-3 items-start justify-start">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1 animate-pulse">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-400 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-xs text-slate-400 ml-1">
                          QuickFix Sahayak soch raha hai...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="border-t border-slate-800/80 bg-slate-900/40">
                  {renderQuickChips()}
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
                >
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`p-2.5 rounded-xl border transition ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                      title={isListening ? 'Listening... click to stop' : 'Speak in Hinglish'}
                    >
                      {isListening ? (
                        <MicOff className="w-5 h-5 text-rose-400" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                  )}

                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        currentStep === 1
                          ? 'Type smartphone model (e.g., iPhone 15 Pro, Samsung S23)...'
                          : currentStep === 2
                          ? 'Apna issue batayein (e.g., screen crack, battery drain)...'
                          : currentStep === 3
                          ? 'Preferred slot aur full address with 6-digit Pincode & Landmark...'
                          : currentStep === 4
                          ? 'Haan / Yes confirm kar dijiye...'
                          : 'Aapka sawal ya naya booking type karein...'
                      }
                      disabled={isLoading}
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-bold transition shadow-md shadow-amber-400/20 flex items-center justify-center shrink-0"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Right Column: 3-in-1 View Switcher & Live Job Sheet */}
              <div className="lg:col-span-4">
                <LiveBookingSummary
                  extractedInfo={extractedInfo}
                  currentStep={currentStep}
                  onQuickPrefill={(text) => handleSendMessage(text)}
                  viewMode={viewMode}
                  onViewModeChange={(mode) => setViewMode(mode)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <RateCardModal
        isOpen={isRateCardOpen}
        onClose={() => setIsRateCardOpen(false)}
        rateCards={rateCards}
        onSelectService={(serviceQuery) => {
          setViewMode('customer');
          handleSendMessage(serviceQuery);
        }}
      />

      <SavedBookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        bookings={bookings}
      />

      {/* Dynamic In-App UPI Payment QR Checkout Modal */}
      {activePaymentBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          booking={activePaymentBooking}
          onPaymentSuccess={(record) => {
            // Update active state
            if (confirmedBooking && confirmedBooking.bookingId === record.bookingId) {
              setConfirmedBooking((prev) => prev ? { ...prev, status: 'Paid', paidAmount: record.amount } : null);
            }
          }}
        />
      )}
    </div>
  );
}
