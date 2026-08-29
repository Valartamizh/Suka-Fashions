// StatCard — KPI card for dashboard
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StatCard({ title, value, change, changeType = 'up', icon: Icon, accent = false, subtitle, onClick, to }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (to) {
      navigate(to);
    }
  };

  const isClickable = Boolean(onClick || to);

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`bg-white rounded-xl border p-5 flex flex-col gap-3 shadow-sm transition-all duration-200 ${
        isClickable ? 'cursor-pointer hover:border-brand-teal/50 hover:shadow-md hover:-translate-y-0.5 group' : ''
      } ${
        accent ? 'border-amber-200 bg-amber-50/30 hover:border-amber-400' : 'border-slate-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-widest group-hover:text-brand-teal transition-colors">{title}</p>
          <h3 className="font-sans text-2xl font-bold text-slate-800 mt-1">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110 ${accent ? 'bg-amber-100 text-amber-600' : 'bg-brand-powder text-brand-teal'}`}>
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
