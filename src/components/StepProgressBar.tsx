import React from 'react';
import { Smartphone, AlertTriangle, Calendar, CheckCircle, Award } from 'lucide-react';
import { StepNumber } from '../types';

interface StepProgressBarProps {
  currentStep: StepNumber;
}

const STEPS = [
  {
    step: 1,
    title: 'Brand & Model',
    hinglish: 'फोन का मॉडल',
    icon: Smartphone,
  },
  {
    step: 2,
    title: 'Issue & Quote',
    hinglish: 'समस्या और एस्टीमेट',
    icon: AlertTriangle,
  },
  {
    step: 3,
    title: 'Slot & Address',
    hinglish: 'टाइम और पता',
    icon: Calendar,
  },
  {
    step: 4,
    title: 'Summary',
    hinglish: 'कन्फर्मेशन समरी',
    icon: CheckCircle,
  },
  {
    step: 5,
    title: 'Confirmed',
    hinglish: 'बुकिंग कन्फर्म',
    icon: Award,
  },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        {/* Step Numbers & Labels */}
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
          {/* Active Fill Line */}
          <div
            className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 -z-0"
            style={{
              width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 100))}%`,
              maxWidth: 'calc(100% - 3rem)',
            }}
          />

          {STEPS.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const Icon = s.icon;

            return (
              <div
                key={s.step}
                className="relative z-10 flex flex-col items-center group cursor-default"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 shadow-md shadow-amber-500/20'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30 scale-110 shadow-lg shadow-amber-500/30 font-extrabold animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="mt-1.5 text-center">
                  <div
                    className={`text-[11px] font-semibold tracking-tight transition-colors ${
                      isCurrent
                        ? 'text-amber-400 font-bold'
                        : isCompleted
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{s.title}</span>
                    <span className="sm:hidden text-[10px]">Step {s.step}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 hidden md:block">
                    {s.hinglish}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
