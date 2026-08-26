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
    <div className="w-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-left animate-in fade-in duration-300">
      
      <div>
        {/* Header with back arrow */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onChangePhone}
            className="flex items-center gap-1.5 font-sans text-xs text-brand-navy/60 hover:text-brand-teal transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <img src={logo} alt="Suka Logo" className="w-7 h-7 rounded-full border border-brand-powder" />
        </div>

        {/* Heading & Target Phone */}
        <div className="mb-4">
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light mb-1.5">
            Verify Your Number
          </h1>
          <p className="font-sans text-xs text-brand-navy/60 font-light leading-relaxed">
            We've sent a 6-digit OTP to{' '}
            <span className="font-semibold text-brand-navy">{maskedPhone}</span>
          </p>
          <button
            type="button"
            onClick={onChangePhone}
            className="font-sans text-[10px] uppercase tracking-wider text-brand-teal font-semibold hover:underline mt-1 block"
          >
            Change Number
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
          <p className="font-sans text-[11px] text-red-500 font-medium mb-3 animate-in fade-in">
            {error}
          </p>
        )}

        {resentMsg && (
          <p className="font-sans text-[11px] text-brand-teal font-semibold flex items-center gap-1 mb-3 animate-in fade-in">
            <CheckCircle2 size={13} /> A new OTP has been sent.
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
              className="font-sans text-xs font-semibold text-brand-teal hover:text-brand-tealDark hover:underline uppercase tracking-wider"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* VERIFY & CONTINUE Button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={!isValidOtp || loading}
          className={`w-full py-3.5 rounded-sm font-sans text-[10px] font-bold tracking-[0.22em] uppercase transition-all duration-200 shadow-md ${
            !isValidOtp || loading
              ? 'bg-brand-powder/70 text-brand-navy/35 cursor-not-allowed shadow-none'
              : 'bg-brand-teal hover:bg-brand-tealDark text-white hover:shadow-lg active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'VERIFY & CONTINUE'
          )}
        </button>

        {/* Demo Helper notice */}
        <div className="mt-4 p-2.5 bg-brand-powderLight border border-brand-powder/60 rounded-sm text-center">
          <p className="font-sans text-[10px] text-brand-teal font-medium">
            Demo OTP code: <span className="font-bold tracking-widest text-brand-navy">123456</span>
          </p>
        </div>

      </div>

    </div>
  );
}
