import React, { useState } from 'react';
import { BookingData, Technician, PaymentRecord, BookingStatus, RateCardItem, GpsSyncHeartbeat } from '../types';
import { LiveTrackerMap } from './LiveTrackerMap';
import { DynamicRateCardManager } from './DynamicRateCardManager';
import { mockDatabase } from '../data/mockDatabase';
import {
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Clock,
  Navigation,
  Wrench,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  Bike,
  Activity,
  ArrowRight,
  RefreshCw,
  MapPin,
  ExternalLink,
  Tag,
} from 'lucide-react';

interface AdminPanelProps {
  bookings: BookingData[];
  technicians: Technician[];
  payments: PaymentRecord[];
  rateCards: RateCardItem[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onMoveTech: (techId: string) => void;
  onUpdateRateCardPrice: (id: string, newCost: string) => void;
  onAddRateCardItem: (item: Omit<RateCardItem, 'id'>) => void;
  onDeleteRateCardItem: (id: string) => void;
  lastGpsHeartbeat?: GpsSyncHeartbeat | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  bookings,
  technicians,
  payments,
  rateCards,
  onUpdateStatus,
  onMoveTech,
  onUpdateRateCardPrice,
  onAddRateCardItem,
  onDeleteRateCardItem,
  lastGpsHeartbeat,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechId, setSelectedTechId] = useState<string>('tech-1');

  // Compute metrics
  const totalBookings = bookings.length;
  const activeRepairs = bookings.filter((b) => b.status === 'EnRoute' || b.status === 'Repairing').length;
  const completedBookings = bookings.filter((b) => b.status === 'Completed' || b.status === 'Paid').length;
  const availableTechs = technicians.filter((t) => t.status === 'Available').length;

  const totalRevenue = payments.reduce((acc, curr) => {
    const num = parseInt(curr.amount.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + num;
  }, 0);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      b.bookingId.toLowerCase().includes(query) ||
      b.Brand.toLowerCase().includes(query) ||
      b.Model.toLowerCase().includes(query) ||
      (b.customerName && b.customerName.toLowerCase().includes(query)) ||
      b.Address.toLowerCase().includes(query) ||
      b.AssignedTechnician.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'EnRoute':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 animate-pulse">
            <Navigation className="w-3 h-3" />
            En Route
          </span>
        );
      case 'Repairing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            Repairing
          </span>
        );
      case 'Completed':
      case 'Paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {status === 'Paid' ? 'Paid & Complete' : 'Completed'}
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Bookings</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{totalBookings}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+{completedBookings} Completed</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Repairs</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-400 mt-2">{activeRepairs}</div>
          <div className="text-[11px] text-slate-400 mt-1">Live Doorstep Dispatches</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Techs On Duty</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {technicians.length} <span className="text-xs font-normal text-slate-400">({availableTechs} Free)</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Rahul & Amit online</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Revenue (INR)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{payments.length} Settled Transactions</div>
        </div>
      </div>

      {/* SECTION 1: Live Tracker Map */}
      <div className="space-y-2">
        <LiveTrackerMap
          technicians={technicians}
          bookings={bookings}
          selectedTechId={selectedTechId}
          onSelectTech={(id) => setSelectedTechId(id)}
          onMoveTech={onMoveTech}
          lastGpsHeartbeat={lastGpsHeartbeat}
        />
      </div>

      {/* SECTION 2: Data Table with Quick Status-Action Buttons */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Doorstep Job Registry & Status Actions</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {filteredBookings.length} Orders
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant toggles between Pending, EnRoute, Repairing, and Completed
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, phone, customer..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {['all', 'Pending', 'EnRoute', 'Repairing', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition capitalize ${
                    statusFilter === tab
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer & Phone</th>
                <th className="py-3 px-4">Device & Problem</th>
                <th className="py-3 px-4">Address & PIN</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-center">Quick Status Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {b.bookingId}
                      {b.securityOtp && (
                        <div className="text-[10px] text-slate-400 font-mono">OTP: {b.securityOtp}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{b.customerName || 'Customer'}</div>
                      <div className="text-[11px] text-slate-400">{b.phone || '+91 98765 00000'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">
                        {b.Brand} {b.Model}
                      </div>
                      <div className="text-[11px] text-amber-300 line-clamp-1">{b.Issue}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="line-clamp-1 text-slate-300">{b.Address}</div>
                      <div className="text-[10px] text-slate-400">
                        PIN: <strong className="text-slate-300">{b.Pincode}</strong> • {b.Landmark}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {b.CostEstimate}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="font-medium text-white">{b.AssignedTechnician}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(b.status)}
                    </td>
                    {/* Quick Status Action Buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onUpdateStatus(b.bookingId, 'Pending')}
                          title="Set to Pending"
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                            b.status === 'Pending'
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => onUpdateStatus(b.bookingId, 'EnRoute')}
                          title="Set to En Route"
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                            b.status === 'EnRoute'
                              ? 'bg-blue-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          EnRoute
                        </button>
                        <button
                          onClick={() => onUpdateStatus(b.bookingId, 'Repairing')}
                          title="Set to Repairing"
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                            b.status === 'Repairing'
                              ? 'bg-purple-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          Repairing
                        </button>
                        <button
                          onClick={() => onUpdateStatus(b.bookingId, 'Completed')}
                          title="Set to Completed"
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                            b.status === 'Completed' || b.status === 'Paid'
                              ? 'bg-emerald-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          Complete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Dynamic Rate Card Manager (Sorted by Brand, with Edit Price & Add Item Form) */}
      <DynamicRateCardManager
        rateCards={rateCards}
        onUpdatePrice={onUpdateRateCardPrice}
        onAddItem={onAddRateCardItem}
        onDeleteItem={onDeleteRateCardItem}
      />
    </div>
  );
};
