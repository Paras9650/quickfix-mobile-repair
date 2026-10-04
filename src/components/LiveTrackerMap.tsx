import React, { useState, useEffect } from 'react';
import { Technician, BookingData, GpsSyncHeartbeat } from '../types';
import { Navigation, MapPin, Smartphone, Wrench, Shield, Compass, Bike, CheckCircle2, Radio, Zap } from 'lucide-react';

interface LiveTrackerMapProps {
  technicians: Technician[];
  bookings: BookingData[];
  selectedTechId?: string;
  onSelectTech?: (techId: string) => void;
  onMoveTech?: (techId: string) => void;
  lastGpsHeartbeat?: GpsSyncHeartbeat | null;
}

export const LiveTrackerMap: React.FC<LiveTrackerMapProps> = ({
  technicians,
  bookings,
  selectedTechId,
  onSelectTech,
  onMoveTech,
  lastGpsHeartbeat,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'enroute' | 'active'>('all');
  const [isSyncFlashing, setIsSyncFlashing] = useState<boolean>(false);

  // Flash green location-sync indicator whenever a heartbeat arrives
  useEffect(() => {
    if (lastGpsHeartbeat) {
      setIsSyncFlashing(true);
      const timer = setTimeout(() => setIsSyncFlashing(false), 3800);
      return () => clearTimeout(timer);
    }
  }, [lastGpsHeartbeat?.timestamp]);

  const activeBookings = bookings.filter((b) => b.status !== 'Completed');

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Map Header Toolbar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Compass className="w-5 h-5 animate-spin [animation-duration:12s]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Live Doorstep GPS Radar & Fleet Map
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 5Hz Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time technician movement, route vectors & doorstep customer pins
            </p>
          </div>
        </div>

        {/* Legend / Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>Technicians ({technicians.length})</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Customer Sites ({activeBookings.length})</span>
          </div>
        </div>
      </div>

      {/* SVG City Radar Map Canvas */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-950 overflow-hidden select-none">
        {/* Flashing Green Location-Sync Indicator (Proves Heartbeat Link Works) */}
        {isSyncFlashing && lastGpsHeartbeat && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-emerald-950/95 border-2 border-emerald-400 text-emerald-300 text-xs font-extrabold shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 backdrop-blur-md animate-bounce">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="font-mono">
              🟢 GPS HEARTBEAT SYNCED: {lastGpsHeartbeat.techName} moved {lastGpsHeartbeat.distanceDeltaMeters}m closer! Coords: ({lastGpsHeartbeat.newCoords.x}%, {lastGpsHeartbeat.newCoords.y}%)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-mono">
              12ms Ping
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1,1" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="#020617" />
          <rect width="100" height="100" fill="url(#gridPattern)" opacity="0.7" />

          {/* Simulated Major Roads & Expressways */}
          {/* Ring Road */}
          <ellipse cx="50" cy="50" rx="36" ry="32" fill="none" stroke="#1e293b" strokeWidth="1.2" />
          <ellipse cx="50" cy="50" rx="36" ry="32" fill="none" stroke="#334155" strokeWidth="0.4" strokeDasharray="2,2" />

          {/* Primary Arterial Roads */}
          <line x1="0" y1="35" x2="100" y2="35" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="0" y1="65" x2="100" y2="65" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="30" y1="0" x2="30" y2="100" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="70" y1="0" x2="70" y2="100" stroke="#1e293b" strokeWidth="1.5" />
          {/* Diagonal Flyover */}
          <line x1="10" y1="90" x2="90" y2="10" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="10" y1="90" x2="90" y2="10" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3" />

          {/* Sector / Zone Labels on Map */}
          <text x="25" y="15" fill="#475569" fontSize="2.8" fontWeight="600" opacity="0.7">NORTH ZONE</text>
          <text x="72" y="20" fill="#475569" fontSize="2.8" fontWeight="600" opacity="0.7">TECH CORRIDOR</text>
          <text x="18" y="78" fill="#475569" fontSize="2.8" fontWeight="600" opacity="0.7">METRO STATION</text>
          <text x="68" y="82" fill="#475569" fontSize="2.8" fontWeight="600" opacity="0.7">CENTRAL BUSINESS</text>

          {/* Active Route Connecting Technician to Assigned Customer */}
          {technicians.map((t) => {
            const assignedBooking = bookings.find((b) => b.bookingId === t.currentBookingId);
            if (!assignedBooking || !assignedBooking.customerCoords) return null;
            const target = assignedBooking.customerCoords;

            return (
              <g key={`route-${t.id}`}>
                <line
                  x1={t.coords.x}
                  y1={t.coords.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="url(#routeGradient)"
                  strokeWidth="0.8"
                  strokeDasharray="2,1.5"
                  className="animate-pulse"
                />
              </g>
            );
          })}

          {/* Customer Booking Pins */}
          {activeBookings.map((b) => {
            const coords = b.customerCoords || { x: 50, y: 50 };
            const isCompleted = b.status === 'Completed' || b.status === 'Paid';

            return (
              <g
                key={`cust-${b.bookingId}`}
                className="cursor-pointer transition-transform hover:scale-125"
                transform={`translate(${coords.x}, ${coords.y})`}
              >
                {/* Glow ring */}
                <circle r="3.2" fill="#f59e0b" fillOpacity="0.15" />
                <circle r="2.2" fill="#f59e0b" fillOpacity="0.3" className="animate-ping" />
                {/* Pin Head */}
                <circle r="1.6" fill={isCompleted ? '#10b981' : '#f59e0b'} stroke="#ffffff" strokeWidth="0.4" />
                {/* Label */}
                <text
                  x="2.4"
                  y="0.8"
                  fill="#f8fafc"
                  fontSize="2.4"
                  fontWeight="bold"
                  className="drop-shadow"
                >
                  {b.bookingId} ({b.Brand})
                </text>
              </g>
            );
          })}

          {/* Technician Live Markers */}
          {technicians.map((t) => {
            const isSelected = selectedTechId === t.id;
            const isEnRoute = t.status === 'EnRoute';

            return (
              <g
                key={`tech-${t.id}`}
                className="cursor-pointer transition-all duration-300"
                transform={`translate(${t.coords.x}, ${t.coords.y})`}
                onClick={() => onSelectTech && onSelectTech(t.id)}
              >
                {/* Radar sweep ring for en route techs */}
                {isEnRoute && (
                  <circle
                    r="4.5"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="0.4"
                    strokeOpacity="0.6"
                    className="animate-ping"
                  />
                )}
                {/* Selected Halo */}
                {isSelected && (
                  <circle r="3.6" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
                )}
                {/* Marker Body */}
                <circle
                  r="2.2"
                  fill={isEnRoute ? '#0284c7' : t.status === 'Repairing' ? '#eab308' : '#10b981'}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                {/* Tech Name Label */}
                <rect
                  x="-7"
                  y="-5.5"
                  width="14"
                  height="3.2"
                  rx="0.8"
                  fill="#0f172a"
                  fillOpacity="0.85"
                  stroke="#334155"
                  strokeWidth="0.2"
                />
                <text
                  x="0"
                  y="-3.4"
                  fill="#ffffff"
                  fontSize="2"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  🚴 {t.name.split(' ')[0]} ({t.status})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick GPS Simulation Control */}
        <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-300">
            <Bike className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white">Rahul Kumar</span>
            <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded font-mono">
              En Route
            </span>
          </div>

          {onMoveTech && (
            <button
              onClick={() => onMoveTech('tech-1')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/30"
              title="Simulate 50m GPS step closer to customer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Simulate GPS Move</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
