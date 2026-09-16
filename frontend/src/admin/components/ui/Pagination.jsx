// Pagination — reusable responsive page controls
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3.5 border-t border-slate-100 bg-white rounded-b-xl">
      <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
        Showing <span className="font-semibold text-slate-800">{from}–{to}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> results
      </p>

      {/* Desktop & Tablet Page Number Buttons */}
      <div className="hidden min-[520px]:flex items-center gap-1.5 justify-center sm:justify-end">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                p === page
                  ? 'bg-[#006B70] text-white border-[#006B70] shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Compact Mobile Pagination */}
      <div className="flex min-[520px]:hidden items-center justify-between w-full pt-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <span className="text-xs font-bold text-slate-700 font-mono">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

