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
import { salesData } from '../data/adminOrders';
import { adminProducts } from '../data/adminProducts';
import { adminInventory, getStockStatus } from '../data/adminInventory';
import { useCustomers } from '../../context/CustomerContext';
import { useOrders } from '../../context/OrderContext';

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
  .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
  .slice(0, 4)
  .map((p) => ({
    ...p,
    revenue: p.revenue !== undefined ? p.revenue : (p.unitsSold || 0) * (p.price || 0),
  }));

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

const RANGE_METRICS_MAP = {
  'today': {
    revenue: '₹18,450',
    revenueChange: '+4.2% vs yesterday',
    revenueChangeType: 'up',
    orders: '14',
    ordersChange: '+2 orders vs yesterday',
    ordersChangeType: 'up',
    customers: '3',
    customersChange: '+3 new today',
    customersChangeType: 'up',
    statusCounts: { processing: 3, shipped: 4, delivered: 5, returned: 1, cancelled: 1 },
    chartData: [
      { label: '9 AM', revenue: 2400, orders: 2 },
      { label: '12 PM', revenue: 4800, orders: 4 },
      { label: '3 PM', revenue: 3900, orders: 3 },
      { label: '6 PM', revenue: 5200, orders: 4 },
      { label: '9 PM', revenue: 2150, orders: 1 },
    ],
  },
  '7days': {
    revenue: '₹2,48,650',
    revenueChange: '+12.5% vs last week',
    revenueChangeType: 'up',
    orders: '126',
    ordersChange: '+8.2% this period',
    ordersChangeType: 'up',
    customers: '18',
    customersChange: '+5.1% this week',
    customersChangeType: 'up',
    statusCounts: { processing: 18, shipped: 32, delivered: 68, returned: 4, cancelled: 4 },
    chartData: salesData['7days'],
  },
  '30days': {
    revenue: '₹7,53,650',
    revenueChange: '+18.4% vs last month',
    revenueChangeType: 'up',
    orders: '412',
    ordersChange: '+14.6% this period',
    ordersChangeType: 'up',
    customers: '42',
    customersChange: '+12.3% this month',
    customersChangeType: 'up',
    statusCounts: { processing: 24, shipped: 58, delivered: 302, returned: 14, cancelled: 14 },
    chartData: salesData['30days'],
  },
  '12months': {
    revenue: '₹68,40,000',
    revenueChange: '+34.2% vs previous year',
    revenueChangeType: 'up',
    orders: '3,420',
    ordersChange: '+28.6% annual orders',
    ordersChangeType: 'up',
    customers: '420',
    customersChange: '+26.4% active base',
    customersChangeType: 'up',
    statusCounts: { processing: 38, shipped: 145, delivered: 3100, returned: 68, cancelled: 69 },
    chartData: salesData['12months'],
  },
  'overall': {
    revenue: '₹75,00,000',
    revenueChange: '+38.5% all-time growth',
    revenueChangeType: 'up',
    orders: '3,800',
    ordersChange: '+31.4% all-time volume',
    ordersChangeType: 'up',
    customers: '480',
    customersChange: '+29.1% customer base',
    customersChangeType: 'up',
    statusCounts: { processing: 45, shipped: 160, delivered: 3450, returned: 75, cancelled: 70 },
    chartData: salesData['12months'],
  },
};

