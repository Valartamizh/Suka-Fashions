import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IndianRupee, ShoppingBag, Package, AlertTriangle, Users,
  Eye, ChevronRight, TrendingUp,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { adminOrders, salesData } from '../data/adminOrders';
import { adminProducts } from '../data/adminProducts';
import { adminInventory, getStockStatus } from '../data/adminInventory';
import { adminCustomers } from '../data/adminCustomers';

const DATE_RANGES = ['Today', '7 Days', '30 Days', 'This Month'];

const RANGE_METRICS = {
  'Today': {
    revenue: '₹18,450',
    revenueChange: '+4.2% vs yesterday',
    revenueChangeType: 'up',
    orders: '14',
    ordersChange: '+2 orders vs yesterday',
    ordersChangeType: 'up',
    customers: '3',
    customersChange: '+3 new today',
    customersChangeType: 'up',
    chartLabel: 'Today (Hourly Trends)',
    chartData: [
      { label: '9 AM', revenue: 2400, orders: 2 },
      { label: '12 PM', revenue: 4800, orders: 4 },
      { label: '3 PM', revenue: 3900, orders: 3 },
      { label: '6 PM', revenue: 5200, orders: 4 },
      { label: '9 PM', revenue: 2150, orders: 1 },
    ],
    statusCounts: { processing: 3, shipped: 4, delivered: 5, returned: 1, cancelled: 1 },
  },
  '7 Days': {
    revenue: '₹2,48,650',
    revenueChange: '+12.5% vs last week',
    revenueChangeType: 'up',
    orders: '126',
    ordersChange: '+8.2% this period',
    ordersChangeType: 'up',
    customers: '18',
    customersChange: '+5.1% this week',
    customersChangeType: 'up',
    chartLabel: 'Past 7 Days',
    chartData: salesData['7days'],
    statusCounts: { processing: 18, shipped: 32, delivered: 68, returned: 4, cancelled: 4 },
  },
  '30 Days': {
    revenue: '₹7,53,650',
    revenueChange: '+18.4% vs last month',
    revenueChangeType: 'up',
    orders: '412',
    ordersChange: '+14.6% this period',
    ordersChangeType: 'up',
    customers: '42',
    customersChange: '+12.3% this month',
    customersChangeType: 'up',
    chartLabel: 'Past 30 Days (Weekly)',
    chartData: salesData['30days'],
    statusCounts: { processing: 24, shipped: 58, delivered: 302, returned: 14, cancelled: 14 },
  },
  'This Month': {
    revenue: '₹6,84,200',
    revenueChange: '+15.2% vs previous month',
    revenueChangeType: 'up',
    orders: '385',
    ordersChange: '+11.8% this period',
    ordersChangeType: 'up',
    customers: '38',
    customersChange: '+9.4% new this month',
    customersChangeType: 'up',
    chartLabel: 'Current Month Progression',
    chartData: salesData['30days'],
    statusCounts: { processing: 22, shipped: 54, delivered: 284, returned: 13, cancelled: 12 },
  },
};

const CHART_RANGES = [
  { label: '7D', key: '7days' },
  { label: '30D', key: '30days' },
  { label: '6M', key: '6months' },
  { label: '12M', key: '12months' },
];

const ORDER_STATUS_COLORS = {
  pending: '#F59E0B',
  confirmed: '#14B8A6',
  processing: '#3B82F6',
  packed: '#6366F1',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
  returned: '#F97316',
  refunded: '#EC4899',
};

// Compute inventory stats
const invStats = {
  total: adminInventory.length,
  inStock: adminInventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'in-stock').length,
  lowStock: adminInventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'low-stock').length,
  outOfStock: adminInventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'out-of-stock').length,
};

const lowStockItems = adminInventory.filter(i => {
  const s = getStockStatus(i.available, i.minimumStock);
  return s === 'low-stock' || s === 'out-of-stock';
}).slice(0, 5);

