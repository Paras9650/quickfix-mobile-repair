import React, { useState } from 'react';
import { X, Smartphone, Calendar, Clock, MapPin, ShieldCheck, User, Code2, Copy, Check, Star } from 'lucide-react';
import { BookingData } from '../types';

interface SavedBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingData[];
}

export const SavedBookingsModal: React.FC<SavedBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Your Doorstep Repair Bookings</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                {bookings.length} Saved
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status and backend JSON records for your home technician appointments
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Smartphone className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No active bookings yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Converse with our Hinglish AI assistant to book your first doorstep repair!
              </p>
            </div>
          ) : (
            bookings.map((b, idx) => {
              const brand = b.Brand || (b as any).brand || 'Smartphone';
              const model = b.Model || (b as any).model || '';
              const issue = b.Issue || (b as any).issue || 'General Repair';
              const cost = b.CostEstimate || (b as any).estimatedCost || '₹1,500 - ₹3,000';
              const date = b.Date || (b as any).preferredDate || 'Tomorrow';
              const time = b.Time || (b as any).timeSlot || '11:00 AM';
              const address = b.Address || (b as any).serviceAddress || 'Doorstep Address';
              const pin = b.Pincode || (b as any).pincode || '';
              const landmark = b.Landmark || (b as any).landmark || '';
              const tech = b.AssignedTechnician || (b as any).technicianAssigned || 'Rahul (Certified Tech)';
              const bId = b.bookingId || `QF-78${idx}91`;

              const jsonPayload = JSON.stringify(
                {
                  Brand: brand,
                  Model: model,
                  Issue: issue,
                  CostEstimate: cost,
                  Date: date,
                  Time: time,
                  Address: address,
                  Pincode: pin,
                  Landmark: landmark,
                  AssignedTechnician: tech,
                },
                null,
                2
              );

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {bId}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Confirmed & Assigned
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(jsonPayload, bId)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-900 px-2 py-1 rounded border border-slate-800 transition"
                      title="Copy backend JSON"
                    >
                      {copiedId === bId ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Code2 className="w-3 h-3 text-amber-400" />
                          <span>JSON</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Device & Issue</span>
                      <strong className="text-white">{brand} {model}</strong>
                      <div className="text-amber-300 text-[11px]">{issue}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cost & Slot</span>
                      <strong className="text-emerald-400">{cost}</strong>
                      <div className="text-slate-300 text-[11px]">{date} • {time}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 pt-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Doorstep Address</span>
                    <p className="line-clamp-2">{address}</p>
                    {(pin || landmark) && (
                      <div className="flex items-center gap-2 text-[11px] text-amber-300 mt-1">
                        {pin && <span>PIN: {pin}</span>}
                        {pin && landmark && <span>•</span>}
                        {landmark && <span>Near: {landmark}</span>}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-slate-200 font-medium">{tech}</span>
                      <span className="text-[10px] text-amber-400 flex items-center font-bold">
                        <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" /> 4.9
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> 6M Warranty
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
