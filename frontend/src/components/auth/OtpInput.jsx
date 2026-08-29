import React, { useRef, useEffect } from 'react';

export default function OtpInput({ otp, setOtp, isError, disabled }) {
  const inputsRef = useRef([]);

  useEffect(() => {
    // Auto focus first input on mount
    if (inputsRef.current[0] && !disabled) {
      inputsRef.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // Digits only

    const newOtp = [...otp];
    // Take last entered character
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto advance if digit entered
    if (val && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputsRef.current[index - 1]) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, 6).split('');
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    // Focus last pasted or next box
    const nextFocusIndex = Math.min(digits.length, 5);
    if (inputsRef.current[nextFocusIndex]) {
      inputsRef.current[nextFocusIndex].focus();
    }
  };

  return (
    <div className="flex justify-between items-center gap-2 sm:gap-3 my-4">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-10 h-12 sm:w-11 sm:h-12 text-center font-sans text-base sm:text-lg font-semibold text-brand-navy bg-brand-cream/20 border rounded-sm outline-none transition-all duration-200 ${
            isError
              ? 'border-red-400 bg-red-50/30 ring-1 ring-red-400'
              : otp[index]
              ? 'border-brand-teal bg-brand-powderLight/40 ring-1 ring-brand-teal/30'
              : 'border-brand-powder/80 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal focus:bg-white'
          }`}
          aria-label={`OTP Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
