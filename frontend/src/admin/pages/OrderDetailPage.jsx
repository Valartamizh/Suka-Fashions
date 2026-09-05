// OrderDetailPage — /admin/orders/:id
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Package, ChevronRight, CheckCircle, Edit2 } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useOrders } from '../../context/OrderContext';
import OrderFormModal from '../components/orders/OrderFormModal';

const STATUS_FLOW = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminOrders, updateAdminOrder } = useOrders();

  const order = adminOrders.find(o => o.id === id);
  const [cancelModal, setCancelModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Order not found.</p>
        <Link to="/admin/orders" className="text-brand-teal font-semibold mt-2 block">Back to Orders</Link>
      </div>
    );
  }

  const currentStatus = order.status || 'pending';
  const currentIdx = STATUS_FLOW.indexOf(currentStatus);

  const advance = () => {
    if (currentIdx < STATUS_FLOW.length - 1) {
      const next = STATUS_FLOW[currentIdx + 1];
      updateAdminOrder(order.id, { status: next, timelineNote: `Marked as ${next} by Admin` });
    }
  };

  const nextStatus = STATUS_FLOW[currentIdx + 1];

  const handleSaveEdit = (updatedData) => {
    updateAdminOrder(order.id, updatedData);
  };

  return (
    <div className="space-y-5">
      {/* Back & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-slate-800 text-lg">Order #{order.id}</h1>
              {order.orderSource === 'WhatsApp' && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  WhatsApp Order
                </span>
              )}
              <StatusBadge status={currentStatus} size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Placed on {order.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Edit2 size={13} className="text-brand-teal" />
            <span>Edit Order</span>
          </button>

          {['cancelled', 'delivered', 'returned', 'refunded'].includes(currentStatus) ? null : (
            <>
              {nextStatus && (
                <button
                  onClick={advance}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-lg transition-colors capitalize shadow-sm shadow-brand-teal/20"
                >
                  Mark as {nextStatus} <ChevronRight size={13} />
                </button>
              )}
              {currentStatus !== 'delivered' && (
                <button
                  onClick={() => setCancelModal(true)}
                  className="px-3.5 py-2 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </>
          )}
        </div>
      </div>


      {/* Status timeline */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
        <h3 className="font-sans font-bold text-slate-800 text-sm mb-4">Order Timeline</h3>
        <div className="overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-0 min-w-[340px]">
            {STATUS_FLOW.map((s, i) => {
              const done = STATUS_FLOW.indexOf(currentStatus) >= i;
              const current = currentStatus === s;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      done
                        ? 'bg-brand-teal border-brand-teal text-white'
                        : 'border-slate-200 text-slate-300 bg-white'
                    } ${current ? 'ring-4 ring-brand-teal/20' : ''}`}>
                      {done ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <span className={`text-[9px] font-semibold mt-1.5 capitalize whitespace-nowrap ${done ? 'text-brand-teal' : 'text-slate-400'}`}>
                      {s}
                    </span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition-all ${STATUS_FLOW.indexOf(currentStatus) > i ? 'bg-brand-teal' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* History log */}
        <div className="mt-5 space-y-2">
          {order.timeline.map((t, i) => (
            <div key={i} className="flex gap-3 text-xs">
              <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t.time}</span>
              <span className="font-semibold text-slate-700 capitalize">{t.status}:</span>
              <span className="text-slate-500">{t.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-800 text-sm">Order Items</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 px-5 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    {(item.sku || item.productId) && (
                      <span className="inline-block font-mono text-[10px] text-brand-navy bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mb-1 font-semibold">
                        SKU: {item.sku || item.productId}
                      </span>
                    )}
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.variant}</p>
                    <p className="text-xs text-slate-500 mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-800 text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-400 mt-0.5">₹{item.price.toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30">
              <div className="space-y-2 text-sm">
                {[
                  ['Subtotal', `₹${order.subtotal.toLocaleString('en-IN')}`],
                  ['Discount', order.discount ? `-₹${order.discount.toLocaleString('en-IN')}` : '—'],
                  ['Shipping', order.shipping ? `₹${order.shipping.toLocaleString('en-IN')}` : 'Free'],
                  ['Tax', `₹${order.tax.toLocaleString('en-IN')}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-500">{label}</span>
                    <span className={`text-slate-700 ${label === 'Discount' ? 'text-emerald-600' : ''}`}>{val}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-slate-800 text-base">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Customer info */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-sans font-bold text-slate-800 text-sm mb-3">Customer</h3>
            <div className="space-y-2.5">
              <div>
                <p className="font-semibold text-slate-800">{order.customer.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{order.customer.id}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={12} className="text-slate-400" />
                {order.customer.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="text-slate-400">@</span>
                {order.customer.email}
              </div>
              <Link
                to={`/admin/customers/${order.customer.id}`}
                className="text-xs font-semibold text-brand-teal hover:underline"
              >
                View customer profile →
              </Link>
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-sans font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-slate-400" />
              Delivery Address
            </h3>
            <div className="text-sm text-slate-600 space-y-0.5">
              <p>{order.address.line1}</p>
              <p>{order.address.city}, {order.address.state}</p>
              <p className="font-mono text-xs text-slate-400">{order.address.pincode}</p>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-sans font-bold text-slate-800 text-sm mb-3">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={() => {
          updateAdminOrder(order.id, { status: 'cancelled', timelineNote: 'Order cancelled by Admin' });
          setCancelModal(false);
        }}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? The customer will be notified and a refund will be initiated if payment was received."
        confirmLabel="Cancel Order"
        variant="danger"
      />

      {/* Edit Order Modal */}
      <OrderFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialOrder={order}
        nextOrderId={order.id}
      />
    </div>
  );
}
