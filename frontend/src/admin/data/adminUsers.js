// Suka Fashions Admin Users & Roles System
// Exactly 4 roles: SUPER_ADMIN, ADMIN, MANAGER, STAFF
// Philosophy: ROLE defines who the person is. PERMISSIONS define what that person can do.

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
};

export const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
};

export const roleShortLabels = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
};

export const roleSubtitles = {
  SUPER_ADMIN: 'System Administration',
  ADMIN: 'Store Administration',
  MANAGER: 'Operations Management',
  STAFF: 'Operational Support',
};

export const ROLE_COLORS = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
  ADMIN: 'bg-brand-powder text-brand-teal border-brand-teal/20',
  MANAGER: 'bg-amber-50 text-amber-800 border-amber-200',
  STAFF: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const ROLE_BADGE_STYLES = {
  SUPER_ADMIN: 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold',
  ADMIN: 'bg-teal-50 text-teal-700 border border-teal-200 font-semibold',
  MANAGER: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
  STAFF: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
};

// Permission Preset Identifiers for Staff
export const STAFF_PRESETS = {
  STANDARD: 'Standard Staff',
  ORDER_HANDLING: 'Order Handling',
  INVENTORY_HANDLING: 'Inventory Handling',
  ORDERS_AND_INVENTORY: 'Orders + Inventory',
  CUSTOM: 'Custom',
};

// Granular Permission Schema Generator
export function createEmptyPermissions() {
  return {
    dashboard: { view: false },
    products: { view: false, create: false, edit: false, changePrice: false, delete: false },
    inventory: { view: false, update: false, adjust: false, viewHistory: false },
    orders: {
      view: false,
      confirm: false,
      pack: false,
      ship: false,
      deliver: false,
      cancel: false,
      returns: false,
      refund: false,
    },
    customers: { limitedView: false, fullView: false, edit: false },
    reviews: { view: false, manage: false },
    content: { view: false, edit: false, publish: false },
    reports: { operational: false, sales: false, revenue: false },
    users: { view: false, create: false, edit: false, disable: false },
    settings: { business: false, system: false, security: false },
  };
}

// Generate permissions by role and preset
export function getDefaultPermissions(role, preset = STAFF_PRESETS.STANDARD) {
  const p = createEmptyPermissions();

  if (role === ROLES.SUPER_ADMIN) {
    p.dashboard.view = true;
    p.products = { view: true, create: true, edit: true, changePrice: true, delete: true };
    p.inventory = { view: true, update: true, adjust: true, viewHistory: true };
    p.orders = { view: true, confirm: true, pack: true, ship: true, deliver: true, cancel: true, returns: true, refund: true };
    p.customers = { limitedView: true, fullView: true, edit: true };
    p.reviews = { view: true, manage: true };
    p.content = { view: true, edit: true, publish: true };
    p.reports = { operational: true, sales: true, revenue: true };
    p.users = { view: true, create: true, edit: true, disable: true };
    p.settings = { business: true, system: true, security: true };
    return p;
  }

  if (role === ROLES.ADMIN) {
    p.dashboard.view = true;
    p.products = { view: true, create: true, edit: true, changePrice: true, delete: true };
    p.inventory = { view: true, update: true, adjust: true, viewHistory: true };
    p.orders = { view: true, confirm: true, pack: true, ship: true, deliver: true, cancel: true, returns: true, refund: true };
    p.customers = { limitedView: true, fullView: true, edit: true };
    p.reviews = { view: true, manage: true };
    p.content = { view: true, edit: true, publish: true };
    p.reports = { operational: true, sales: true, revenue: true };
    p.users = { view: true, create: true, edit: true, disable: true }; // for Manager/Staff only
    p.settings = { business: true, system: false, security: false };
    return p;
  }

  if (role === ROLES.MANAGER) {
    p.dashboard.view = true;
    p.products = { view: true, create: true, edit: true, changePrice: true, delete: false };
    p.inventory = { view: true, update: true, adjust: true, viewHistory: true };
    p.orders = { view: true, confirm: true, pack: true, ship: true, deliver: true, cancel: true, returns: true, refund: false };
    p.customers = { limitedView: true, fullView: true, edit: false };
    p.reviews = { view: true, manage: true };
    p.content = { view: true, edit: false, publish: false }; // optional
    p.reports = { operational: true, sales: false, revenue: false };
    p.users = { view: false, create: false, edit: false, disable: false };
    p.settings = { business: false, system: false, security: false };
    return p;
  }

  // STAFF with Presets
  p.dashboard.view = true;
  p.products.view = true;

  if (preset === STAFF_PRESETS.ORDER_HANDLING) {
    p.orders.view = true;
    p.orders.confirm = true;
    p.orders.pack = true;
    p.orders.ship = true;
    p.customers.limitedView = true;
    p.inventory.view = true;
  } else if (preset === STAFF_PRESETS.INVENTORY_HANDLING) {
    p.inventory.view = true;
    p.inventory.update = true;
    p.inventory.viewHistory = true;
    p.orders.view = true;
  } else if (preset === STAFF_PRESETS.ORDERS_AND_INVENTORY) {
    p.inventory.view = true;
    p.inventory.update = true;
    p.orders.view = true;
    p.orders.confirm = true;
    p.orders.pack = true;
    p.orders.ship = true;
    p.customers.limitedView = true;
  } else {
    // Standard Staff Default
    p.inventory.view = true;
    p.orders.view = true;
    p.customers.limitedView = true;
  }

  return p;
}

