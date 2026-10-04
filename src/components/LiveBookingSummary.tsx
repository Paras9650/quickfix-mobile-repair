import React from 'react';
import {
  Smartphone,
  Wrench,
  Calendar,
  MapPin,
  ShieldCheck,
  Clock,
  Lock,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  LayoutDashboard,
  Bike,
  Shield,
} from 'lucide-react';
import { ExtractedInfo, StepNumber, AppViewMode } from '../types';

interface LiveBookingSummaryProps {
  extractedInfo: ExtractedInfo;
  currentStep: StepNumber;
  onQuickPrefill: (text: string) => void;
  viewMode?: AppViewMode;
  onViewModeChange?: (mode: AppViewMode) => void;
}

export const LiveBookingSummary: React.FC<LiveBookingSummaryProps> = ({
  extractedInfo,
  currentStep,
  onQuickPrefill,
  viewMode = 'customer',
  onViewModeChange,
}) => {
  const brandVal = extractedInfo.Brand || (extractedInfo as any).brand;
  const modelVal = extractedInfo.Model || (extractedInfo as any).model;
  const issueVal = extractedInfo.Issue || (extractedInfo as any).issue;
  const costVal = extractedInfo.CostEstimate || (extractedInfo as any).estimatedCost;
  const dateVal = extractedInfo.Date || (extractedInfo as any).preferredDate;
  const timeVal = extractedInfo.Time || (extractedInfo as any).timeSlot;
  const addressVal = extractedInfo.Address || (extractedInfo as any).serviceAddress;
  const pincodeVal = extractedInfo.Pincode || (extractedInfo as any).pincode;
  const landmarkVal = extractedInfo.Landmark || (extractedInfo as any).landmark;

  return (
    <aside className="space-y-4">
      {/* 3-in-1 Spark View Switcher */}
      {onViewModeChange && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-xl backdrop-blur-md">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
            <span>Portal Switcher:</span>
            <span className="text-amber-400 font-mono">3-in-1 App</span>
          </div>

          <div className="grid grid-cols-3 gap-1 mt-1">
            <button
              onClick={() => onViewModeChange('customer')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition ${
                viewMode === 'customer'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold leading-tight">Customer App</span>
            </button>

            <button
              onClick={() => onViewModeChange('technician')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition ${
                viewMode === 'technician'
                  ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bike className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold leading-tight">Technician Job</span>
            </button>

            <button
              onClick={() => onViewModeChange('admin')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition ${
                viewMode === 'admin'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold leading-tight">Admin Control</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Repair Sheet Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
              Live Doorstep Job Sheet
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            Step {currentStep}/5
          </span>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          {/* Brand & Model */}
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg border ${
              modelVal || brandVal
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}>
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">
                Device / Model
              </span>
              <span className={`block font-semibold mt-0.5 truncate ${
                modelVal || brandVal ? 'text-white' : 'text-slate-400 italic'
              }`}>
                {brandVal || ''} {modelVal || (currentStep === 1 ? 'Waiting for model...' : 'Model provided')}
              </span>
            </div>
            {(modelVal || brandVal) && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            )}
          </div>

          {/* Issue & Dynamic Cost Estimate */}
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg border ${
              issueVal
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}>
              <Wrench className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">
                Repair Problem & Estimate
              </span>
              <span className={`block font-semibold mt-0.5 ${
                issueVal ? 'text-amber-300' : 'text-slate-400 italic'
              }`}>
                {issueVal || (currentStep <= 2 ? 'Pending diagnosis...' : 'Issue noted')}
              </span>
              {costVal && (
                <span className="inline-block mt-1 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] border border-emerald-500/20">
                  Est: {costVal}
                </span>
              )}
            </div>
            {issueVal && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg border ${
              timeVal || dateVal
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">
                Doorstep Schedule
              </span>
              <span className={`block font-semibold mt-0.5 ${
                timeVal || dateVal ? 'text-white' : 'text-slate-400 italic'
              }`}>
                {dateVal ? `${dateVal} ` : ''}
                {timeVal || 'Select convenient slot...'}
              </span>
            </div>
            {(timeVal || dateVal) && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            )}
          </div>

          {/* Service Address + Strict Pincode & Landmark validation status */}
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg border ${
              addressVal && pincodeVal && landmarkVal
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : addressVal
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">
                Doorstep Address (Strict Validation)
              </span>
              <span className={`block font-semibold mt-0.5 line-clamp-2 ${
                addressVal ? 'text-slate-200' : 'text-slate-400 italic'
              }`}>
                {addressVal || 'Flat, building, street...'}
              </span>

              {/* Validation Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  pincodeVal
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  PIN: {pincodeVal ? pincodeVal : 'Required (6-digit)'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  landmarkVal
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  Landmark: {landmarkVal ? landmarkVal : 'Required'}
                </span>
              </div>
            </div>
            {addressVal && pincodeVal && landmarkVal && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            )}
          </div>
        </div>

        {/* Live Estimate Highlight */}
        {costVal && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Dynamic Estimate:</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {costVal}
            </span>
          </div>
        )}
      </div>

      {/* Quick Test Demo Scenarios */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick 1-Click Test Scenarios:</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Click any sample to test the AI booking conversation instantly:
        </p>
        <div className="space-y-2">
          <button
            onClick={() => onQuickPrefill('Namaste! Mera iPhone 14 Pro hai, display crack ho gaya hai.')}
            className="w-full text-left text-xs p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition"
          >
            🍎 <strong className="text-amber-300">iPhone 14 Pro</strong> — Display cracked
          </button>
          <button
            onClick={() => onQuickPrefill('Samsung Galaxy S23 Ultra ki battery bahut jaldi drain hoti hai.')}
            className="w-full text-left text-xs p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition"
          >
            📱 <strong className="text-amber-300">Samsung S23 Ultra</strong> — Battery draining
          </button>
          <button
            onClick={() => onQuickPrefill('Flat 302, Palm Heights, Near Indiranagar Metro Station, Bangalore 560038')}
            className="w-full text-left text-xs p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition"
          >
            📍 <strong className="text-amber-300">Valid Address</strong> — With Pincode 560038 & Metro Landmark
          </button>
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/5 via-slate-900/90 to-slate-950 border border-amber-500/20 p-4 space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          QuickFix Doorstep Promise
        </h4>

        <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span><strong>30-Minute Fix:</strong> Repaired right in front of you.</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span><strong>100% Data Safe:</strong> No phone handover or reset.</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>6-Month Warranty:</strong> Certified OEM-grade parts.</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span><strong>Pay After Testing:</strong> UPI, Cash, or Cards.</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
