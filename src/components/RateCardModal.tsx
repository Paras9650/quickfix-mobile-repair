import React, { useState } from 'react';
import { X, Smartphone, BatteryCharging, Zap, Camera, Volume2, Droplets, ShieldCheck, Clock, Check, Tag } from 'lucide-react';
import { REPAIR_SERVICES, POPULAR_PHONES } from '../data/rateCard';
import { RateCardItem } from '../types';

interface RateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceName: string) => void;
  rateCards?: RateCardItem[];
}

export const RateCardModal: React.FC<RateCardModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  rateCards = [],
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'models'>('services');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  if (!isOpen) return null;

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-amber-400" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-blue-400" />;
      case 'Volume2':
        return <Volume2 className="w-5 h-5 text-purple-400" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      default:
        return <Smartphone className="w-5 h-5 text-amber-400" />;
    }
  };

  const filteredRateCards = rateCards.filter(
    (r) => selectedBrand === 'all' || r.brand.toLowerCase() === selectedBrand.toLowerCase()
  );

  const uniqueBrands = ['all', ...Array.from(new Set(rateCards.map((r) => r.brand)))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Doorstep Rate Card & Parts Catalog</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Certified repairs at your home • Zero hidden charges • 6-Month Warranty
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'services'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Service Categories
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'models'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Live Model Rate Card ({rateCards.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'services' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REPAIR_SERVICES.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          {getServiceIcon(s.icon)}
                        </div>
                        <span className="text-xs font-extrabold text-emerald-400 font-mono">
                          {s.basePrice}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-white mt-3">
                        {s.name}
                      </h3>
                      <div className="text-xs text-amber-400/90 font-medium">
                        {s.hindiName}
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {s.duration}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {s.warranty} Warranty
                      </span>
                      <button
                        onClick={() => {
                          onSelectService(`Mera phone repair karwana hai: ${s.name}`);
                          onClose();
                        }}
                        className="text-xs px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Popular Supported Brands */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Popular Supported Phone Models
                </h4>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_PHONES.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectService(`Mera smartphone ${p.brand} ${p.model} hai.`);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition"
                    >
                      {p.brand} {p.model}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Live Model Rate Card Tab */
            <div className="space-y-4">
              {/* Brand Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {uniqueBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize shrink-0 transition ${
                      selectedBrand === b
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {b === 'all' ? 'All Brands' : b}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRateCards.map((rc) => (
                  <div
                    key={rc.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-amber-400/40 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          {rc.brand}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {rc.model}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 font-medium">
                        {rc.serviceType}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {rc.warranty} • {rc.duration}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-emerald-400 font-mono">
                        {rc.costEstimate}
                      </div>
                      <button
                        onClick={() => {
                          onSelectService(`Mera ${rc.brand} ${rc.model} hai aur ${rc.serviceType} karwana hai.`);
                          onClose();
                        }}
                        className="mt-1 text-[11px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 font-bold transition"
                      >
                        Book This
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
