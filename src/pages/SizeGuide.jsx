import React, { useState } from 'react';
import { Ruler, Check, HelpCircle, Scissors, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const KURTI_SIZES = [
  { size: 'XS', bustIn: '32', bustCm: '81', waistIn: '26', waistCm: '66', hipIn: '36', hipCm: '91', shoulderIn: '14.0', shoulderCm: '35.5' },
  { size: 'S', bustIn: '34', bustCm: '86', waistIn: '28', waistCm: '71', hipIn: '38', hipCm: '96', shoulderIn: '14.5', shoulderCm: '36.8' },
  { size: 'M', bustIn: '36', bustCm: '91', waistIn: '30', waistCm: '76', hipIn: '40', hipCm: '101', shoulderIn: '15.0', shoulderCm: '38.0' },
  { size: 'L', bustIn: '38', bustCm: '96', waistIn: '32', waistCm: '81', hipIn: '42', hipCm: '106', shoulderIn: '15.5', shoulderCm: '39.3' },
  { size: 'XL', bustIn: '40', bustCm: '101', waistIn: '34', waistCm: '86', hipIn: '44', hipCm: '111', shoulderIn: '16.0', shoulderCm: '40.6' },
  { size: 'XXL', bustIn: '42', bustCm: '106', waistIn: '36', waistCm: '91', hipIn: '46', hipCm: '116', shoulderIn: '16.5', shoulderCm: '41.9' },
];

const LEHENGA_SIZES = [
  { size: 'S', waistIn: '26 - 28', waistCm: '66 - 71', lengthIn: '42', lengthCm: '106', blouseBustIn: '34', blouseBustCm: '86' },
  { size: 'M', waistIn: '29 - 31', waistCm: '73 - 78', lengthIn: '42', lengthCm: '106', blouseBustIn: '36', blouseBustCm: '91' },
  { size: 'L', waistIn: '32 - 34', waistCm: '81 - 86', lengthIn: '43', lengthCm: '109', blouseBustIn: '38', blouseBustCm: '96' },
  { size: 'XL', waistIn: '35 - 37', waistCm: '88 - 94', lengthIn: '43', lengthCm: '109', blouseBustIn: '40', blouseBustCm: '101' },
];

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState('kurtis');
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'

  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-12 sm:py-16 border-b border-brand-powder/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-2 block">
            Fit Guarantee
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy tracking-wide mb-4">
            Size & Fit Guide
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/60 max-w-lg mx-auto leading-relaxed">
            Find your perfect fit. Compare your measurements against our official size charts for sarees, kurtis, lehengas, and dresses.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-powder/60">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'kurtis', label: 'Kurtis & Suits' },
              { id: 'lehengas', label: 'Lehengas & Gowns' },
              { id: 'sarees', label: 'Sarees & Blouses' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-teal text-white shadow-2xs'
                    : 'bg-brand-cream/40 text-brand-navy/70 border border-brand-powder hover:text-brand-teal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inches vs Centimeters Switcher */}
          <div className="flex items-center bg-brand-cream/60 border border-brand-powder rounded-sm p-1">
            <button
              onClick={() => setUnit('in')}
              className={`px-4 py-1.5 font-sans text-xs uppercase font-bold rounded-2xs transition-colors ${
                unit === 'in' ? 'bg-brand-navy text-white shadow-2xs' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-4 py-1.5 font-sans text-xs uppercase font-bold rounded-2xs transition-colors ${
                unit === 'cm' ? 'bg-brand-navy text-white shadow-2xs' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>

        </div>

        {/* 1. KURTIS & SUITS TABLE */}
        {activeTab === 'kurtis' && (
          <div className="overflow-x-auto border border-brand-powder/70 rounded-sm shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-navy text-white font-serif text-xs uppercase tracking-widest">
                  <th className="p-4 border-b border-brand-powder/20">Brand Size</th>
                  <th className="p-4 border-b border-brand-powder/20">Bust ({unit})</th>
                  <th className="p-4 border-b border-brand-powder/20">Waist ({unit})</th>
                  <th className="p-4 border-b border-brand-powder/20">Hip ({unit})</th>
                  <th className="p-4 border-b border-brand-powder/20">Shoulder ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-powder/50 font-sans text-xs text-brand-navy/80">
                {KURTI_SIZES.map((row) => (
                  <tr key={row.size} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="p-4 font-bold text-brand-teal">{row.size}</td>
                    <td className="p-4">{unit === 'in' ? row.bustIn : row.bustCm}</td>
                    <td className="p-4">{unit === 'in' ? row.waistIn : row.waistCm}</td>
                    <td className="p-4">{unit === 'in' ? row.hipIn : row.hipCm}</td>
                    <td className="p-4">{unit === 'in' ? row.shoulderIn : row.shoulderCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. LEHENGAS & GOWNS TABLE */}
        {activeTab === 'lehengas' && (
          <div className="overflow-x-auto border border-brand-powder/70 rounded-sm shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-navy text-white font-serif text-xs uppercase tracking-widest">
                  <th className="p-4 border-b border-brand-powder/20">Size</th>
                  <th className="p-4 border-b border-brand-powder/20">Lehenga Waist ({unit})</th>
                  <th className="p-4 border-b border-brand-powder/20">Lehenga Skirt Length ({unit})</th>
                  <th className="p-4 border-b border-brand-powder/20">Blouse Bust ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-powder/50 font-sans text-xs text-brand-navy/80">
                {LEHENGA_SIZES.map((row) => (
                  <tr key={row.size} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="p-4 font-bold text-brand-teal">{row.size}</td>
                    <td className="p-4">{unit === 'in' ? row.waistIn : row.waistCm}</td>
                    <td className="p-4">{unit === 'in' ? row.lengthIn : row.lengthCm}</td>
                    <td className="p-4">{unit === 'in' ? row.blouseBustIn : row.blouseBustCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. SAREES & BLOUSES INFO */}
        {activeTab === 'sarees' && (
          <div className="bg-brand-cream/30 p-8 rounded-sm border border-brand-powder/70 space-y-4">
            <h3 className="font-serif text-2xl text-brand-navy">Saree Specifications</h3>
            <ul className="font-sans text-xs sm:text-sm text-brand-navy/80 space-y-3 leading-relaxed">
              <li><strong>Saree Length:</strong> Standard 5.5 Meters (6.0 Yards) - suitable for all draping styles and heights.</li>
              <li><strong>Unstitched Blouse Piece:</strong> Included 0.8 Meter (80 cm) matching fabric attached at the end of saree.</li>
              <li><strong>Readymade Saree Blouses:</strong> Styled with 2-inch inner margin seam allowance to easily expand size by 1 to 2 sizes.</li>
            </ul>
          </div>
        )}

        {/* How To Measure Yourself */}
        <div className="mt-16 bg-white p-8 sm:p-10 rounded-sm border border-brand-powder/70 shadow-2xs">
          <div className="flex items-center gap-3 mb-6">
            <Ruler size={24} className="text-brand-teal" />
            <h3 className="font-serif text-2xl text-brand-navy uppercase tracking-wider">How To Measure Yourself</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-brand-navy/80 font-sans text-xs leading-relaxed">
            
            <div className="p-4 bg-brand-cream/20 rounded-sm border border-brand-powder/40">
              <h4 className="font-bold text-brand-navy text-sm uppercase tracking-wide mb-1">1. Bust / Chest</h4>
              <p className="text-brand-navy/60">Measure around the fullest part of your bust, keeping the measuring tape parallel to the floor and comfortable.</p>
            </div>

            <div className="p-4 bg-brand-cream/20 rounded-sm border border-brand-powder/40">
              <h4 className="font-bold text-brand-navy text-sm uppercase tracking-wide mb-1">2. Natural Waist</h4>
              <p className="text-brand-navy/60">Measure around the narrowest part of your waistline, usually 1 to 2 inches above your belly button.</p>
            </div>

            <div className="p-4 bg-brand-cream/20 rounded-sm border border-brand-powder/40">
              <h4 className="font-bold text-brand-navy text-sm uppercase tracking-wide mb-1">3. Hips</h4>
              <p className="text-brand-navy/60">Stand with feet together and measure around the fullest part of your hips and buttocks.</p>
            </div>

          </div>

          {/* Tailor Fit Banner */}
          <div className="mt-8 p-6 bg-brand-navy text-white rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-lg text-brand-powder">Need Custom Blouse Tailoring?</h4>
              <p className="font-sans text-xs text-white/70">Our master tailors offer customized stitching based on your exact measurements.</p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[10px] uppercase font-bold tracking-widest rounded-sm whitespace-nowrap shadow-md transition-colors"
            >
              Request Custom Fit
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}
