import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email,      setEmail]      = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading,    setLoading]    = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 800);
  };

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden" style={{ background: '#004D50' }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#006B70', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#008388', transform: 'translate(30%, 30%)' }} />

      {/* Decorative diagonal lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)',
        backgroundSize: '20px 20px',
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">

        <p className="font-sans text-[10px] tracking-[0.32em] text-brand-powder/70 uppercase font-medium mb-3">
          Newsletter
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-wider uppercase mb-3">
          Stay in Style
        </h2>

        <div className="w-10 h-[1px] bg-brand-powder/40 mx-auto mb-4" />

        <p className="font-sans text-xs sm:text-sm text-brand-powder/70 font-light mb-7 leading-relaxed max-w-md mx-auto">
          Subscribe to get special offers, new arrivals and exclusive updates — delivered straight to your inbox.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-3 bg-brand-teal/40 border border-brand-powder/20 rounded-sm px-8 py-4 fade-in-up">
            <CheckCircle size={18} strokeWidth={1.8} className="text-brand-powder" />
            <span className="font-sans text-sm text-white font-medium tracking-wide">
              Welcome to Suka Fashions! You're subscribed.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-white/10 border border-brand-powder/25 py-3.5 px-5 text-sm text-white placeholder-brand-powder/45 focus:outline-none focus:border-brand-powder/60 focus:bg-white/15 transition-all duration-300 font-sans rounded-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-white hover:bg-brand-powder text-brand-tealDark font-sans text-[10px] font-bold tracking-[0.22em] uppercase py-3.5 px-7 rounded-sm transition-all duration-300 shadow-md disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-brand-tealDark/30 border-t-brand-tealDark rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={13} strokeWidth={2} />
                  Subscribe
                </>
              )}
            </button>
          </form>
        )}

        <p className="font-sans text-[10px] text-brand-powder/35 mt-5 tracking-wide">
          No spam, ever. Unsubscribe at any time.
        </p>

      </div>
    </section>
  );
}
