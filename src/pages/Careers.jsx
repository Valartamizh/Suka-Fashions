import React, { useState } from 'react';
import { Briefcase, Sparkles, Heart, CheckCircle2, ArrowRight, X } from 'lucide-react';

const JOBS = [
  {
    id: 'fashion-designer',
    title: 'Senior Fashion & Textile Designer',
    department: 'Design & Atelier',
    location: 'Hyderabad (On-site)',
    type: 'Full-time',
    description: 'Lead Indian luxury ethnic design conceptualization, handloom print creation, and bridal embroidery development.',
  },
  {
    id: 'ecommerce-manager',
    title: 'E-commerce & Growth Specialist',
    department: 'Digital Commerce',
    location: 'Hyderabad / Hybrid',
    type: 'Full-time',
    description: 'Optimize digital storefront performance, customer conversion funnels, catalog marketing, and analytics.',
  },
  {
    id: 'artisan-coordinator',
    title: 'Handloom Artisan Community Manager',
    department: 'Supply Chain & Social Impact',
    location: 'Varanasi / Kanchipuram (Field)',
    type: 'Full-time',
    description: 'Work directly with female weaver clusters, manage ethical sourcing standards, and ensure fair trade compliance.',
  },
  {
    id: 'customer-stylist',
    title: 'Personal Fashion Concierge & Stylist',
    department: 'Customer Care',
    location: 'Remote / Hyderabad',
    type: 'Full-time',
    description: 'Provide personalized bridal saree styling consultation and VIP customer assistance across WhatsApp and Phone.',
  },
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applied, setApplied] = useState(false);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelectedJob(null);
    }, 3000);
  };

  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-16 sm:py-20 border-b border-brand-powder/60 text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-3 block">
            Join The Suka Family
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy tracking-wide mb-6">
            Build The Future Of Luxury Handlooms
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/70 max-w-xl mx-auto leading-relaxed font-light">
            Are you passionate about traditional Indian textiles, artisan empowerment, and modern luxury commerce? We’d love to have you on our team.
          </p>
        </div>
      </section>

      {/* Values & Culture */}
      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-brand-cream/30 border border-brand-powder rounded-sm text-center">
            <Heart size={28} className="text-brand-teal mx-auto mb-4" />
            <h3 className="font-serif text-xl text-brand-navy mb-2">Artisan Empowerment</h3>
            <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
              Every role at Suka Fashions directly impacts the lives and livelihoods of rural women weavers across India.
            </p>
          </div>

          <div className="p-8 bg-brand-cream/30 border border-brand-powder rounded-sm text-center">
            <Sparkles size={28} className="text-brand-teal mx-auto mb-4" />
            <h3 className="font-serif text-xl text-brand-navy mb-2">Creativity & Autonomy</h3>
            <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
              We foster an inclusive work environment where innovation, fresh ideas, and creative expression are celebrated.
            </p>
          </div>

          <div className="p-8 bg-brand-cream/30 border border-brand-powder rounded-sm text-center">
            <Briefcase size={28} className="text-brand-teal mx-auto mb-4" />
            <h3 className="font-serif text-xl text-brand-navy mb-2">Growth & Perks</h3>
            <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
              Competitive compensation, wardrobe allowances, wellness benefits, and rapid career progression paths.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions List */}
      <section className="py-12 bg-brand-cream/20 border-t border-brand-powder/50 pb-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="font-serif text-3xl text-brand-navy text-center mb-10 uppercase tracking-wider">
            Current Openings ({JOBS.length})
          </h2>

          <div className="space-y-6">
            {JOBS.map((job) => (
              <div
                key={job.id}
                className="bg-white p-8 rounded-sm border border-brand-powder/70 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-brand-powderLight text-brand-teal font-sans text-[10px] uppercase font-bold tracking-wider rounded-full">
                      {job.department}
                    </span>
                    <span className="font-sans text-[11px] text-brand-navy/50">{job.location} • {job.type}</span>
                  </div>
                  <h3 className="font-serif text-xl text-brand-navy">{job.title}</h3>
                  <p className="font-sans text-xs text-brand-navy/60 mt-1 max-w-xl font-light">{job.description}</p>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="px-6 py-3 bg-brand-navy hover:bg-brand-teal text-white font-sans text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors whitespace-nowrap"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 rounded-sm shadow-2xl relative border border-brand-powder animate-in zoom-in-95">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-brand-navy/40 hover:text-brand-navy"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-2xl text-brand-navy mb-1">Apply for Position</h3>
            <p className="font-sans text-xs text-brand-teal font-bold mb-6">{selectedJob.title}</p>

            {applied ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl text-brand-navy">Application Submitted!</h4>
                <p className="font-sans text-xs text-brand-navy/60">Thank you for your interest. Our HR team will review your details.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-bold text-[10px] uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" required placeholder="e.g. Ananya Rao" className="w-full p-3 border border-brand-powder rounded-sm" />
                </div>
                <div>
                  <label className="block font-bold text-[10px] uppercase tracking-wider mb-1">Email Address *</label>
                  <input type="email" required placeholder="ananya@example.com" className="w-full p-3 border border-brand-powder rounded-sm" />
                </div>
                <div>
                  <label className="block font-bold text-[10px] uppercase tracking-wider mb-1">Phone Number *</label>
                  <input type="tel" required placeholder="+91 9876543210" className="w-full p-3 border border-brand-powder rounded-sm" />
                </div>
                <div>
                  <label className="block font-bold text-[10px] uppercase tracking-wider mb-1">LinkedIn / Portfolio Link</label>
                  <input type="url" placeholder="https://linkedin.com/in/..." className="w-full p-3 border border-brand-powder rounded-sm" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-teal hover:bg-brand-tealDark text-white py-3.5 font-sans text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-md transition-colors mt-2"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
