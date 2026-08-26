// StatCard — KPI card for dashboard
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType = 'up', icon: Icon, accent = false, subtitle }) {
  return (
    <div className={`bg-white rounded-xl border p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200 ${
      accent ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="font-sans text-2xl font-bold text-slate-800 mt-1">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${accent ? 'bg-amber-100 text-amber-600' : 'bg-brand-powder text-brand-teal'}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-1.5">
          {changeType === 'up' ? (
            <TrendingUp size={13} className="text-emerald-500" />
          ) : (
            <TrendingDown size={13} className="text-red-500" />
          )}
          <span className={`text-[11px] font-sans font-semibold ${
            changeType === 'up' ? 'text-emerald-600' : 'text-red-500'
          }`}>{change}</span>
        </div>
      )}
    </div>
  );
}
