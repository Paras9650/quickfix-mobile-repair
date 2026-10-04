import React from 'react';
import {
  Smartphone,
  Wrench,
  ShieldCheck,
  Clock,
  BookOpen,
  ReceiptText,
  Sparkles,
  LayoutDashboard,
  Bike,
} from 'lucide-react';
import { AppViewMode } from '../types';

interface HeaderProps {
  onOpenRateCard: () => void;
  onOpenBookings: () => void;
  bookingCount: number;
  viewMode?: AppViewMode;
  onViewModeChange?: (mode: AppViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRateCard,
  onOpenBookings,
  bookingCount,
  viewMode = 'customer',
  onViewModeChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Smartphone className="w-5 h-5" />
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border border-slate-900">
              <Wrench className="w-2.5 h-2.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Quick<span className="text-amber-400">Fix</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Hinglish AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden lg:block">
              Doorstep Mobile Repair • 30 Mins Live Fix
            </p>
          </div>
        </div>

        {/* 3-in-1 Portal Switcher in Navbar */}
        {onViewModeChange && (
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => onViewModeChange('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'customer'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer App</span>
              <span className="sm:hidden">Customer</span>
            </button>

            <button
              onClick={() => onViewModeChange('technician')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'technician'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Technician Job</span>
              <span className="sm:hidden">Tech</span>
            </button>

            <button
              onClick={() => onViewModeChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        )}

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenRateCard}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
            title="View Doorstep Repair Rates"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Rate Card</span>
          </button>

          <button
            onClick={onOpenBookings}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition shadow-sm"
            title="View Your Bookings"
          >
            <ReceiptText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bookings</span>
            {bookingCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-slate-950 text-amber-400 ml-0.5">
                {bookingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
