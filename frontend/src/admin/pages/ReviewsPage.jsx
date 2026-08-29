// ReviewsPage — /admin/reviews
import React, { useState, useMemo } from 'react';
import { Star, CheckCircle, XCircle, Trash2, RotateCcw, Eye, Home } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import { adminReviews as initialReviews } from '../data/adminReviews';

const TABS = ['All', 'Pending Approval', 'Approved', 'Rejected', 'Deleted', 'Homepage Reviews'];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={11}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState('All');
  const [deleteModal, setDeleteModal] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const filtered = useMemo(() => {
    switch (tab) {
      case 'Pending Approval': return reviews.filter(r => r.status === 'pending');
      case 'Approved': return reviews.filter(r => r.status === 'approved');
      case 'Rejected': return reviews.filter(r => r.status === 'rejected');
      case 'Deleted': return reviews.filter(r => r.status === 'deleted');
      case 'Homepage Reviews': return reviews.filter(r => r.homepageFeatured).sort((a, b) => (a.homepageOrder || 99) - (b.homepageOrder || 99));
      default: return reviews.filter(r => r.status !== 'deleted');
    }
  }, [reviews, tab]);

  const tabCount = (t) => {
    switch (t) {
      case 'Pending Approval': return reviews.filter(r => r.status === 'pending').length;
      case 'Approved': return reviews.filter(r => r.status === 'approved').length;
      case 'Rejected': return reviews.filter(r => r.status === 'rejected').length;
      case 'Deleted': return reviews.filter(r => r.status === 'deleted').length;
      case 'Homepage Reviews': return reviews.filter(r => r.homepageFeatured).length;
      default: return reviews.filter(r => r.status !== 'deleted').length;
    }
  };

  const updateStatus = (id, status) => setReviews(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  const toggleHomepage = (id) => setReviews(rs => rs.map(r => r.id === id ? { ...r, homepageFeatured: !r.homepageFeatured } : r));
  const deleteReview = (id) => updateStatus(id, 'deleted');
  const restoreReview = (id) => updateStatus(id, 'pending');

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Reviews" subtitle="Manage customer reviews and homepage testimonials." />

      {/* Tab bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <div className="flex border-b border-slate-100 min-w-max">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-all ${
                tab === t ? 'text-brand-teal border-brand-teal' : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {t}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                tab === t ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tabCount(t)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Homepage reviews reorder */}
      {tab === 'Homepage Reviews' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">Homepage Testimonial Order</p>
          <p className="text-xs text-amber-700">These reviews appear in the Testimonials section on the customer homepage. Drag to reorder (available in full implementation).</p>
        </div>
      )}

      {/* Reviews table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-slate-400">No reviews in this category.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(review => (
              <div key={review.id} className="px-5 py-5 hover:bg-slate-50/40 transition-colors">
                <div className="flex gap-4">
                  {/* Review content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-3 mb-2">
                      {/* Customer avatar */}
                      <div className="w-9 h-9 bg-brand-powder rounded-full flex items-center justify-center text-brand-teal font-bold text-sm flex-shrink-0">
                        {review.customerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-800 text-sm">{review.customerName}</span>
                          <StarRating rating={review.rating} />
                          <span className="text-[10px] font-bold text-amber-600">{review.rating}.0</span>
                          <StatusBadge status={review.status} />
                          {review.homepageFeatured && (
                            <span className="text-[10px] font-bold text-brand-teal bg-brand-powder px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Home size={9} /> Homepage
                              {review.homepageOrder && ` #${review.homepageOrder}`}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          On <span className="font-semibold text-slate-600">{review.productName}</span> · {review.date}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed ml-12 mt-1">{review.review}</p>

                    {/* Review images */}
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mt-2.5 ml-12">
                        {review.images.map((img, i) => (
                          <img key={i} src={img} alt="Review" className="w-12 h-12 object-cover rounded-lg border border-slate-100" />
                        ))}
                      </div>
                    )}

                    {/* Admin note */}
                    {review.adminNote && (
                      <div className="ml-12 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
                        <span className="font-bold">Note:</span> {review.adminNote}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(review.id, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(review.id, 'rejected')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => updateStatus(review.id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    )}
                    {review.status === 'rejected' && (
                      <button
                        onClick={() => updateStatus(review.id, 'approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                    )}
                    {review.status === 'deleted' ? (
                      <button
                        onClick={() => restoreReview(review.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        <RotateCcw size={12} /> Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => setDeleteModal(review)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => toggleHomepage(review.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap border ${
                          review.homepageFeatured
                            ? 'border-brand-teal/30 bg-brand-powder text-brand-teal hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                            : 'border-slate-200 text-slate-500 hover:bg-brand-powder hover:text-brand-teal hover:border-brand-teal/30'
                        }`}
                      >
                        <Home size={12} />
                        {review.homepageFeatured ? 'Remove' : 'Feature'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => { deleteReview(deleteModal.id); setDeleteModal(null); }}
        title="Delete Review"
        message="Are you sure you want to delete this review? It can be restored later."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
