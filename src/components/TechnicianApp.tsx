import React, { useState, useEffect } from 'react';
import { Technician, BookingData } from '../types';
import { mockDatabase } from '../data/mockDatabase';
import {
  Bike,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Wrench,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Lock,
  KeyRound,
  AlertTriangle,
  Radio,
  Check,
  RotateCcw,
  Zap,
  BellRing,
  X,
  Volume2,
} from 'lucide-react';

interface TechnicianAppProps {
  technicians: Technician[];
  bookings: BookingData[];
  onMoveTech: (techId: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: any) => void;
  latestConfirmedBooking?: BookingData | null;
}

export const TechnicianApp: React.FC<TechnicianAppProps> = ({
  technicians,
  bookings,
  onMoveTech,
  onUpdateBookingStatus,
  latestConfirmedBooking,
}) => {
  const [selectedTechId, setSelectedTechId] = useState<string>('tech-1');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [spoofStatus, setSpoofStatus] = useState<'SECURE' | 'SIMULATED_ALERT'>('SECURE');
  const [movementDistance, setMovementDistance] = useState<number | null>(450);
  const [isLocalSyncFlashing, setIsLocalSyncFlashing] = useState<boolean>(false);

  // Rapido-Style Driver Incoming Request Screen State
  const [incomingOrder, setIncomingOrder] = useState<BookingData | null>(null);
  const [countdown, setCountdown] = useState<number>(25);

  const selectedTech = technicians.find((t) => t.id === selectedTechId) || technicians[0];

  // If a new booking was confirmed by customer, automatically trigger the Rapido alert screen
  useEffect(() => {
    if (latestConfirmedBooking && latestConfirmedBooking.status !== 'Completed') {
      setIncomingOrder(latestConfirmedBooking);
      setCountdown(25);
    }
  }, [latestConfirmedBooking]);

  // Countdown timer for incoming request
  useEffect(() => {
    if (!incomingOrder) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIncomingOrder(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingOrder]);

  // Find active assigned job for this technician
  const activeJob =
    bookings.find(
      (b) =>
        (b.technicianId === selectedTech.id ||
          b.AssignedTechnician.toLowerCase().includes(selectedTech.name.toLowerCase().split(' ')[0])) &&
        b.status !== 'Completed' &&
        b.status !== 'Paid'
    ) || bookings[0];

  const handleVerifyOtp = () => {
    if (!activeJob) return;
    const correctOtp = activeJob.securityOtp || '4829';
    if (otpInput.trim() === correctOtp) {
      setOtpVerified(true);
      setOtpError(null);
      setIsShaking(false);
    } else {
      setOtpError(`Galat OTP! Customer se confirm karein (Demo OTP: ${correctOtp})`);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleSimulateMove = () => {
    onMoveTech(selectedTech.id);
    const result = mockDatabase.moveTechnicianCloserToJob(selectedTech.id, 100);
    setMovementDistance(result.distanceRemainingMeters);
    setIsLocalSyncFlashing(true);
    setTimeout(() => setIsLocalSyncFlashing(false), 3800);
  };

  const toggleSpoofCheck = () => {
    if (spoofStatus === 'SECURE') {
      setSpoofStatus('SIMULATED_ALERT');
    } else {
      setSpoofStatus('SECURE');
    }
  };

  const handleAcceptRapidoJob = () => {
    if (!incomingOrder) return;
    onUpdateBookingStatus(incomingOrder.bookingId, 'EnRoute');
    setIncomingOrder(null);
  };

  const handleRejectRapidoJob = () => {
    setIncomingOrder(null);
  };

  const triggerSimulatedRapidoPing = () => {
    const pendingBooking = bookings.find((b) => b.status === 'Pending') || bookings[0];
    setIncomingOrder(pendingBooking);
    setCountdown(25);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* RAPIDO-STYLE DRIVER INCOMING REQUEST SCREEN OVERLAY */}
      {incomingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in zoom-in-95">
          <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-4 border-amber-400 p-6 shadow-2xl shadow-amber-500/30 text-white relative overflow-hidden animate-pulse [animation-duration:2.5s]">
            {/* Pulsing Alert Banner */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1.5 px-4 text-slate-950 font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>NEW REPAIR REQUEST NEARBY!</span>
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>

            {/* Countdown Ring */}
            <div className="mt-5 flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center animate-bounce">
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Rapido Doorstep Dispatch</h3>
                  <p className="text-xs text-amber-400 font-semibold">Priority Express Job</p>
                </div>
              </div>

              {/* Timer Pill */}
              <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center font-mono font-black text-sm text-amber-400 shadow-inner">
                {countdown}s
              </div>
            </div>

            {/* Order Highlights */}
            <div className="py-4 space-y-3.5">
              {/* Distance & Payout Pill */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
                  <div className="text-base font-extrabold text-white flex items-center gap-1 mt-0.5">
                    <Navigation className="w-4 h-4 text-blue-400" />
                    <span>2.4 km</span>
                  </div>
                  <span className="text-[10px] text-slate-400">~8 mins ride</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Payout</span>
                  <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                    ₹650
                  </div>
                  <span className="text-[10px] text-slate-400">Bill: {incomingOrder.CostEstimate}</span>
                </div>
              </div>

              {/* Customer Phone Model & Issue */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Smartphone & Problem</div>
                <div className="text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>{incomingOrder.Brand} {incomingOrder.Model}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {incomingOrder.Issue}
                </p>
              </div>

              {/* Delivery Address */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Doorstep Location</span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {incomingOrder.Address}
                </p>
                <div className="text-[10px] text-amber-300 font-semibold">
                  PIN: {incomingOrder.Pincode} • Near: {incomingOrder.Landmark}
                </div>
              </div>
            </div>

            {/* TWO BIG PROMINENT BUTTONS: [ACCEPT JOB] and [REJECT] */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={handleRejectRapidoJob}
                className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-extrabold text-xs uppercase tracking-wider transition border border-slate-700"
              >
                Pass / Reject
              </button>

              <button
                onClick={handleAcceptRapidoJob}
                className="py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 animate-bounce"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>ACCEPT JOB</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technician Profile Switcher & Duty Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-400 flex items-center justify-center font-extrabold text-slate-950 text-lg shadow-lg">
              {selectedTech.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">{selectedTech.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {selectedTech.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedTech.specialization} • {selectedTech.rating}⭐ ({selectedTech.totalRepairs}+ Doors fixed)
            </p>
          </div>
        </div>

        {/* Profile Switcher & Simulated Ping Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerSimulatedRapidoPing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition"
            title="Test Rapido-Style Incoming Alert"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Rapido Ping</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 px-2">Switch Tech:</span>
            {technicians.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTechId(t.id);
                  setOtpVerified(false);
                  setOtpInput('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedTechId === t.id
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {t.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security Connection Status Panel */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Security Connection Status</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                  TLS 1.3 Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                End-to-end cryptographic heartbeat and mock location defense matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Heartbeat: 14ms
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* JWT Auth Token Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>JWT Auth Token: Secured (🔒 Active Session)</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <span>Session ID:</span>
                <span className="text-purple-300">eyJhbGciOiJIUzI1Ni...9f2a</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                ✓ Verified via SHA-256 HMAC Signature
              </div>
            </div>
          </div>

          {/* Anti-Spoofing Protocol Card */}
          <div
            className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
              spoofStatus === 'SECURE'
                ? 'bg-slate-950/80 border-slate-800'
                : 'bg-rose-950/30 border-rose-500/40 animate-pulse'
            }`}
          >
            <div
              className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                spoofStatus === 'SECURE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              {spoofStatus === 'SECURE' ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <div className="text-xs font-extrabold text-white flex items-center justify-between">
                <span>Anti-Spoofing Protocol: ON (✅ No Fake GPS Detected)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Hardware satellite lock • Mock provider check: Passed (±2.4m)
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] text-emerald-400 font-semibold">
                  ✓ Mock GPS Trap Active
                </span>
                <button
                  onClick={toggleSpoofCheck}
                  className="text-[10px] underline text-slate-400 hover:text-white"
                >
                  {spoofStatus === 'SECURE' ? 'Simulate Spoof Attack' : 'Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Job Card */}
      {activeJob ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-6 p-5 sm:p-7">
          {/* Job Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                  Assigned Doorstep Repair Job
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {activeJob.bookingId}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                {activeJob.Brand} {activeJob.Model}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {activeJob.status}
              </span>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Customer & Problem
              </div>
              <div className="text-sm font-bold text-white">
                {activeJob.customerName || 'Customer'}
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`tel:${activeJob.phone}`} className="hover:underline text-emerald-400 font-semibold">
                  {activeJob.phone || '+91 98765 43210'}
                </a>
              </div>
              <div className="text-xs text-amber-300 font-medium pt-1 flex items-start gap-1.5">
                <Wrench className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{activeJob.Issue}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Estimate: <strong className="text-emerald-400">{activeJob.CostEstimate}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Doorstep Delivery Address
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeJob.Address}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 mt-1">
                <span>PIN: <strong>{activeJob.Pincode}</strong></span>
                <span>•</span>
                <span>Near: <strong>{activeJob.Landmark}</strong></span>
              </div>
              <div className="text-xs text-slate-400 pt-1">
                Slot: <strong className="text-white">{activeJob.Date} • {activeJob.Time}</strong>
              </div>
            </div>
          </div>

          {/* GPS Movement Simulator */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-950/60 to-slate-950/60 border border-blue-900/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Simulate Doorstep GPS Navigation
                  </h4>
                  <p className="text-xs text-slate-400">
                    Moves technician coordinates closer to Indiranagar doorstep on Admin Map
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400">Distance:</span>{' '}
                  <strong className="text-amber-400 font-mono">
                    {movementDistance !== null ? `${movementDistance}m` : 'Arrived'}
                  </strong>
                </div>

                <button
                  onClick={handleSimulateMove}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold transition shadow-lg shadow-blue-600/30 active:scale-95"
                >
                  <Navigation className="w-4 h-4 animate-pulse" />
                  <span>Simulate GPS Travel - Move 100m Closer</span>
                </button>
              </div>
            </div>

            {/* Flashing Green Location-Sync Indicator (Proves Heartbeat Link Works) */}
            {isLocalSyncFlashing && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/95 border-2 border-emerald-400 text-emerald-300 text-xs font-bold shadow-2xl shadow-emerald-500/30 flex items-center justify-between gap-3 animate-bounce">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span>
                    🟢 GPS HEARTBEAT SYNCED: Coords updated (+100m closer)! Flashing live on Admin Map & Customer Tracking screen.
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shrink-0">
                  Hardware Latency: 12ms
                </span>
              </div>
            )}
          </div>

          {/* Security OTP Verification Section */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">
                Doorstep Security OTP Verification
              </h4>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Required before phone handover
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Customer has a 4-digit security OTP on their confirmation ticket. Ask customer and verify to initiate repair.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="relative">
                {otpVerified ? (
                  <CheckCircle2 className="w-4 h-4 absolute left-3 top-2.5 text-emerald-400 animate-bounce" />
                ) : (
                  <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                )}
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit OTP (e.g. 4829)"
                  disabled={otpVerified}
                  className={`pl-9 pr-4 py-2 text-sm font-mono tracking-widest rounded-xl focus:outline-none transition-all duration-300 ${
                    otpVerified
                      ? 'bg-emerald-950/40 border-2 border-emerald-400 text-emerald-300 font-extrabold shadow-lg shadow-emerald-500/30 animate-success-glow'
                      : isShaking
                      ? 'bg-rose-950/40 border-2 border-rose-500 text-rose-300 font-bold animate-error-shake'
                      : 'bg-slate-900 border border-slate-700 text-white focus:border-amber-400'
                  }`}
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otpVerified || !otpInput.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  otpVerified
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                }`}
              >
                {otpVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>OTP Verified (Authorized)</span>
                  </>
                ) : (
                  <span>Verify Customer OTP</span>
                )}
              </button>

              <button
                onClick={() => setOtpInput(activeJob.securityOtp || '4829')}
                className="text-[11px] text-slate-400 hover:text-amber-300 underline"
              >
                Use Customer OTP ({activeJob.securityOtp || '4829'})
              </button>
            </div>

            {otpError && (
              <div className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 pt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{otpError}</span>
              </div>
            )}
          </div>

          {/* Job Progression Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Update Job Phase:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onUpdateBookingStatus(activeJob.bookingId, 'EnRoute')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600/80 hover:bg-blue-600 text-white transition flex items-center gap-1.5"
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Start Ride (EnRoute)</span>
              </button>

              <button
                onClick={() => onUpdateBookingStatus(activeJob.bookingId, 'Repairing')}
                disabled={!otpVerified}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  otpVerified
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title={!otpVerified ? 'Verify OTP first to start repair' : 'Start repair'}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Start Repair</span>
              </button>

              <button
                onClick={() => onUpdateBookingStatus(activeJob.bookingId, 'Completed')}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Job</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
          <Wrench className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-base font-bold text-white">No Active Assigned Jobs</h3>
          <p className="text-xs text-slate-400 mt-1">
            All assigned doorstep repairs are completed. Stand by for new booking notifications.
          </p>
        </div>
      )}
    </div>
  );
};
