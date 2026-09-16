import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import OtpInput from './OtpInput';
import logo from '../../assets/logo.jpg';

export default function OtpVerification({ phone, onChangePhone, onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resentMsg, setResentMsg] = useState(false);

  // Mask phone number: e.g., 9876543210 -> +91 98••• ••210
  const maskedPhone = phone.length === 10
    ? `+91 ${phone.slice(0, 2)}••• ••${phone.slice(7)}`
    : `+91 ${phone}`;

  // Countdown timer effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(30);
    setResentMsg(true);
    setTimeout(() => setResentMsg(false), 3000);
  };

  const fullOtp = otp.join('');
  const isValidOtp = fullOtp.length === 6;

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    if (!isValidOtp) return;

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Dummy OTP validation: 123456
      if (fullOtp === '123456') {
        onSuccess();
      } else {
        setError('The OTP you entered is incorrect. Please try again.');
      }
    }, 500);
  };

  return (
    <div className="w-full h-full min-h-0 sm:min-h-[560px] lg:min-h-[640px] flex flex-col justify-between p-4 sm:p-10 lg:p-12 text-left self-stretch animate-in fade-in duration-300">

      <div>
        {/* Header with back arrow and Logo */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <button
            type="button"
            onClick={onChangePhone}
            className="flex items-center gap-1.5 font-sans text-xs text-brand-navy/70 hover:text-brand-teal font-semibold transition-colors bg-brand-powderLight px-3 py-1 rounded-full border border-brand-powder/60"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full p-0.5 border-2 border-brand-teal/30 shadow-md bg-white flex items-center justify-center">
            <img src={logo} alt="Suka Logo" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>

        {/* Heading & Target Phone */}
        <div className="mb-6">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] font-extrabold text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full inline-block mb-2">
            ✦ STEP 2 OF 2: VERIFICATION ✦
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light mb-1.5">
            Verify Your Mobile Number
          </h1>
          <p className="font-sans text-xs text-brand-navy/60 font-light leading-relaxed">
            Enter the 6-digit verification code sent to{' '}
            <span className="font-semibold text-brand-navy tracking-wider">{maskedPhone}</span>
          </p>
          <button
            type="button"
            onClick={onChangePhone}
            className="font-sans text-[10px] uppercase tracking-wider text-brand-teal font-bold hover:underline mt-1 block"
          >
            Change Phone Number
          </button>
        </div>

        {/* OTP Input component */}
        <OtpInput
          otp={otp}
          setOtp={(newOtp) => {
            setOtp(newOtp);
            if (error) setError('');
          }}
          isError={!!error}
          disabled={loading}
        />

        {/* Error or Resent notification */}
        {error && (
          <p className="font-sans text-[11px] text-red-500 font-medium mb-4 animate-in fade-in flex items-center gap-1">
            ⚠️ {error}
          </p>
        )}

        {resentMsg && (
          <p className="font-sans text-[11px] text-brand-teal font-semibold flex items-center gap-1 mb-4 animate-in fade-in">
            <CheckCircle2 size={14} /> A new OTP code has been sent successfully.
          </p>
        )}

        {/* Timer / Resend OTP action */}
        <div className="mb-6">
          {timer > 0 ? (
            <p className="font-sans text-xs text-brand-navy/50 font-light">
              Resend OTP in <span className="font-semibold text-brand-navy">00:{timer < 10 ? `0${timer}` : timer}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-sans text-xs font-bold text-brand-teal hover:text-brand-tealDark hover:underline uppercase tracking-wider"
            >
              Resend OTP Code
            </button>
          )}
        </div>

        {/* VERIFY & CONTINUE Button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={!isValidOtp || loading}
          className={`w-full py-3 sm:py-4 rounded-md font-sans text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all duration-300 shadow-md ${!isValidOtp || loading
              ? 'bg-brand-powder/70 text-brand-navy/35 cursor-not-allowed shadow-none'
              : 'bg-brand-teal hover:bg-brand-tealDark text-white hover:shadow-xl active:scale-[0.99] shadow-brand-teal/20'
            }`}
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'VERIFY & COMPLETE LOGIN →'
          )}
        </button>

        {/* Demo Helper notice */}
        <div className="mt-5 p-3 bg-brand-powderLight/80 border border-brand-powder/60 rounded-md text-center">
          <p className="font-sans text-[10.5px] text-brand-teal font-medium">
            💡 Demo OTP code: <span className="font-bold tracking-widest text-brand-navy text-xs ml-1">123456</span>
          </p>
        </div>

      </div>

    </div>
  );
}
