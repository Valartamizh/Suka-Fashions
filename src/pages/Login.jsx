import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthFashionPanel from '../components/auth/AuthFashionPanel';
import PhoneLoginForm from '../components/auth/PhoneLoginForm';
import OtpVerification from '../components/auth/OtpVerification';

export default function Login() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (enteredPhone) => {
    setPhone(enteredPhone);
    setStep('otp');
  };

  const handleOtpSuccess = () => {
    login(`+91 ${phone}`);
    navigate('/account');
  };

  return (
    <div className="bg-brand-cream/20 py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white border border-brand-powder/60 rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden min-h-[500px] lg:min-h-[540px]">
        
        {/* Left Side: Fashion Photography Panel (Desktop) */}
        <AuthFashionPanel />

        {/* Right Side: Authentication Form (Phone / OTP) */}
        <div className="w-full md:w-1/2 lg:w-[52%] flex items-center bg-white">
          {step === 'phone' ? (
            <PhoneLoginForm onSendOtp={handleSendOtp} />
          ) : (
            <OtpVerification
              phone={phone}
              onChangePhone={() => setStep('phone')}
              onSuccess={handleOtpSuccess}
            />
          )}
        </div>

      </div>
    </div>
  );
}
