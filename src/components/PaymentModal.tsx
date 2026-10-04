import React, { useState, useEffect } from 'react';
import { BookingData, PaymentRecord } from '../types';
import { mockDatabase } from '../data/mockDatabase';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Copy,
  Check,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  CreditCard,
  Banknote,
  Send,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingData;
  onPaymentSuccess?: (payment: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
}) => {
  const [selectedApp, setSelectedApp] = useState<'GooglePay' | 'PhonePe' | 'Paytm'>('PhonePe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(booking.status === 'Paid');
  const [completedTxn, setCompletedTxn] = useState<PaymentRecord | null>(null);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(299);

  // Extract numeric price or default to ₹2,500
  const cleanAmount = booking.CostEstimate
    ? booking.CostEstimate.split('-')[0].trim()
    : '₹2,500';

  const merchantVpa = 'quickfix.doorstep@okhdfcbank';

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isPaid) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPaid]);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const record = mockDatabase.recordPayment({
        bookingId: booking.bookingId,
        amount: cleanAmount,
        method: 'UPI',
        upiApp: selectedApp,
        status: 'Completed',
        customerName: booking.customerName || 'Customer',
      });

      setIsProcessing(false);
      setIsPaid(true);
      setCompletedTxn(record);

      if (onPaymentSuccess) {
        onPaymentSuccess(record);
      }
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>In-App UPI Payment</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Instant Verification
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Scan with any Indian UPI App or simulate instant checkout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {isPaid ? (
            /* Celebration Paid View */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">Payment Received!</h3>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Settled via {completedTxn?.upiApp || 'UPI'} • {cleanAmount}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {completedTxn?.transactionId || 'TXN-984210'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking Reference:</span>
                  <span className="font-mono text-white font-semibold">{booking.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Device & Issue:</span>
                  <span className="text-white font-medium">{booking.Brand} {booking.Model}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 6-Month Warranty Activated
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-400/20"
                >
                  Done & Return to App
                </button>
              </div>
            </div>
          ) : (
            /* Live Dynamic QR Code Screen */
            <div className="space-y-5">
              {/* Payment Summary Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Payable Amount:</span>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    {cleanAmount}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expires in:</span>
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {formatTimer(timerSeconds)}
                  </span>
                </div>
              </div>

              {/* Dynamic Styled QR Code Container */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white text-slate-950 shadow-inner">
                {/* Simulated SVG QR Matrix */}
                <div className="relative p-2 bg-white rounded-xl border border-slate-200">
                  <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
                    {/* Corner Markers */}
                    <rect x="10" y="10" width="45" height="45" fill="#0f172a" rx="6" />
                    <rect x="18" y="18" width="29" height="29" fill="#ffffff" rx="3" />
                    <rect x="24" y="24" width="17" height="17" fill="#0f172a" rx="2" />

                    <rect x="125" y="10" width="45" height="45" fill="#0f172a" rx="6" />
                    <rect x="133" y="18" width="29" height="29" fill="#ffffff" rx="3" />
                    <rect x="139" y="24" width="17" height="17" fill="#0f172a" rx="2" />

                    <rect x="10" y="125" width="45" height="45" fill="#0f172a" rx="6" />
                    <rect x="18" y="133" width="29" height="29" fill="#ffffff" rx="3" />
                    <rect x="24" y="139" width="17" height="17" fill="#0f172a" rx="2" />

                    {/* QR Matrix Bits */}
                    {[
                      [65, 15], [75, 15], [95, 15], [105, 15],
                      [65, 25], [85, 25], [115, 25],
                      [70, 35], [90, 35], [100, 35],
                      [15, 65], [35, 65], [55, 65], [75, 65], [95, 65], [115, 65], [135, 65], [155, 65],
                      [25, 75], [45, 75], [85, 75], [105, 75], [125, 75], [145, 75],
                      [15, 85], [35, 85], [65, 85], [115, 85], [135, 85], [165, 85],
                      [25, 95], [55, 95], [75, 95], [95, 95], [125, 95], [155, 95],
                      [15, 105], [45, 105], [85, 105], [105, 105], [135, 105],
                      [65, 125], [85, 125], [105, 125], [125, 125], [145, 125], [165, 125],
                      [75, 135], [95, 135], [115, 135], [135, 135], [155, 135],
                      [65, 145], [85, 145], [105, 145], [125, 145], [165, 145],
                      [75, 155], [95, 155], [115, 155], [145, 155],
                      [65, 165], [85, 165], [105, 165], [125, 165], [155, 165],
                    ].map(([x, y], i) => (
                      <rect key={i} x={x} y={y} width="7" height="7" fill="#0f172a" rx="1" />
                    ))}

                    {/* Center Brand Pill */}
                    <rect x="70" y="70" width="40" height="40" rx="8" fill="#f59e0b" />
                    <text x="90" y="93" fill="#020617" fontSize="11" fontWeight="bold" textAnchor="middle">
                      QF
                    </text>
                  </svg>
                </div>

                <div className="mt-3 text-center">
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-800">
                    QuickFix Doorstep Mobile Solutions
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono">{merchantVpa}</span>
                    <button
                      onClick={handleCopyVpa}
                      className="p-1 hover:text-slate-800 transition"
                      title="Copy VPA"
                    >
                      {copiedVpa ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* UPI App Selection */}
              <div>
                <span className="text-xs text-slate-400 block font-semibold mb-2">
                  Select Paying UPI App:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PhonePe', name: 'PhonePe', color: 'text-purple-400' },
                    { id: 'GooglePay', name: 'Google Pay', color: 'text-blue-400' },
                    { id: 'Paytm', name: 'Paytm UPI', color: 'text-cyan-400' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        selectedApp === app.id
                          ? 'bg-slate-800 border-amber-400 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={app.color}>●</span> {app.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating with {selectedApp}...
                    </span>
                  ) : (
                    <span>Simulate 1-Click Instant Payment ({cleanAmount})</span>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  🔒 100% Encrypted UPI Intent • Pay after inspection option available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
