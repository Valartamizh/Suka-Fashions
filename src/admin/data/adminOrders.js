// Admin orders dummy data with 100% reliable local image imports
import sareeGolden from '../../assets/saree_golden.jpg';
import sareeBeigeMaroonFull from '../../assets/saree_beige_maroon_full.jpg';
import sareeBeigePink from '../../assets/saree_beige_pink.jpg';
import lehengaRed from '../../assets/lehenga_red.jpg';
import kurtiPurplePrinted from '../../assets/kurti_purple_printed.jpg';
import dressNavy from '../../assets/dress_navy.jpg';
import coordSet from '../../assets/coord_set.jpg';
import dupattaSilk from '../../assets/dupatta_silk.jpg';

export const adminOrders = [
  {
    id: 'SUK1028',
    customer: { id: 'CUS000421', name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya.sharma@gmail.com' },
    address: { line1: '42, Rose Garden Apartments', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    items: [
      { productId: 'teal-organza-saree', name: 'Teal Embroidered Organza Saree', variant: 'Teal / Free Size', qty: 1, price: 3499, image: sareeGolden },
      { productId: 'ivory-dupatta', name: 'Ivory Banarasi Silk Dupatta', variant: 'Ivory / Free Size', qty: 1, price: 899, image: dupattaSilk },
    ],
    subtotal: 4398,
    discount: 100,
    shipping: 0,
    tax: 220,
    total: 4518,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    status: 'processing',
    date: '2026-08-26',
    timeline: [
      { status: 'pending', time: '2026-08-26 09:00', note: 'Order placed' },
      { status: 'confirmed', time: '2026-08-26 09:15', note: 'Payment confirmed' },
    ],
  },
  {
    id: 'SUK1027',
    customer: { id: 'CUS000387', name: 'Ananya Krishnan', phone: '+91 94456 78901', email: 'ananya.k@gmail.com' },
    address: { line1: '15, Palm Beach Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
    items: [
      { productId: 'gold-zari-kanchipuram', name: 'Royal Gold Zari Kanchipuram Saree', variant: 'Gold / Free Size', qty: 1, price: 5999, image: sareeBeigeMaroonFull },
    ],
    subtotal: 5999,
    discount: 0,
    shipping: 0,
    tax: 300,
    total: 6299,
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    status: 'shipped',
    date: '2026-08-24',
    timeline: [
      { status: 'pending', time: '2026-08-24 14:00', note: 'Order placed' },
      { status: 'confirmed', time: '2026-08-24 14:10', note: 'Payment confirmed' },
      { status: 'packed', time: '2026-08-25 10:00', note: 'Order packed and ready' },
      { status: 'shipped', time: '2026-08-25 16:00', note: 'Shipped via BlueDart. AWB: BD928374' },
    ],
  },
  {
    id: 'SUK1026',
    customer: { id: 'CUS000312', name: 'Radhika Patel', phone: '+91 99887 76543', email: 'radhika.patel@hotmail.com' },
    address: { line1: '7, Navrang Society, Navrangpura', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009' },
    items: [
      { productId: 'crimson-lehenga', name: 'Crimson Bridal Lehenga Set', variant: 'Crimson / M', qty: 1, price: 14999, image: lehengaRed },
    ],
    subtotal: 14999,
    discount: 500,
    shipping: 0,
    tax: 750,
    total: 15249,
    paymentMethod: 'Net Banking',
    paymentStatus: 'refunded',
    status: 'returned',
    date: '2026-08-20',
    timeline: [
      { status: 'pending', time: '2026-08-20 11:00', note: 'Order placed' },
      { status: 'confirmed', time: '2026-08-20 11:05', note: 'Payment confirmed' },
      { status: 'shipped', time: '2026-08-21 14:00', note: 'Shipped' },
      { status: 'delivered', time: '2026-08-23 12:00', note: 'Delivered' },
      { status: 'returned', time: '2026-08-24 10:00', note: 'Return requested by customer (Size misfit)' },
      { status: 'refunded', time: '2026-08-25 15:00', note: 'Refund processed: ₹15,249' },
    ],
  },
  {
    id: 'SUK1025',
    customer: { id: 'CUS000289', name: 'Meera Iyer', phone: '+91 97654 32109', email: 'meera.iyer@yahoo.com' },
    address: { line1: '102, Green Park Extension', city: 'New Delhi', state: 'Delhi', pincode: '110016' },
    items: [
      { productId: 'purple-anarkali-suit', name: 'Royal Purple Anarkali Suit', variant: 'Purple / L', qty: 1, price: 2299, image: kurtiPurplePrinted },
    ],
    subtotal: 2299,
    discount: 0,
    shipping: 0,
    tax: 115,
    total: 2414,
    paymentMethod: 'COD',
    paymentStatus: 'paid',
    status: 'delivered',
    date: '2026-08-18',
    timeline: [
      { status: 'pending', time: '2026-08-18 16:30', note: 'Order placed (COD)' },
      { status: 'confirmed', time: '2026-08-18 17:00', note: 'COD order confirmed via SMS' },
      { status: 'shipped', time: '2026-08-19 11:00', note: 'Dispatched via Delhivery' },
      { status: 'delivered', time: '2026-08-22 14:30', note: 'Delivered. COD cash collected.' },
    ],
  },
  {
    id: 'SUK1024',
    customer: { id: 'CUS000198', name: 'Deepika Sen', phone: '+91 91234 56789', email: 'deepika.sen@gmail.com' },
    address: { line1: '55, Lake Gardens', city: 'Kolkata', state: 'West Bengal', pincode: '700045' },
    items: [
      { productId: 'blush-pink-silk-saree', name: 'Blush Pink Pure Silk Saree', variant: 'Blush Pink / Free Size', qty: 1, price: 4299, image: sareeBeigePink },
    ],
    subtotal: 4299,
    discount: 200,
    shipping: 0,
    tax: 215,
    total: 4314,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    status: 'delivered',
    date: '2026-08-15',
    timeline: [
      { status: 'pending', time: '2026-08-15 10:00', note: 'Order placed' },
      { status: 'confirmed', time: '2026-08-15 10:10', note: 'Payment confirmed' },
      { status: 'delivered', time: '2026-08-18 16:00', note: 'Delivered' },
    ],
  },
  {
    id: 'SUK1023',
    customer: { id: 'CUS000144', name: 'Kavita Joshi', phone: '+91 98111 22334', email: 'kavita.j@gmail.com' },
    address: { line1: '88, Civil Lines', city: 'Jaipur', state: 'Rajasthan', pincode: '302006' },
    items: [
      { productId: 'teal-coord-set', name: 'Teal Printed Coord Set', variant: 'Teal / M', qty: 1, price: 2799, image: coordSet },
    ],
    subtotal: 2799,
    discount: 0,
    shipping: 0,
    tax: 140,
    total: 2939,
    paymentMethod: 'Credit Card',
    paymentStatus: 'failed',
    status: 'cancelled',
    date: '2026-08-12',
    timeline: [
      { status: 'pending', time: '2026-08-12 18:00', note: 'Order placed' },
      { status: 'cancelled', time: '2026-08-12 18:05', note: 'Payment failed at gateway. Order auto-cancelled.' },
    ],
  },
];

export const salesData = {
  '7days': [
    { label: 'Mon', revenue: 24500, orders: 12 },
    { label: 'Tue', revenue: 18900, orders: 9 },
    { label: 'Wed', revenue: 31200, orders: 15 },
    { label: 'Thu', revenue: 28400, orders: 14 },
    { label: 'Fri', revenue: 42100, orders: 21 },
    { label: 'Sat', revenue: 56800, orders: 28 },
    { label: 'Sun', revenue: 46750, orders: 23 },
  ],
  '30days': [
    { label: 'Week 1', revenue: 142000, orders: 72 },
    { label: 'Week 2', revenue: 168000, orders: 84 },
    { label: 'Week 3', revenue: 195000, orders: 98 },
    { label: 'Week 4', revenue: 248650, orders: 124 },
  ],
  '6months': [
    { label: 'Mar', revenue: 420000, orders: 210 },
    { label: 'Apr', revenue: 510000, orders: 255 },
    { label: 'May', revenue: 480000, orders: 240 },
    { label: 'Jun', revenue: 620000, orders: 310 },
    { label: 'Jul', revenue: 710000, orders: 355 },
    { label: 'Aug', revenue: 840000, orders: 420 },
  ],
  '12months': [
    { label: 'Sep 25', revenue: 380000, orders: 190 },
    { label: 'Oct 25', revenue: 590000, orders: 295 },
    { label: 'Nov 25', revenue: 780000, orders: 390 },
    { label: 'Dec 25', revenue: 640000, orders: 320 },
    { label: 'Jan 26', revenue: 450000, orders: 225 },
    { label: 'Feb 26', revenue: 520000, orders: 260 },
    { label: 'Mar 26', revenue: 610000, orders: 305 },
    { label: 'Apr 26', revenue: 580000, orders: 290 },
    { label: 'May 26', revenue: 670000, orders: 335 },
    { label: 'Jun 26', revenue: 720000, orders: 360 },
    { label: 'Jul 26', revenue: 810000, orders: 405 },
    { label: 'Aug 26', revenue: 950000, orders: 475 },
  ],
};
