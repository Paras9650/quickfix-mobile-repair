import React, { useState } from 'react';
import { RateCardItem } from '../types';
import {
  Smartphone,
  Wrench,
  Search,
  Filter,
  Plus,
  Edit2,
  Check,
  X,
  Trash2,
  ShieldCheck,
  Clock,
  Sparkles,
  Tag,
  IndianRupee,
} from 'lucide-react';

interface DynamicRateCardManagerProps {
  rateCards: RateCardItem[];
  onUpdatePrice: (id: string, newCost: string) => void;
  onAddItem: (item: Omit<RateCardItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

export const DynamicRateCardManager: React.FC<DynamicRateCardManagerProps> = ({
  rateCards,
  onUpdatePrice,
  onAddItem,
  onDeleteItem,
}) => {
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState('');

  // Add new item form state
  const [newBrand, setNewBrand] = useState('Apple');
  const [customBrand, setCustomBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newServiceType, setNewServiceType] = useState('Display / Screen');
  const [customService, setCustomService] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newWarranty, setNewWarranty] = useState('6 Months Doorstep Warranty');
  const [newDuration, setNewDuration] = useState('30 Mins In-Front Fix');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Available brands & services for quick filters
  const uniqueBrands = ['all', ...Array.from(new Set(rateCards.map((r) => r.brand)))];
  const uniqueServices = [
    'all',
    'Display / Screen',
    'Battery Replacement',
    'Charging Port',
  ];

  // Filtering
  const filteredItems = rateCards.filter((item) => {
    const matchesBrand = brandFilter === 'all' || item.brand.toLowerCase() === brandFilter.toLowerCase();
    const matchesService =
      serviceFilter === 'all' || item.serviceType.toLowerCase().includes(serviceFilter.toLowerCase());
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.brand.toLowerCase().includes(query) ||
      item.model.toLowerCase().includes(query) ||
      item.serviceType.toLowerCase().includes(query) ||
      item.costEstimate.toLowerCase().includes(query);

    return matchesBrand && matchesService && matchesSearch;
  });

  // Sort by Brand alphabetically, then model
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.brand < b.brand) return -1;
    if (a.brand > b.brand) return 1;
    return a.model.localeCompare(b.model);
  });

  const handleStartEdit = (item: RateCardItem) => {
    setEditingId(item.id);
    setEditPriceInput(item.costEstimate);
  };

  const handleSaveEdit = (id: string) => {
    if (editPriceInput.trim()) {
      onUpdatePrice(id, editPriceInput.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrand = newBrand === 'Other' ? customBrand.trim() : newBrand;
    const finalService = newServiceType === 'Other' ? customService.trim() : newServiceType;

    if (!finalBrand || !newModel.trim() || !finalService || !newCost.trim()) {
      return;
    }

    onAddItem({
      brand: finalBrand,
      model: newModel.trim(),
      serviceType: finalService,
      costEstimate: newCost.trim().startsWith('₹') ? newCost.trim() : `₹${newCost.trim()}`,
      warranty: newWarranty.trim() || '6 Months Doorstep Warranty',
      duration: newDuration.trim() || '30 Mins In-Front Fix',
    });

    setSuccessMessage(`✅ Added ${finalBrand} ${newModel.trim()} (${finalService}) to live rate card!`);
    setTimeout(() => setSuccessMessage(null), 3500);

    // Reset fields
    setNewModel('');
    setNewCost('');
    setCustomBrand('');
    setCustomService('');
  };

  const getServiceBadgeColor = (service: string) => {
    const lower = service.toLowerCase();
    if (lower.includes('display') || lower.includes('screen')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    }
    if (lower.includes('battery')) {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
    if (lower.includes('charging') || lower.includes('port')) {
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    }
    return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-6">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Dynamic Rate Card Manager</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  {rateCards.length} Live Items
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage parts pricing across Apple, Samsung, OnePlus, Xiaomi & more. Changes reflect dynamically.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand, model, service..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide shrink-0">
              Brand:
            </span>
            {uniqueBrands.map((b) => (
              <button
                key={b}
                onClick={() => setBrandFilter(b)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 capitalize ${
                  brandFilter === b
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>

          {/* Service Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide shrink-0">
              Service:
            </span>
            {uniqueServices.map((s) => (
              <button
                key={s}
                onClick={() => setServiceFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 ${
                  serviceFilter === s
                    ? 'bg-blue-500 text-white font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s === 'all' ? 'All Services' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rate Card Table */}
      <div className="overflow-x-auto px-5">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Smartphone Model</th>
              <th className="py-3 px-4">Service Type</th>
              <th className="py-3 px-4">Estimated Cost</th>
              <th className="py-3 px-4">Warranty & Time</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No rate card items found matching current filters.
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      {item.brand}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {item.model}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border inline-flex items-center gap-1 ${getServiceBadgeColor(
                        item.serviceType
                      )}`}
                    >
                      <Wrench className="w-3 h-3" />
                      {item.serviceType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editPriceInput}
                          onChange={(e) => setEditPriceInput(e.target.value)}
                          className="w-32 px-2 py-1 bg-slate-950 border border-amber-400 rounded-lg text-emerald-400 font-bold text-xs focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="p-1 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
                          title="Save price"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="font-extrabold text-emerald-400 font-mono text-sm">
                        {item.costEstimate}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    <div>{item.warranty}</div>
                    <div className="text-[10px] text-slate-500">{item.duration}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 text-[11px] font-semibold transition border border-slate-700 flex items-center gap-1"
                        title="Edit price"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Price</span>
                      </button>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition border border-slate-700/60"
                        title="Delete item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="mx-5 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* [ADD NEW ITEM] Form */}
      <div className="p-5 sm:p-6 bg-slate-950/90 border-t border-slate-800 mx-0 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Add New Device Part / Repair Item</h4>
            <p className="text-xs text-slate-400">
              Add new phone models or custom repair services directly to the live rate card without code
            </p>
          </div>
        </div>

        <form onSubmit={handleAddNewSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Brand Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Smartphone Brand:
              </label>
              <select
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl focus:outline-none focus:border-amber-400"
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Xiaomi / Redmi">Xiaomi / Redmi</option>
                <option value="Vivo">Vivo</option>
                <option value="Realme">Realme</option>
                <option value="Google Pixel">Google Pixel</option>
                <option value="Motorola">Motorola</option>
                <option value="Nothing">Nothing</option>
                <option value="Other">Other (Custom)</option>
              </select>

              {newBrand === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="w-full mt-2 px-3 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl focus:outline-none focus:border-amber-400"
                  required
                />
              )}
            </div>

            {/* Model Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Device / Model Name:
              </label>
              <input
                type="text"
                placeholder="e.g. iPhone 16 Pro Max, Pixel 9"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            {/* Service Type Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Repair Service Type:
              </label>
              <select
                value={newServiceType}
                onChange={(e) => setNewServiceType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl focus:outline-none focus:border-amber-400"
              >
                <option value="Display / Screen">Display / Screen Replacement</option>
                <option value="Battery Replacement">Battery Replacement</option>
                <option value="Charging Port">Charging Port / Jack Repair</option>
                <option value="Back Glass / Camera">Back Glass / Camera Lens</option>
                <option value="Speaker / Mic">Ear Speaker & Mic Repair</option>
                <option value="Water Damage Treatment">Water Damage Treatment</option>
                <option value="Other">Other Service</option>
              </select>

              {newServiceType === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom service"
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  className="w-full mt-2 px-3 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl focus:outline-none focus:border-amber-400"
                  required
                />
              )}
            </div>

            {/* Estimated Cost Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Estimated Cost (INR):
              </label>
              <input
                type="text"
                placeholder="e.g. ₹2,499 - ₹3,899 or ₹1,499"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-emerald-400 font-bold text-xs rounded-xl focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Extra options + Submit Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Default: 6 Months Warranty
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Default: 30 Mins Doorstep
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-400/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Item to Live Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
