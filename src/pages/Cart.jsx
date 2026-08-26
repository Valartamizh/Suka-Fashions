import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { products } from '../data/products';

export default function Cart() {
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    { ...products[0], cartId: 1, quantity: 1, selectedSize: 'Free Size' },
    { ...products[1], cartId: 2, quantity: 2, selectedSize: 'Free Size' },
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(items => items.map(item => {
      if (item.cartId === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.cartId !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 1999 ? 0 : 150;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-8 pb-16 text-center">
        <div className="max-w-md mx-auto bg-brand-cream/30 border border-brand-powder/50 p-8 sm:p-10 rounded-sm">
          <p className="font-sans text-[10px] tracking-[0.25em] text-brand-teal uppercase font-semibold mb-3">
            Your Bag is Empty
          </p>
          <h2 className="font-serif text-2xl text-brand-navy font-light mb-5 uppercase tracking-wider">
            Nothing to see here yet
          </h2>
          <Link
            to="/products"
            className="inline-block bg-brand-navy text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal transition-colors rounded-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-6 sm:pt-8 pb-12 lg:pb-16">
      
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase mb-6 lg:mb-8">
        Shopping Bag <span className="font-sans text-base sm:text-xl text-brand-navy/40 ml-2">({cartItems.length})</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        
        {/* Left: Cart Items */}
        <div className="lg:w-[60%] xl:w-[65%]">
          
          {/* Free Shipping Progress */}
          <div className="bg-brand-powderLight border border-brand-powder/60 p-4 rounded-sm mb-6">
            {subtotal >= 1999 ? (
              <p className="font-sans text-[11px] text-brand-teal tracking-wide font-medium flex items-center gap-2">
                <Truck size={14} /> Congratulations! You've unlocked free shipping.
              </p>
            ) : (
              <div>
                <p className="font-sans text-[11px] text-brand-navy/70 tracking-wide mb-2">
                  Add <span className="font-semibold text-brand-navy">₹{1999 - subtotal}</span> more to unlock <span className="font-semibold text-brand-teal">Free Shipping</span>
                </p>
                <div className="w-full bg-brand-powder h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-teal h-full transition-all duration-500" 
                    style={{ width: `${Math.min((subtotal / 1999) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-brand-powder/60">
            {cartItems.map((item) => (
              <div key={item.cartId} className="flex gap-4 sm:gap-6 py-6 border-b border-brand-powder/60 relative">
                
                {/* Product Image */}
                <Link to={`/product/${item.slug}`} className="w-24 sm:w-32 flex-shrink-0 aspect-[3/4] bg-brand-cream border border-brand-powder/40 rounded-sm overflow-hidden group">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-teal block mb-1">
                        {item.category}
                      </span>
                      <Link to={`/product/${item.slug}`} className="font-serif text-lg sm:text-xl text-brand-navy hover:text-brand-teal transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                    </div>
                  </div>
                  
                  <div className="font-sans text-xs text-brand-navy/60 mb-4 space-y-1">
                    <p>Size: <span className="font-medium text-brand-navy">{item.selectedSize}</span></p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
                    
                    {/* Quantity Control */}
                    <div className="flex items-center border border-brand-powder rounded-sm bg-white h-9">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="w-8 h-full font-sans text-brand-navy/60 hover:text-brand-teal transition-colors flex items-center justify-center">-</button>
                      <span className="w-8 text-center font-sans text-xs text-brand-navy font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="w-8 h-full font-sans text-brand-navy/60 hover:text-brand-teal transition-colors flex items-center justify-center">+</button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      {item.oldPrice && (
                        <span className="font-sans text-[10px] text-brand-navy/40 line-through block mb-0.5">
                          ₹{(item.oldPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="font-sans text-base sm:text-lg font-bold text-brand-navy">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Actions (Absolute Top Right for desktop, inline for mobile if needed, keeping simple here) */}
                <div className="absolute top-6 right-0 flex flex-col gap-3">
                  <button onClick={() => removeItem(item.cartId)} className="text-brand-navy/40 hover:text-red-500 transition-colors p-1" aria-label="Remove">
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                  <button className="text-brand-navy/40 hover:text-brand-teal transition-colors p-1" aria-label="Move to wishlist">
                    <Heart size={16} strokeWidth={1.5} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-[40%] xl:w-[35%]">
          <div className="bg-brand-cream/30 border border-brand-powder/50 rounded-sm p-6 sm:p-8 sticky top-28">
            <h2 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-brand-navy mb-6 pb-4 border-b border-brand-powder/60">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-brand-powder/60">
              <div className="flex justify-between font-sans text-sm text-brand-navy/70">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-sans text-sm text-brand-navy/70">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
            </div>

            <div className="flex justify-between font-sans text-lg font-bold text-brand-navy mb-8">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white py-4 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal transition-colors rounded-sm shadow-md mb-4"
            >
              Proceed to Checkout <ArrowRight size={14} />
            </Link>

            <div className="flex items-center justify-center gap-2 text-brand-navy/50 font-sans text-[10px] uppercase tracking-wider">
              <ShieldCheck size={14} /> Secure Checkout
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
