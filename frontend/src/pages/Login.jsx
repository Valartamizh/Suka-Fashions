import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthFashionPanel from '../components/auth/AuthFashionPanel';
import PhoneLoginForm from '../components/auth/PhoneLoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import OtpVerification from '../components/auth/OtpVerification';

export default function Login() {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [newUserData, setNewUserData] = useState({ name: 'Pooja', email: 'pooja@example.com' });
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const handleSendOtp = (data) => {
    const enteredPhone = typeof data === 'object' ? data.phone : data;
    setPhone(enteredPhone);

    if (data?.name) {
      setNewUserData({
        name: data.name,
        email: data.email || 'customer@example.com',
      });
    }

    setStep('otp');
  };

  const handleOtpSuccess = () => {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;
    login(formattedPhone, newUserData.name, newUserData.email);
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-b from-brand-cream/30 via-white to-brand-powderLight/20 py-4 sm:py-6 px-3 sm:px-6 lg:px-10 flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">

      {/* Top Header with Back Button */}
      <div className="w-full max-w-[1100px] mx-auto flex items-center justify-start mb-3 animate-in fade-in duration-300">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-brand-powder/80 text-brand-navy hover:text-brand-teal hover:border-brand-teal text-xs font-sans font-semibold shadow-2xs transition-all duration-200 cursor-pointer group"
          aria-label="Back to Store"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      {/* Top Luxury Banner / Tagline Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 animate-in fade-in slide-in-from-top-3 duration-500">
        <span className="font-sans text-[9.5px] tracking-[0.35em] text-brand-teal uppercase font-extrabold bg-brand-powderLight/80 border border-brand-powder/60 px-4 py-1.5 rounded-full inline-block mb-2 shadow-2xs">
          SUKA FASHIONS PRIVILEGE CLUB
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light tracking-wide">
          {authMode === 'register' ? 'Join Our Exclusive Atelier' : 'Welcome to Your Exclusive Storefront'}
        </h1>
        <p className="font-sans text-xs text-brand-navy/60 font-light mt-1 tracking-wide">
          {authMode === 'register'
            ? 'Create your customer account to unlock personalized styling & priority dispatch.'
            : 'Sign in to save your wishlist, track orders live, & unlock instant member discounts.'
          }
        </p>
      </div>

      <div className="max-w-[1100px] w-full mx-auto bg-white border border-brand-powder/60 rounded-2xl shadow-[0_16px_48px_-12px_rgba(0,107,112,0.12)] lg:flex flex-col md:flex-row overflow-hidden transition-all lg:min-h-[720px] select-none">
        {/* Left Side: Fashion Photography Panel (Desktop) */}
        <AuthFashionPanel />

        {/* Right Side: Authentication Form (Phone / Register / OTP) */}
        <div className="w-full md:w-1/2 lg:w-[58%] flex flex-col bg-white">

          {/* Top Auth Mode Toggle Tabs (Shown during input step) */}
          {step === 'phone' && (
            <div className="flex border-b border-brand-powder/60 bg-brand-cream/20">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3.5 font-sans text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer ${authMode === 'login'
                  ? 'border-brand-teal text-brand-teal bg-white shadow-2xs'
                  : 'border-transparent text-brand-navy/50 hover:text-brand-navy'
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3.5 font-sans text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer ${authMode === 'register'
                  ? 'border-brand-teal text-brand-teal bg-white shadow-2xs'
                  : 'border-transparent text-brand-navy/50 hover:text-brand-navy'
                  }`}
              >
                Register New User
              </button>
            </div>
          )}

          <div className="flex-1 flex items-center">
            {step === 'otp' ? (
              <OtpVerification
                phone={phone}
                onChangePhone={() => setStep('phone')}
                onSuccess={handleOtpSuccess}
              />
            ) : authMode === 'register' ? (
              <RegisterForm
                onSendOtp={handleSendOtp}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            ) : (
              <PhoneLoginForm
                onSendOtp={handleSendOtp}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
