// StatusBadge — reusable status indicator pill
import React from 'react';

const variantMap = {
  // Order statuses
  pending:       'bg-amber-50 text-amber-700 border-amber-200',
  processing:    'bg-blue-50 text-blue-700 border-blue-200',
  confirmed:     'bg-teal-50 text-teal-700 border-teal-200',
  packed:        'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped:       'bg-violet-50 text-violet-700 border-violet-200',
  delivered:     'bg-green-50 text-green-700 border-green-200',
  cancelled:     'bg-red-50 text-red-700 border-red-200',
  returned:      'bg-orange-50 text-orange-700 border-orange-200',
  refunded:      'bg-pink-50 text-pink-700 border-pink-200',
  // Payment statuses
  paid:          'bg-green-50 text-green-700 border-green-200',
  failed:        'bg-red-50 text-red-700 border-red-200',
  // Product statuses
  active:        'bg-green-50 text-green-700 border-green-200',
  draft:         'bg-slate-50 text-slate-600 border-slate-200',
  archived:      'bg-stone-50 text-stone-600 border-stone-200',
  'out-of-stock':'bg-red-50 text-red-700 border-red-200',
  // Stock statuses
  'in-stock':    'bg-green-50 text-green-700 border-green-200',
  'low-stock':   'bg-amber-50 text-amber-700 border-amber-200',
  // User statuses
  inactive:      'bg-slate-50 text-slate-500 border-slate-200',
  // Review statuses
  approved:      'bg-green-50 text-green-700 border-green-200',
  rejected:      'bg-red-50 text-red-700 border-red-200',
  deleted:       'bg-red-50 text-red-800 border-red-300',
};

const labelMap = {
  'out-of-stock': 'Out of Stock',
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const classes = variantMap[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  const label = labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center border rounded-full font-sans font-semibold tracking-wide ${
      size === 'sm' ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1'
    } ${classes}`}>
      {label}
    </span>
  );
}
