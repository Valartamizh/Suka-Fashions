import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import logo from '../assets/logo.jpg';

/* ─── Social SVG Icons ──────────────────────────────────────────────────────── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.66 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86-3.4 0-5.4 2.56-5.4 5.2 0 1.03.4 2.13.9 2.73.1.12.11.23.08.35l-.34 1.39c-.06.23-.18.28-.42.17-1.57-.73-2.55-3.02-2.55-4.86 0-3.95 2.87-7.6 8.3-7.6 4.36 0 7.74 3.1 7.74 7.25 0 4.33-2.73 7.82-6.52 7.82-1.27 0-2.47-.66-2.88-1.44l-.78 2.98c-.28 1.08-1.05 2.44-1.56 3.28 1.13.35 2.33.54 3.58.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const columns = [
  {
    id:    'shop',
    title: 'Shop',
    links: [
      { name: 'New Arrivals',  path: '/products'          },
      { name: 'Sarees',        path: '/category/sarees'   },
      { name: 'Kurtis',        path: '/category/kurtis'   },
      { name: 'Lehengas',      path: '/category/lehengas' },
      { name: 'Dresses',       path: '/category/dresses'  },
    ],
  },
  {
    id:    'help',
    title: 'Help',
    links: [
      { name: 'Contact Us',          path: '/contact'      },
      { name: 'Shipping Policy',     path: '/shipping'     },
      { name: 'Returns & Exchanges', path: '/returns'      },
      { name: 'Track Order',         path: '/track-order'  },
    ],
  },
  {
    id:    'about',
    title: 'About',
    links: [
      { name: 'Our Story',         path: '/about'       },
      { name: 'Privacy Policy',    path: '/privacy'     },
      { name: 'Terms & Conditions', path: '/terms'      },
    ],
  },
];

const socials = [
  { SvgIcon: InstagramIcon, href: 'https://instagram.com',        label: 'Instagram' },
  { SvgIcon: FacebookIcon,  href: 'https://facebook.com',         label: 'Facebook'  },
  { SvgIcon: PinterestIcon, href: 'https://pinterest.com',        label: 'Pinterest' },
  { SvgIcon: YoutubeIcon,   href: 'https://youtube.com',          label: 'YouTube'   },
  { SvgIcon: WhatsAppIcon,  href: 'https://wa.me/919876543210',   label: 'WhatsApp'  },
];

/* ─── Accordion column (mobile) ─────────────────────────────────────────────── */
function FooterColumn({ col }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center py-2 sm:py-2.5 lg:py-0 border-b border-white/10 lg:border-none focus:outline-none group cursor-pointer"
        aria-expanded={open}
      >
        <h4 className="font-serif text-[11.5px] sm:text-xs tracking-[0.2em] uppercase font-semibold text-brand-powder">
          {col.title}
        </h4>
        <span className="lg:hidden text-brand-powder/50 group-hover:text-white transition-colors">
          {open ? <ChevronUp size={14} strokeWidth={1.8} /> : <ChevronDown size={14} strokeWidth={1.8} />}
        </span>
      </button>

      <ul className={`space-y-1.5 mt-2 lg:block ${open ? 'block pb-2' : 'hidden'}`}>
        {col.links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="font-sans text-[10.5px] sm:text-[11px] text-brand-powder/60 hover:text-white transition-colors duration-150 tracking-wide block py-0.5"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Main footer ────────────────────────────────────────────────────────────── */
export default function Footer() {
  const [customerOpen, setCustomerOpen] = useState(false);

  return (
    <footer className="bg-brand-tealDark text-white pt-5 sm:pt-8 lg:pt-10 pb-4 sm:pb-5 border-t border-brand-tealLight/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* ── Main grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 pb-4 sm:pb-6 lg:pb-7 border-b border-white/10">

          {/* Brand column — 2 cols wide */}
          <div className="lg:col-span-2 flex flex-col items-start pb-2 lg:pb-0 border-b border-white/10 lg:border-none w-full">

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src={logo}
                alt="Suka Fashions Logo"
                className="h-11 w-11 sm:h-13 sm:w-13 rounded-full object-cover border border-brand-tealLight/30 shadow-md"
              />
              <div className="leading-none text-left">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white block">Suka</span>
                <span className="font-sans text-[8.5px] tracking-[0.3em] text-brand-powder font-medium uppercase">FASHIONS</span>
              </div>
            </div>

            {/* Tagline */}
            <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] font-semibold text-brand-powder uppercase mb-2 text-left">
              Women Based • Women Empowered
            </p>

            {/* About blurb */}
            <p className="font-sans text-[10.5px] sm:text-[11px] text-brand-powder/55 font-light mb-3 sm:mb-5 leading-relaxed max-w-sm text-left">
              A luxury women's clothing brand dedicated to celebrating femininity, empowering women artisans, and keeping traditional weaves alive for the modern woman.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 mb-2 lg:mb-0">
              {socials.map(({ SvgIcon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-tealLight text-white transition-all duration-200 hover:scale-110"
                >
                  <SvgIcon />
                </a>
              ))}
            </div>
          </div>

          {/* SHOP, HELP, ABOUT columns */}
          {columns.map((col) => (
            <div key={col.id} className="lg:col-span-1">
              <FooterColumn col={col} />
            </div>
          ))}

          {/* CUSTOMER CARE column */}
          <div className="lg:col-span-1 flex flex-col text-left">
            <button
              onClick={() => setCustomerOpen((o) => !o)}
              className="w-full flex justify-between items-center py-2 sm:py-2.5 lg:py-0 border-b border-white/10 lg:border-none focus:outline-none group cursor-pointer"
              aria-expanded={customerOpen}
            >
              <h4 className="font-serif text-[11.5px] sm:text-xs tracking-[0.2em] uppercase font-semibold text-brand-powder">
                Customer Care
              </h4>
              <span className="lg:hidden text-brand-powder/50 group-hover:text-white transition-colors">
                {customerOpen ? <ChevronUp size={14} strokeWidth={1.8} /> : <ChevronDown size={14} strokeWidth={1.8} />}
              </span>
            </button>

            <div className={`mt-2.5 lg:block space-y-2.5 ${customerOpen ? 'block pb-2' : 'hidden'}`}>
              {[
                { 
                  Icon: Phone, 
                  text: '+91 98765 43210', 
                  label: 'Phone', 
                  href: 'tel:+919876543210' 
                },
                { 
                  Icon: Mail,  
                  text: 'care@sukafashions.com', 
                  label: 'Email', 
                  href: 'mailto:care@sukafashions.com' 
                },
                { 
                  Icon: InstagramIcon, 
                  text: '@sukafashions (Instagram DM)', 
                  label: 'Instagram', 
                  href: 'https://instagram.com/sukafashions', 
                  isSvg: true,
                  isExternal: true 
                },
                { 
                  Icon: Clock, 
                  text: 'Mon–Sat, 10 AM – 7 PM', 
                  label: 'Hours' 
                },
              ].map(({ Icon, text, label, href, isSvg, isExternal }) => {
                const content = (
                  <div className="flex items-center gap-2 group/item">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 group-hover/item:bg-white/20 flex items-center justify-center text-brand-powder group-hover/item:text-white transition-all flex-shrink-0">
                      {isSvg ? (
                        <InstagramIcon />
                      ) : (
                        <Icon size={11} strokeWidth={2} />
                      )}
                    </div>
                    <span className={`font-sans text-[10px] sm:text-[11px] leading-snug transition-colors ${href ? 'text-brand-powder/85 group-hover/item:text-white hover:underline' : 'text-brand-powder/65'}`}>
                      {text}
                    </span>
                  </div>
                );

                if (href) {
                  return (
                    <a
                      key={label}
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="block"
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={label}>{content}</div>;
              })}
            </div>
          </div>

        </div>

        {/* ── Bottom row ─────────────────────────────── */}
        <div className="pt-3 sm:pt-5 flex justify-center items-center">
          {/* Copyright */}
          <p className="font-sans text-[10px] sm:text-[11px] text-brand-powder/40 font-light text-center">
            © {new Date().getFullYear()} Suka Fashions. All Rights Reserved. Crafted with care.
          </p>
        </div>

      </div>
    </footer>
  );
}
