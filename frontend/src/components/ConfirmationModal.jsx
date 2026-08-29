import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title = 'Are you sure?',
  message = 'Do you really want to proceed with this action? This cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const isDanger = type === 'danger';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div 
        className="relative bg-white rounded-md shadow-2xl w-full max-w-md p-6 sm:p-7 text-left border border-brand-powder/60 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close confirmation"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDanger ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            <AlertTriangle size={22} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="font-serif text-xl font-medium text-brand-navy mb-1.5">
              {title}
            </h3>
            <p className="font-sans text-xs text-brand-navy/70 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-brand-powder/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-brand-powder text-brand-navy font-sans text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-2.5 text-white font-sans text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' 
                : 'bg-brand-teal hover:bg-brand-tealDark shadow-brand-teal/20'
            }`}
          >
            <Check size={14} /> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