const PERIOD_OPTIONS = [
  { label: 'Today', key: 'today' },
  { label: '7 Days', key: '7days' },
  { label: '30 Days', key: '30days' },
  { label: '12 Months', key: '12months' },
  { label: 'Overall', key: 'overall' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { adminOrders } = useOrders();
  const [graphMode, setGraphMode] = useState('both'); // 'revenue' | 'sales' | 'both'
  const [chartRange, setChartRange] = useState('7days'); // 'today' | '7days' | '30days' | '12months' | 'overall'

  const currentMetrics = RANGE_METRICS_MAP[chartRange] || RANGE_METRICS_MAP['7days'];
  const totalStatusCount = Object.values(currentMetrics.statusCounts).reduce((a, b) => a + b, 0);
  const activeChartData = currentMetrics.chartData || salesData['7days'];

  const periodLabel =
    chartRange === 'today'
      ? 'Today'
      : chartRange === '7days'
      ? 'Past 7 Days'
      : chartRange === '30days'
      ? 'Past 30 Days'
      : chartRange === '12months'
      ? 'Past 12 Months'
      : 'Overall Performance';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Showing performance metrics for <span className="font-semibold text-brand-teal">{periodLabel}</span>.
          </p>
        </div>
        
        {/* Dynamic Period Filter: Today, 7 Days, 30 Days, Overall */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs overflow-x-auto no-scrollbar max-w-full">
          {PERIOD_OPTIONS.map(r => (
            <button
              key={r.key}
              onClick={() => setChartRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                chartRange === r.key
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Revenue"
          value={currentMetrics.revenue}
          change={currentMetrics.revenueChange}
          changeType={currentMetrics.revenueChangeType}
          icon={IndianRupee}
          onClick={() => {
            setGraphMode('revenue');
            const el = document.getElementById('revenue-sales-graph');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
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
          value={customers.length.toString()}
          change={currentMetrics.customersChange}
          changeType={currentMetrics.customersChangeType}
          icon={Users}
          to="/admin/customers"
        />
      </div>

      {/* Middle row: Sales & Revenue Graph + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graph Card */}
        <div id="revenue-sales-graph" className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-sans font-bold text-slate-800 text-sm">
                  {graphMode === 'revenue' ? 'Revenue Graph' : graphMode === 'sales' ? 'Sales Graph (Orders)' : 'Revenue & Sales Overview'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {graphMode === 'revenue' && 'Financial earnings timeline'}
                {graphMode === 'sales' && 'Order volume timeline'}
                {graphMode === 'both' && 'Comparative trends with distinct colored metrics'}
              </p>
            </div>

            {/* Graph Switcher Tabs (Sales Graph vs Revenue Graph vs Both) */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 overflow-x-auto no-scrollbar max-w-full">
              <button
                type="button"
                onClick={() => setGraphMode('revenue')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  graphMode === 'revenue'
                    ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#006B70]" />
                <span>Revenue Graph</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphMode('sales')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  graphMode === 'sales'
                    ? 'bg-white text-indigo-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
                <span>Sales Graph</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphMode('both')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  graphMode === 'both'
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Both</span>
              </button>
            </div>
          </div>

          {/* Graph Legend */}
          <div className="flex items-center gap-4 mb-3 text-[11px] text-slate-500">
            {(graphMode === 'revenue' || graphMode === 'both') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-[#006B70]" />
                <span className="font-semibold text-slate-700">Revenue (₹)</span>
              </div>
            )}
            {(graphMode === 'sales' || graphMode === 'both') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-[#6366F1]" />
                <span className="font-semibold text-slate-700">Sales / Orders</span>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={activeChartData}
              margin={{
                top: 8,
                right: graphMode === 'both' ? 4 : 4,
                left: -14,
                bottom: 0,
              }}
            >
              <defs>
                {/* Revenue Gradient (Teal/Emerald) */}
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006B70" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#006B70" stopOpacity={0.0} />
                </linearGradient>
                {/* Sales / Orders Gradient (Electric Violet/Indigo) */}
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 6, right: 6 }}
              />
              
              {/* Left Y Axis for Revenue */}
              {(graphMode === 'revenue' || graphMode === 'both') && (
                <YAxis
                  yAxisId="revenue"
                  width={38}
                  tick={{ fontSize: 10, fill: '#006B70' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`}
                />
              )}

              {/* Right Y Axis for Sales / Orders */}
              {graphMode === 'sales' && (
                <YAxis
                  yAxisId="sales"
                  width={28}
                  tick={{ fontSize: 10, fill: '#6366F1' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}`}
                />
              )}

              {graphMode === 'both' && (
                <YAxis
                  yAxisId="sales"
                  orientation="right"
                  width={24}
                  tick={{ fontSize: 10, fill: '#6366F1' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}`}
                />
              )}

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs space-y-1.5 border border-slate-700">
                        <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">{label}</p>
                        {payload.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.stroke || entry.color }}
                              />
                              <span className="text-slate-300 capitalize">
                                {entry.dataKey === 'revenue' ? 'Revenue' : 'Sales'}
                              </span>
                            </div>
                            <span className="font-bold text-white font-mono">
                              {entry.dataKey === 'revenue'
                                ? `₹${Number(entry.value).toLocaleString('en-IN')}`
                                : `${entry.value} Orders`}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Revenue Line (Teal) */}
              {(graphMode === 'revenue' || graphMode === 'both') && (
                <Area
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#006B70"
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                  dot={{ r: 3, fill: '#006B70', strokeWidth: 1.5, stroke: '#ffffff' }}
                  activeDot={{ r: 5, fill: '#006B70', stroke: '#ffffff', strokeWidth: 2 }}
                />
              )}

              {/* Sales Line (Indigo / Violet) */}
              {(graphMode === 'sales' || graphMode === 'both') && (
                <Area
                  yAxisId="sales"
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fill="url(#colorSales)"
                  dot={{ r: 3, fill: '#6366F1', strokeWidth: 1.5, stroke: '#ffffff' }}
                  activeDot={{ r: 5, fill: '#6366F1', stroke: '#ffffff', strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Overview (Dynamically proportioned) */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-bold text-slate-800 text-sm">Order Overview</h3>
            <span className="text-[11px] font-semibold text-brand-teal bg-brand-powderLight px-2 py-0.5 rounded-full">
              {periodLabel}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100">
            <h3 className="font-sans font-bold text-slate-800 text-sm">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
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
                {adminOrders.slice(0, 6).map(order => (
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

          {/* Mobile Orders Card View */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {adminOrders.slice(0, 5).map(order => (
              <div
                key={order.id}
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-teal text-xs">#{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate">{order.customer.name}</span>
                  <span className="font-bold text-slate-900 font-mono">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{order.date}</span>
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100">
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
                className="flex items-center gap-3 px-3.5 sm:px-4 py-3 hover:bg-slate-100/70 cursor-pointer transition-colors group"
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
                    <span className="text-emerald-600 font-bold">{p.unitsSold || 0} sold</span>
                    <span className="mx-1.5">·</span>
                    ₹{Number(p.revenue || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Overview + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory Summary */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
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
        <div className="lg:col-span-2 bg-white rounded-xl border border-amber-100 shadow-sm border-l-4 border-l-amber-400 overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500" />
              <h3 className="font-sans font-bold text-slate-800 text-sm">Low Stock Alerts</h3>
            </div>
            <Link to="/admin/inventory" className="text-xs font-semibold text-brand-teal hover:underline">View all</Link>
          </div>

          {/* Desktop Low Stock Table */}
          <div className="hidden sm:block overflow-x-auto">
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

          {/* Mobile Low Stock Card View */}
          <div className="block sm:hidden divide-y divide-amber-100/60">
            {lowStockItems.map(item => {
              const status = getStockStatus(item.available, item.minimumStock);
              return (
                <div
                  key={item.id}
                  onClick={() => navigate('/admin/inventory')}
                  className="p-3.5 hover:bg-amber-50/40 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-xs truncate max-w-[180px]">{item.productName}</span>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-slate-400">{item.sku} · {item.variant}</span>
                    <span className={`font-bold ${item.available === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      Stock: {item.available} (Min: {item.minimumStock})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