// Permission Groups config for UI Checkbox rendering
export const PERMISSION_GROUPS = [
  {
    id: 'products',
    title: 'PRODUCTS',
    permissions: [
      { key: 'view', label: 'View Products', defaultStaff: true },
      { key: 'create', label: 'Add Products' },
      { key: 'edit', label: 'Edit Products' },
      { key: 'changePrice', label: 'Change Product Price' },
      { key: 'delete', label: 'Archive / Delete Products' },
    ],
  },
  {
    id: 'inventory',
    title: 'INVENTORY',
    permissions: [
      { key: 'view', label: 'View Stock', defaultStaff: true },
      { key: 'update', label: 'Update Stock' },
      { key: 'adjust', label: 'Adjust Stock' },
      { key: 'viewHistory', label: 'View Stock History' },
    ],
  },
  {
    id: 'orders',
    title: 'ORDERS',
    permissions: [
      { key: 'view', label: 'View Orders', defaultStaff: true },
      { key: 'confirm', label: 'Confirm Orders' },
      { key: 'pack', label: 'Pack Orders' },
      { key: 'ship', label: 'Mark as Shipped' },
      { key: 'deliver', label: 'Mark as Delivered' },
      { key: 'cancel', label: 'Cancel Orders' },
      { key: 'returns', label: 'Process Returns' },
      { key: 'refund', label: 'Process Refunds' },
    ],
  },
  {
    id: 'customers',
    title: 'CUSTOMERS',
    permissions: [
      { key: 'limitedView', label: 'Limited Customer View (Name, Phone, Shipping)', defaultStaff: true },
      { key: 'fullView', label: 'Full Customer View' },
      { key: 'edit', label: 'Edit Customer Information' },
    ],
  },
  {
    id: 'reviews',
    title: 'REVIEWS',
    permissions: [
      { key: 'view', label: 'View Reviews' },
      { key: 'manage', label: 'Approve / Reject Reviews' },
    ],
  },
  {
    id: 'content',
    title: 'CONTENT MANAGEMENT',
    permissions: [
      { key: 'view', label: 'View Content' },
      { key: 'edit', label: 'Edit Content' },
      { key: 'publish', label: 'Publish Content' },
    ],
  },
  {
    id: 'reports',
    title: 'REPORTS',
    permissions: [
      { key: 'operational', label: 'Operational Reports' },
      { key: 'sales', label: 'Sales Reports' },
      { key: 'revenue', label: 'Revenue Reports' },
    ],
  },
];

// Seed Administrative Users
export const initialAdminUsers = [
  {
    id: 'USR001',
    firstName: 'Valar',
    lastName: 'Tamizh',
    name: 'Valar Tamizh',
    email: 'valar@sukafashions.com',
    phone: '+91 94884 63850',
    role: ROLES.SUPER_ADMIN,
    status: 'active',
    lastLogin: '2026-09-11T10:45:00',
    createdAt: '2025-01-01',
    avatar: 'VT',
    title: 'System Administrator',
    preset: null,
    useRoleDefaults: true,
    permissions: getDefaultPermissions(ROLES.SUPER_ADMIN),
  },
  {
    id: 'USR002',
    firstName: 'Aditi',
    lastName: 'Sharma',
    name: 'Aditi Sharma',
    email: 'aditi@sukafashions.com',
    phone: '+91 98001 23456',
    role: ROLES.ADMIN,
    status: 'active',
    lastLogin: '2026-09-11T11:00:00',
    createdAt: '2025-03-15',
    avatar: 'AS',
    title: 'Store Administrator',
    preset: null,
    useRoleDefaults: true,
    permissions: getDefaultPermissions(ROLES.ADMIN),
  },
  {
    id: 'USR003',
    firstName: 'Priya',
    lastName: 'Sharma',
    name: 'Priya Sharma',
    email: 'priya@sukafashions.com',
    phone: '+91 97002 34567',
    role: ROLES.MANAGER,
    status: 'active',
    lastLogin: '2026-09-10T17:30:00',
    createdAt: '2025-06-10',
    avatar: 'PS',
    title: 'Operations Manager',
    preset: null,
    useRoleDefaults: false,
    permissions: {
      ...getDefaultPermissions(ROLES.MANAGER),
      content: { view: true, edit: true, publish: true }, // Granted content
    },
  },
  {
    id: 'USR004',
    firstName: 'Arun',
    lastName: 'Kumar',
    name: 'Arun Kumar',
    email: 'arun@sukafashions.com',
    phone: '+91 96003 45678',
    role: ROLES.STAFF,
    status: 'active',
    lastLogin: '2026-09-11T09:15:00',
    createdAt: '2025-09-01',
    avatar: 'AK',
    title: 'Inventory Specialist',
    preset: STAFF_PRESETS.INVENTORY_HANDLING,
    useRoleDefaults: false,
    permissions: getDefaultPermissions(ROLES.STAFF, STAFF_PRESETS.INVENTORY_HANDLING),
  },
  {
    id: 'USR005',
    firstName: 'Kavya',
    lastName: 'Patel',
    name: 'Kavya Patel',
    email: 'kavya@sukafashions.com',
    phone: '+91 95004 56789',
    role: ROLES.STAFF,
    status: 'active',
    lastLogin: '2026-09-11T08:30:00',
    createdAt: '2025-11-15',
    avatar: 'KP',
    title: 'Orders & Inventory',
    preset: STAFF_PRESETS.ORDERS_AND_INVENTORY,
    useRoleDefaults: false,
    permissions: getDefaultPermissions(ROLES.STAFF, STAFF_PRESETS.ORDERS_AND_INVENTORY),
  },
  {
    id: 'USR006',
    firstName: 'Sneha',
    lastName: 'Nair',
    name: 'Sneha Nair',
    email: 'sneha@sukafashions.com',
    phone: '+91 94005 67890',
    role: ROLES.STAFF,
    status: 'active',
    lastLogin: '2026-09-09T14:20:00',
    createdAt: '2025-12-01',
    avatar: 'SN',
    title: 'Order Fulfillment',
    preset: STAFF_PRESETS.ORDER_HANDLING,
    useRoleDefaults: false,
    permissions: getDefaultPermissions(ROLES.STAFF, STAFF_PRESETS.ORDER_HANDLING),
  },
];

