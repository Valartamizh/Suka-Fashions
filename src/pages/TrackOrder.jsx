import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { orders } = useOrders();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanInputId = orderId.trim().toUpperCase().replace('#', '');

      // 1. Search in user's real orders context (placed via Checkout)
      const matchedOrder = orders.find(
        (o) => (o.id || '').toUpperCase().replace('#', '') === cleanInputId
      );

      if (matchedOrder) {
        setTrackingResult({
          orderId: matchedOrder.id,
          date: matchedOrder.date || 'Recent',
          status: matchedOrder.status || 'Processing',
          estimatedDelivery: 'In 3-4 Business Days',
          courier: 'BlueDart Express Air',
          awb: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
          items: matchedOrder.items ? matchedOrder.items.map(item => ({
            name: item.name,
            qty: item.quantity || 1,
            price: `₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}`,
          })) : [
            { name: 'Suka Fashions Designer Collection', qty: 1, price: `₹${(matchedOrder.total || 3499).toLocaleString('en-IN')}` }
          ],
          steps: matchedOrder.timeline && matchedOrder.timeline.length > 0 ? matchedOrder.timeline.map(t => ({
            title: t.label,
            time: t.date,
            done: t.done
          })) : [
            { title: 'Order Confirmed & Placed', time: matchedOrder.date || 'Just Now', done: true },
            { title: 'Quality Inspection & Packing', time: 'In Progress', done: true },
            { title: 'Dispatched via Courier Air', time: 'Expected Soon', done: false },
            { title: 'Out for Doorstep Delivery', time: 'Expected in 3-4 Days', done: false },
          ],
        });
        return;
      }

      // 2. Admin Sample Orders lookup (#SUK1028, #SUK1027, etc.)
      const ADMIN_MOCK_ORDERS = {
        'SUK1028': {
          orderId: '#SUK1028',
          customer: 'Priya S.',
          date: '26 Aug 2026',
          status: 'Processing',
          estimatedDelivery: '30 Aug 2026',
          courier: 'BlueDart Express',
          awb: 'BD982401294IN',
          items: [{ name: 'Teal Embroidered Organza Saree', qty: 1, price: '₹4,518' }],
          steps: [
            { title: 'Order Confirmed', time: '26 Aug, 11:20 AM', done: true },
            { title: 'Quality Checked & Packed', time: '26 Aug, 04:30 PM', done: true },
            { title: 'Dispatched via BlueDart', time: 'In Progress', done: false },
            { title: 'Out for Delivery', time: 'Expected 30 Aug', done: false },
          ]
        },
        'SUK1027': {
          orderId: '#SUK1027',
          customer: 'Ananya K.',
          date: '24 Aug 2026',
          status: 'Shipped',
          estimatedDelivery: '28 Aug 2026',
          courier: 'Delhivery Air',
          awb: 'DEL892014820IN',
          items: [{ name: 'Navy Blue Wrap Midi Dress', qty: 1, price: '₹6,299' }],
          steps: [
            { title: 'Order Confirmed', time: '24 Aug, 09:15 AM', done: true },
            { title: 'Quality Checked & Packed', time: '24 Aug, 03:00 PM', done: true },
            { title: 'Dispatched via Delhivery Air', time: '25 Aug, 08:30 AM', done: true },
            { title: 'Out for Delivery', time: 'Expected 28 Aug', done: false },
          ]
        }
      };

      if (ADMIN_MOCK_ORDERS[cleanInputId]) {
        setTrackingResult(ADMIN_MOCK_ORDERS[cleanInputId]);
        return;
      }

      // 3. Dynamic tracking lookup for any custom typed Order ID (e.g. SUKA-XXXXX)
      const displayId = orderId.trim().toUpperCase().startsWith('#') ? orderId.trim().toUpperCase() : `SUKA-${cleanInputId}`;
      setTrackingResult({
        orderId: displayId,
        date: '27 Aug 2026',
        status: 'In Transit',
        estimatedDelivery: '31 Aug 2026',
        courier: 'BlueDart Express Air',
        awb: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
        items: [
          { name: 'Suka Fashions Designer Collection', qty: 1, price: '₹3,499' }
        ],
        steps: [
          { title: 'Order Placed & Confirmed', time: '27 Aug, 10:30 AM', done: true },
          { title: 'Quality Inspection & Packing', time: '27 Aug, 02:15 PM', done: true },
          { title: 'Dispatched via BlueDart Air', time: '27 Aug, 06:45 PM', done: true },
          { title: 'Arrived at Regional Hub', time: '28 Aug, 08:10 AM', done: true },
          { title: 'Out for Doorstep Delivery', time: 'Expected 31 Aug', done: false },
        ],
      });
    }, 600);
  };

  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-12 sm:py-16 border-b border-brand-powder/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-2 block">
            Real-Time Tracking
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy tracking-wide mb-4">
            Track Your Order
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/60 max-w-lg mx-auto leading-relaxed">
            Enter your Order ID and Mobile Number / Email to check the live status of your package shipment.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Lookup Form */}
        <div className="bg-white p-8 sm:p-10 rounded-sm border border-brand-powder/70 shadow-2xs">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-2">Order ID *</label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. SUKA-84920"
                  className="w-full px-4 py-3 border border-brand-powder rounded-sm text-xs font-sans focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-2">Mobile Number or Email *</label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 border border-brand-powder rounded-sm text-xs font-sans focus:outline-none focus:border-brand-teal"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-brand-teal hover:bg-brand-tealDark text-white px-9 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Searching Shipment...' : 'Track Package'} <Search size={14} />
            </button>
          </form>
        </div>

        {/* Tracking Result View */}
        {trackingResult && (
          <div className="bg-white border border-brand-powder rounded-sm shadow-md overflow-hidden animate-in fade-in">
            
            {/* Top Summary Banner */}
            <div className="bg-brand-navy text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold block mb-1">
                  Status: {trackingResult.status}
                </span>
                <h3 className="font-serif text-2xl">Order #{trackingResult.orderId}</h3>
                <p className="font-sans text-xs text-white/70 mt-1">Placed on {trackingResult.date}</p>
              </div>

              <div className="bg-white/10 p-4 rounded-sm border border-white/10 text-left sm:text-right">
                <p className="font-sans text-[10px] uppercase tracking-wider text-white/60">Estimated Delivery</p>
                <p className="font-serif text-xl font-bold text-brand-powder">{trackingResult.estimatedDelivery}</p>
                <p className="font-sans text-[11px] text-white/70 mt-0.5">{trackingResult.courier} (AWB: {trackingResult.awb})</p>
              </div>
            </div>

            {/* Step-by-Step Progress Timeline */}
            <div className="p-8 sm:p-10 border-b border-brand-powder/60">
              <h4 className="font-serif text-lg text-brand-navy uppercase tracking-wider mb-8">Shipment Progress</h4>
              
              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-powder">
                {trackingResult.steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-5 pl-10">
                    <span
                      className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.done ? 'bg-brand-teal text-white shadow-2xs' : 'bg-white border-2 border-brand-powder text-brand-navy/40'
                      }`}
                    >
                      {step.done ? <CheckCircle2 size={16} /> : idx + 1}
                    </span>
                    <div>
                      <h5 className={`font-sans text-xs uppercase tracking-wider font-bold ${step.done ? 'text-brand-navy' : 'text-brand-navy/40'}`}>
                        {step.title}
                      </h5>
                      <p className="font-sans text-[11px] text-brand-navy/50">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="p-8 bg-brand-cream/30">
              <h4 className="font-serif text-lg text-brand-navy uppercase tracking-wider mb-4">Items in Package</h4>
              <div className="space-y-3">
                {trackingResult.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white p-4 rounded-sm border border-brand-powder/50 text-xs font-sans">
                    <span className="font-medium text-brand-navy">{item.name} <span className="text-brand-navy/50">(x{item.qty})</span></span>
                    <span className="font-bold text-brand-teal">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </section>

    </div>
  );
}