// Top selling products
const topProducts = [...adminProducts]
  .sort((a, b) => b.unitsSold - a.unitsSold)
  .slice(0, 4);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2.5 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-brand-teal">Revenue: <span className="font-bold">₹{payload[0]?.value?.toLocaleString('en-IN')}</span></p>
        {payload[1] && <p className="text-slate-500">Orders: <span className="font-bold">{payload[1]?.value}</span></p>}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7 Days');
  const [customChartData, setCustomChartData] = useState(null);
  const [activeChartRange, setActiveChartRange] = useState('7days');

  const currentMetrics = RANGE_METRICS[dateRange] || RANGE_METRICS['7 Days'];
  
  // Use custom selected chart range if clicked, otherwise follow top date range
  const chartData = customChartData || currentMetrics.chartData;

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setCustomChartData(null); // Reset to follow top date range
  };

  const handleChartRangeClick = (key) => {
    setActiveChartRange(key);
    setCustomChartData(salesData[key]);
  };

  const totalStatusCount = Object.values(currentMetrics.statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Showing metrics for <span className="font-semibold text-brand-teal">{dateRange}</span>.
          </p>
        </div>
        
        {/* Dynamic Interactive Date Range Filter */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
          {DATE_RANGES.map(r => (
            <button
              key={r}
              onClick={() => handleDateRangeChange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dateRange === r
                  ? 'bg-brand-teal text-white shadow-sm scale-102'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards (Dynamically updated based on Date Range) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue"
          value={currentMetrics.revenue}
          change={currentMetrics.revenueChange}
          changeType={currentMetrics.revenueChangeType}
          icon={IndianRupee}
          to="/admin/orders"
        />
        <StatCard
          title="Orders"
          value={currentMetrics.orders}
          change={currentMetrics.ordersChange}
          changeType={currentMetrics.ordersChangeType}
          icon={ShoppingBag}
          to="/admin/orders"
        />
        <StatCard
          title="Products"
          value={adminProducts.length.toString()}
          subtitle="Active listings"
          icon={Package}
          to="/admin/products"
        />
        <StatCard
          title="Low Stock"
          value={invStats.lowStock + invStats.outOfStock}
          subtitle={`${invStats.outOfStock} out of stock`}
          icon={AlertTriangle}
          accent
          to="/admin/inventory"
        />
        <StatCard
          title="Customers"
          value={currentMetrics.customers}
          change={currentMetrics.customersChange}
          changeType={currentMetrics.customersChangeType}
          icon={Users}
          to="/admin/customers"
        />
      </div>

      {/* Middle row: Sales Chart + Order Status */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans font-bold text-slate-800 text-sm">Sales Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {customChartData ? 'Custom period trends' : currentMetrics.chartLabel}
              </p>
            </div>
            <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              {CHART_RANGES.map(r => (
                <button
                  key={r.key}
                  onClick={() => handleChartRangeClick(r.key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    (customChartData ? activeChartRange === r.key : false)
                      ? 'bg-brand-teal text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006B70" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#006B70" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#006B70"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                dot={false}
                activeDot={{ r: 4, fill: '#006B70' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Overview (Dynamically proportioned) */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-bold text-slate-800 text-sm">Order Overview</h3>
            <span className="text-[11px] font-semibold text-brand-teal bg-brand-powderLight px-2 py-0.5 rounded-full">
              {dateRange}
            </span>
          </div>
          <div className="space-y-2.5">
            {Object.entries(currentMetrics.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ORDER_STATUS_COLORS[status] || '#94a3b8' }}
                  />
                  <span className="text-xs text-slate-600 capitalize">{status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 bg-slate-100 rounded-full flex-shrink-0" style={{ width: '60px' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((count / totalStatusCount) * 100))}%`,
                        backgroundColor: ORDER_STATUS_COLORS[status] || '#94a3b8',
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/admin/orders"
            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            View All Orders <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom row: Recent Orders + Top Products */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-sans font-bold text-slate-800 text-sm">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {adminOrders.slice(0, dateRange === 'Today' ? 3 : 6).map(order => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="hover:bg-brand-powder/20 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-brand-teal text-xs group-hover:underline">#{order.id}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-semibold whitespace-nowrap group-hover:text-brand-teal transition-colors">{order.customer.name}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-medium whitespace-nowrap">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-sans font-bold text-slate-800 text-sm">Top Selling</h3>
            <Link to="/admin/products" className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1">
              All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {topProducts.map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.slug || p.id}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100/70 cursor-pointer transition-colors group"
              >
                <span className="font-bold text-slate-300 text-xs w-4 text-center">{i + 1}</span>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-10 h-12 object-cover object-top rounded-lg border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-tight group-hover:text-brand-teal transition-colors">{p.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    <span className="text-emerald-600 font-bold">{p.unitsSold} sold</span>
                    <span className="mx-1.5">·</span>
                    ₹{p.revenue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Overview + Low Stock Alerts */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Inventory Summary */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-sans font-bold text-slate-800 text-sm mb-4">Inventory Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Total SKUs', value: invStats.total, color: 'bg-slate-200', w: 100 },
              { label: 'In Stock', value: invStats.inStock, color: 'bg-emerald-400', w: Math.round((invStats.inStock / invStats.total) * 100) },
              { label: 'Low Stock', value: invStats.lowStock, color: 'bg-amber-400', w: Math.round((invStats.lowStock / invStats.total) * 100) },
              { label: 'Out of Stock', value: invStats.outOfStock, color: 'bg-red-400', w: Math.round((invStats.outOfStock / invStats.total) * 100) },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{item.label}</span>
                  <span className="text-xs font-bold text-slate-700">{item.value}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.w}%` }} />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/admin/inventory"
            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Manage Inventory <ChevronRight size={13} />
          </Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-amber-100 shadow-sm border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500" />
              <h3 className="font-sans font-bold text-slate-800 text-sm">Low Stock Alerts</h3>
            </div>
            <Link to="/admin/inventory" className="text-xs font-semibold text-brand-teal hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-50">
                  {['Product', 'SKU', 'Variant', 'Stock', 'Min Stock', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lowStockItems.map(item => {
                  const status = getStockStatus(item.available, item.minimumStock);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate('/admin/inventory')}
                      className="hover:bg-amber-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3 text-slate-800 font-semibold max-w-[160px] truncate group-hover:text-brand-teal">{item.productName}</td>
                      <td className="px-4 py-3 font-mono text-slate-500 text-[10px]">{item.sku}</td>
                      <td className="px-4 py-3 text-slate-500">{item.variant}</td>
                      <td className={`px-4 py-3 font-bold ${item.available === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.available}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{item.minimumStock}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