export const adminUsers = initialAdminUsers;

// Initial Audit Logs (Tracking sensitive activities & user modifications)
export const initialAuditLogs = [
  {
    id: 'LOG001',
    timestamp: '2026-09-11T11:20:00',
    actorName: 'Arun Kumar',
    actorRole: ROLES.STAFF,
    action: 'INVENTORY_STOCK_UPDATED',
    target: 'Floral Organza Saree (Teal / M)',
    details: 'Stock adjusted: 8 → 15 units',
  },
  {
    id: 'LOG002',
    timestamp: '2026-09-11T10:45:00',
    actorName: 'Valar Tamizh',
    actorRole: ROLES.SUPER_ADMIN,
    action: 'SYSTEM_CONFIG_UPDATED',
    target: 'System Settings',
    details: 'Configured WhatsApp API routing & Spring Boot endpoints',
  },
  {
    id: 'LOG003',
    timestamp: '2026-09-11T10:15:00',
    actorName: 'Aditi Sharma',
    actorRole: ROLES.ADMIN,
    action: 'USER_PERMISSIONS_UPDATED',
    target: 'Priya Sharma (Manager)',
    details: 'Enabled Content Management publishing authority',
  },
  {
    id: 'LOG004',
    timestamp: '2026-09-11T09:40:00',
    actorName: 'Priya Sharma',
    actorRole: ROLES.MANAGER,
    action: 'HOMEPAGE_PUBLISHED',
    target: 'Storefront Content',
    details: 'Published Festive Silk Collection curated showcase',
  },
  {
    id: 'LOG005',
    timestamp: '2026-09-11T09:15:00',
    actorName: 'Kavya Patel',
    actorRole: ROLES.STAFF,
    action: 'ORDER_STATUS_CHANGED',
    target: 'Order #SUK1028',
    details: 'Status updated: Confirmed → Shipped (Airway: DEL78912)',
  },
  {
    id: 'LOG006',
    timestamp: '2026-09-10T16:10:00',
    actorName: 'Aditi Sharma',
    actorRole: ROLES.ADMIN,
    action: 'USER_CREATED',
    target: 'Kavya Patel (Staff)',
    details: 'Created account with "Orders + Inventory" preset',
  },
  {
    id: 'LOG007',
    timestamp: '2026-09-08T11:30:00',
    actorName: 'Aditi Sharma',
    actorRole: ROLES.ADMIN,
    action: 'USER_STATUS_CHANGED',
    target: 'Sneha Nair (Staff)',
    details: 'Reactivated account for festive season',
  },
];

// Helper to determine assignable roles based on current logged in role
export function getAssignableRoles(currentRole) {
  if (currentRole === ROLES.SUPER_ADMIN) {
    return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF];
  }
  if (currentRole === ROLES.ADMIN) {
    return [ROLES.MANAGER, ROLES.STAFF]; // Admin cannot create Super Admin or another Admin
  }
  return []; // Manager & Staff cannot create accounts
}

// Generate Avatar Initials
export function getAvatarInitials(name) {
  if (!name) return 'SF';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
