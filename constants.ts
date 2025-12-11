
// ... existing imports ...
import {
    Company, CompanyType, User, UserRole, RestaurantSettings, SupermarketSettings, PublicPage,
    Section, SubscriptionPlanDetails, HotelSettings, TourismSettings, WebsiteBuilderSettings, Currency,
    SystemPublicPage, LoyaltyProgram, Role, EmployeePermission, MenuItem, RestaurantTable, TableStatus,
    Ingredient, SyncStatus, Transaction, TransactionType, Floor, RoomType, HousekeepingStatus, Room, BrochureDesign, SavedBrochure,
    AutomotiveProduct, FuelType, Transmission, VehicleCondition, Drivetrain, PropertyListing, Project, Blueprint, TourPackage, Resource,
    EcommerceSettings, ShippingZone, EcommerceProduct, SupermarketSale, SupermarketCartItem,
    Appointment, AppointmentSettings, AppointmentStatus, Service, WorkingHour, TakeawayOrder,
    Account, AccountType, ProductsSection, Theme, ThemePreset, BrochureElement,
    CompanyData, StockMovement, SupermarketProduct
} from './types';
import { TFunction } from 'i18next';

// ... existing constants ...

export const SUBSCRIPTION_EXPIRY_ALERT_DAYS = 7;

// Default Settings
export const DEFAULT_BROCHURE_DESIGN: BrochureDesign = {
    backgroundColor: '#FFFFFF',
    width_mm: 210,
    height_mm: 297,
    dpi: 300,
    elements: [
        {
            id: 'el_header_1',
            type: 'text',
            x: 50,
            y: 30,
            width: 700,
            height: 60,
            content: 'New Brochure',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#000000',
            rotation: 0,
        }
    ],
};

export const DEFAULT_MENU_DESIGN: BrochureDesign = {
    backgroundColor: '#FFFFFF',
    width_mm: 210,
    height_mm: 297,
    dpi: 300,
    elements: [
        {
             id: 'el_menu_header',
             type: 'text',
             x: 50,
             y: 30,
             width: 700,
             height: 60,
             content: 'Menu',
             fontSize: 36,
             fontWeight: 'bold',
             textAlign: 'center',
             color: '#000000',
             rotation: 0
        }
    ]
};

export const MOCK_LOYALTY_PROGRAM: LoyaltyProgram = {
    isEnabled: false,
    pointsPerCurrencyUnit: 1,
    tiers: []
};

export const DEFAULT_RESTAURANT_SETTINGS: RestaurantSettings = {
    generalTax: { name: 'VAT', rate: 15, isEnabled: true },
    receipt: {
        headerText: 'Welcome to our Restaurant',
        footerText: 'Thank you for dining with us!',
        showLogo: true,
        showBarcode: true,
        fontSize: 12,
        barcodeHeight: 40,
        barcodeWidth: 2,
        showDate: true,
        showTime: true,
        showCustomer: true,
        showCashier: true,
        paperSize: '80mm',
        showTaxNumber: true,
        showQrCode: true,
        showPaymentDetails: true,
        showTaxBreakdown: true
    },
    takeawayCounter: 0,
    allowCustomerRegistration: true,
    loyaltyProgram: MOCK_LOYALTY_PROGRAM,
    savedBrochures: []
};

export const DEFAULT_SUPERMARKET_SETTINGS: SupermarketSettings = {
    generalTax: { name: 'VAT', rate: 15, isEnabled: true },
    receipt: {
        headerText: 'Welcome to our Supermarket',
        footerText: 'Thank you for shopping with us!',
        showLogo: true,
        showBarcode: true,
        fontSize: 12,
        barcodeHeight: 40,
        barcodeWidth: 2,
        showDate: true,
        showTime: true,
        showCustomer: true,
        showCashier: true,
        paperSize: '80mm',
        showTaxNumber: true,
        showQrCode: true,
        showPaymentDetails: true,
        showTaxBreakdown: true
    },
    scaleSettings: {
        format: 'generic',
        barcodePrefix: '27',
        productCodeLength: 5,
        valueIsPrice: false,
        valueLength: 5,
        weightDecimalPlaces: 3
    },
    allowCustomerRegistration: true,
    loyaltyProgram: MOCK_LOYALTY_PROGRAM,
    savedBrochures: [],
    expiryAlertThresholdDays: 30
};

// ... other constants ...

export const DEFAULT_HOTEL_SETTINGS: HotelSettings = {
    generalTax: { name: 'VAT', rate: 15, isEnabled: true },
    receipt: {
        headerText: 'Welcome to our Hotel',
        footerText: 'We hope you enjoy your stay!',
        showLogo: true,
        showBarcode: false,
        fontSize: 12,
        barcodeHeight: 40,
        barcodeWidth: 2,
        showDate: true,
        showTime: true,
        showCustomer: true,
        showCashier: true,
        paperSize: '80mm',
        showTaxNumber: true,
        showQrCode: true,
        showPaymentDetails: true,
        showTaxBreakdown: true
    },
    allowCustomerRegistration: true,
    loyaltyProgram: MOCK_LOYALTY_PROGRAM,
    savedBrochures: []
};

export const DEFAULT_TOURISM_SETTINGS: TourismSettings = {};
export const DEFAULT_WEBSITE_BUILDER_SETTINGS: WebsiteBuilderSettings = {};
export const DEFAULT_APPOINTMENT_SETTINGS: AppointmentSettings = {};

export const DEFAULT_CHART_OF_ACCOUNTS: Account[] = [
    { id: '1', name: 'accounting.accounts.assets', type: AccountType.Asset, parentAccountId: null, balance: 0 },
    { id: '1001', name: 'accounting.accounts.cash', type: AccountType.Asset, parentAccountId: '1', balance: 0 },
    { id: '1002', name: 'accounting.accounts.bank', type: AccountType.Asset, parentAccountId: '1', balance: 0 },
    { id: '1003', name: 'accounting.accounts.inventory', type: AccountType.Asset, parentAccountId: '1', balance: 0 },
    { id: '2', name: 'accounting.accounts.liabilities', type: AccountType.Liability, parentAccountId: null, balance: 0 },
    { id: '2001', name: 'accounting.accounts.accountsPayable', type: AccountType.Liability, parentAccountId: '2', balance: 0 },
    { id: '3', name: 'accounting.accounts.equity', type: AccountType.Equity, parentAccountId: null, balance: 0 },
    { id: '4', name: 'accounting.accounts.revenue', type: AccountType.Revenue, parentAccountId: null, balance: 0 },
    { id: '4001', name: 'accounting.accounts.sales', type: AccountType.Revenue, parentAccountId: '4', balance: 0 },
    { id: '5', name: 'accounting.accounts.expenses', type: AccountType.Expense, parentAccountId: null, balance: 0 },
    { id: '5001', name: 'accounting.accounts.cogs', type: AccountType.Expense, parentAccountId: '5', balance: 0 },
    { id: '5002', name: 'accounting.accounts.rent', type: AccountType.Expense, parentAccountId: '5', balance: 0 },
    { id: '5003', name: 'accounting.accounts.salaries', type: AccountType.Expense, parentAccountId: '5', balance: 0 },
    { id: '5004', name: 'accounting.accounts.utilities', type: AccountType.Expense, parentAccountId: '5', balance: 0 },
    { id: '5008', name: 'accounting.accounts.wastage', type: AccountType.Expense, parentAccountId: '5', balance: 0 },
];

// ... users and plans ...
export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlanDetails[] = [
    {
        id: 'plan_basic',
        name: 'subscriptions.plans.basic',
        price: 0,
        storageLimitMB: 500,
        features: { pos: true, accounting: true, inventory: false, crm: false, payroll: false, commissions: false, ecommerce: false }
    },
    {
        id: 'plan_pro',
        name: 'subscriptions.plans.pro',
        price: 100,
        storageLimitMB: 5000,
        features: { pos: true, accounting: true, inventory: true, crm: true, payroll: true, commissions: true, ecommerce: true }
    }
];

export const MOCK_CURRENCIES: Currency[] = [
    { code: 'SAR', name: 'settings.currencies.sar' },
    { code: 'USD', name: 'settings.currencies.usd' },
    { code: 'EUR', name: 'settings.currencies.eur' },
    { code: 'TRY', name: 'settings.currencies.try' }
];

export const getDefaultPublicPage = (companyName: string, type: CompanyType, t: TFunction): PublicPage => {
    let sections: Section[] = [
        { id: 'hero', type: 'hero', title: companyName, subtitle: 'Welcome to our website', imageUrl: 'https://picsum.photos/1200/400', backgroundColor: '#ffffff', paddingY: 'lg', marginY: 'none', layout: 'single-column' },
        { id: 'contact', type: 'contact', title: 'publicPage.defaults.contact.title', show_form: true, show_map: true, backgroundColor: '#f8fafc', paddingY: 'md', marginY: 'md', layout: 'single-column' }
    ];

    if (type === CompanyType.Restaurant) {
        sections.splice(1, 0, { id: 'menu', type: 'menu', title: 'publicPage.defaults.menu.title', backgroundColor: '#ffffff', paddingY: 'md', marginY: 'md', layout: 'single-column' });
    } else if (type === CompanyType.Supermarket || type === CompanyType.Ecommerce) {
        sections.splice(1, 0, { id: 'products', type: 'products', title: 'publicPage.defaults.products.title', backgroundColor: '#ffffff', paddingY: 'md', marginY: 'md', layout: 'single-column' });
    }

    return {
        isEnabled: true,
        template: 'modern',
        theme: {
            logoUrl: '',
            primaryColor: '#4f46e5',
            backgroundColor: '#f1f5f9',
            fontFamily: 'cairo',
            layout: 'contained',
        },
        sections: sections
    };
};

export const PAGE_TEMPLATES = [
    { id: 'modern', name: 'publicPage.design.templates.modern', description: 'publicPage.design.templates.modernDesc' },
    { id: 'classic', name: 'publicPage.design.templates.classic', description: 'publicPage.design.templates.classicDesc' },
    { id: 'minimal', name: 'publicPage.design.templates.minimal', description: 'publicPage.design.templates.minimalDesc' },
];

export const getSectionsForTemplate = (templateId: string, companyName: string, companyType: CompanyType, t: TFunction): Section[] => {
    return getDefaultPublicPage(companyName, companyType, t).sections;
};

export const MOCK_SYSTEM_PUBLIC_PAGES: SystemPublicPage[] = [
    {
        id: 'sys_page_main',
        name: 'Platform Main Page',
        slug: 'main',
        pageType: 'PLATFORM_OFFERS',
        pageContent: {
            isEnabled: true,
            template: 'modern', // Added missing property
            theme: { logoUrl: '', primaryColor: '#4f46e5', backgroundColor: '#ffffff', fontFamily: 'cairo', layout: 'full-width' },
            sections: [
                { id: 'hero', type: 'hero', title: 'Welcome to Our Platform', subtitle: 'Discover amazing companies', imageUrl: 'https://picsum.photos/1200/500', backgroundColor: '#ffffff', paddingY: 'lg', marginY: 'none', layout: 'single-column' },
                { id: 'aggregator', type: 'companies_aggregator', title: 'Featured Companies', settings: { visibleCompanyIds: [], companyOrder: [] }, backgroundColor: '#f8fafc', paddingY: 'md', marginY: 'md', layout: 'single-column' }
            ]
        }
    }
];

// Helper to create dummy admins
const createAdmin = (id: string, name: string, companyId: string, email: string) => ({
    id,
    name,
    firstName: name.split(' ')[0],
    lastName: name.split(' ')[1] || 'Admin',
    email: email,
    password: '123',
    role: UserRole.COMPANY_ADMIN,
    companyId,
    language: 'ar' as const,
    theme: 'light' as const,
    enableNotifications: true
});

export const MOCK_USERS: User[] = [
    {
        id: 'super_admin',
        name: 'Super Admin',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'super@app.com',
        password: '123',
        role: UserRole.SUPER_ADMIN,
        companyId: '',
        language: 'ar',
        theme: 'light',
        enableNotifications: true,
        superAdminPermissions: []
    },
    // The 10 specific company admins requested
    createAdmin('admin1', 'Restaurant Admin', 'c1', 'admin1@app.com'),
    createAdmin('admin2', 'Supermarket Admin', 'c2', 'admin2@app.com'),
    createAdmin('admin3', 'Commission Admin', 'c3', 'admin3@app.com'),
    createAdmin('admin4', 'Hotel Admin', 'c4', 'admin4@app.com'),
    createAdmin('admin5', 'Auto Admin', 'c5', 'admin5@app.com'),
    createAdmin('admin6', 'RealEstate Admin', 'c6', 'admin6@app.com'),
    createAdmin('admin7', 'Factory Admin', 'c7', 'admin7@app.com'),
    createAdmin('admin8', 'Tourism Admin', 'c8', 'admin8@app.com'),
    createAdmin('admin9', 'Ecom Admin', 'c9', 'admin9@app.com'),
    createAdmin('admin10', 'Personal User', 'c10', 'admin10@app.com'),
    
    // Staff for Restaurant (c1)
    {
        id: 'waiter1',
        name: 'John Waiter',
        firstName: 'John',
        lastName: 'Waiter',
        email: 'waiter@app.com',
        password: '123',
        role: UserRole.EMPLOYEE,
        companyId: 'c1',
        roleId: 'role_waiter',
        baseSalary: 2000,
        commissionRate: 0.05,
        language: 'ar',
        theme: 'light',
        enableNotifications: true
    },
    {
        id: 'kitchen1',
        name: 'Chef Mike',
        firstName: 'Chef',
        lastName: 'Mike',
        email: 'kitchen@app.com',
        password: '123',
        role: UserRole.EMPLOYEE,
        companyId: 'c1',
        roleId: 'role_kitchen',
        baseSalary: 3000,
        language: 'ar',
        theme: 'light',
        enableNotifications: true
    },
    {
        id: 'cashier1',
        name: 'Sara Cashier',
        firstName: 'Sara',
        lastName: 'Cashier',
        email: 'cashier@app.com',
        password: '123',
        role: UserRole.EMPLOYEE,
        companyId: 'c1',
        roleId: 'role_cashier',
        baseSalary: 2500,
        language: 'ar',
        theme: 'light',
        enableNotifications: true
    }
];

// Define default company features
const FULL_FEATURES = { pos: true, accounting: true, inventory: true, crm: true, payroll: true, commissions: true, ecommerce: true };
const DEFAULT_NOTIFICATION_SETTINGS = { sms: { enabled: false, provider: '', apiKey: '' }, email: { enabled: false, provider: '', apiKey: '' } };

export const MOCK_COMPANIES: Company[] = [
    { id: 'c1', name: 'Tasty Burger', slug: 'tasty-burger', type: CompanyType.Restaurant, adminUserId: 'admin1', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 120, features: FULL_FEATURES, publicPage: getDefaultPublicPage('Tasty Burger', CompanyType.Restaurant, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Main Branch', address: '123 Main St' }], restaurantSettings: DEFAULT_RESTAURANT_SETTINGS, ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { 
        id: 'c2', 
        name: 'Fresh Market', 
        slug: 'fresh-market', 
        type: CompanyType.Supermarket, 
        adminUserId: 'admin2', 
        currency: 'SAR', 
        createdAt: new Date().toISOString(), 
        syncStatus: SyncStatus.Synced, 
        storageUsageMB: 200, 
        features: FULL_FEATURES, 
        publicPage: getDefaultPublicPage('Fresh Market', CompanyType.Supermarket, (key) => key), 
        subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, 
        formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, 
        branches: [
            { id: 'b1', name: 'الفرع الرئيسي (City Center)', address: '456 Market St' },
            { id: 'b2', name: 'فرع الشمال (North Branch)', address: '789 North Rd' }
        ], 
        supermarketSettings: DEFAULT_SUPERMARKET_SETTINGS, 
        ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM },
        notificationSettings: DEFAULT_NOTIFICATION_SETTINGS 
    },
    { id: 'c3', name: 'Fashion Boutique', slug: 'fashion-boutique', type: CompanyType.Commission, adminUserId: 'admin3', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 50, features: FULL_FEATURES, publicPage: getDefaultPublicPage('Fashion Boutique', CompanyType.Commission, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Mall Branch', address: '789 Mall Ave' }], supermarketSettings: DEFAULT_SUPERMARKET_SETTINGS, ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { id: 'c4', name: 'Grand Plaza Hotel', slug: 'grand-plaza', type: CompanyType.Hotel, adminUserId: 'admin4', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 300, features: FULL_FEATURES, publicPage: getDefaultPublicPage('Grand Plaza', CompanyType.Hotel, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Main Building', address: '101 Hotel Blvd' }], hotelSettings: DEFAULT_HOTEL_SETTINGS, ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { id: 'c5', name: 'Speedy Motors', slug: 'speedy-motors', type: CompanyType.Automotive, adminUserId: 'admin5', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 150, features: FULL_FEATURES, publicPage: getDefaultPublicPage('Speedy Motors', CompanyType.Automotive, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Showroom', address: '202 Auto Park' }], ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { id: 'c6', name: 'Dream Homes', slug: 'dream-homes', type: CompanyType.RealEstate, adminUserId: 'admin6', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 100, features: FULL_FEATURES, publicPage: getDefaultPublicPage('Dream Homes', CompanyType.RealEstate, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Main Office', address: '303 Estate Rd' }], ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { id: 'c7', name: 'Tech Factory', slug: 'tech-factory', type: CompanyType.Manufacturing, adminUserId: 'admin7', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 250, features: FULL_FEATURES, publicPage: getDefaultPublicPage('Tech Factory', CompanyType.Manufacturing, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Plant A', address: '404 Industrial Zone' }], manufacturingSettings: {}, ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { id: 'c8', name: 'World Travels', slug: 'world-travels', type: CompanyType.Tourism, adminUserId: 'admin8', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 80, features: FULL_FEATURES, publicPage: getDefaultPublicPage('World Travels', CompanyType.Tourism, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Headquarters', address: '505 Tour St' }], tourismSettings: DEFAULT_TOURISM_SETTINGS, ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { id: 'c9', name: 'Online Store', slug: 'online-store', type: CompanyType.Ecommerce, adminUserId: 'admin9', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 60, features: FULL_FEATURES, publicPage: getDefaultPublicPage('Online Store', CompanyType.Ecommerce, (key) => key), subscription: { planId: 'plan_pro', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Warehouse', address: '606 Digital Ln' }], ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
    { id: 'c10', name: 'My Wallet', slug: 'my-wallet', type: CompanyType.Personal, adminUserId: 'admin10', currency: 'SAR', createdAt: new Date().toISOString(), syncStatus: SyncStatus.Synced, storageUsageMB: 10, features: FULL_FEATURES, publicPage: getDefaultPublicPage('My Wallet', CompanyType.Personal, (key) => key), subscription: { planId: 'plan_basic', status: 'active', expiryDate: '2025-12-31' }, formattingSettings: { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' }, branches: [{ id: 'b1', name: 'Home', address: '707 Home St' }], ecommerceSettings: { shippingZones: [], allowGuestCheckout: true, loyaltyProgram: MOCK_LOYALTY_PROGRAM }, notificationSettings: DEFAULT_NOTIFICATION_SETTINGS },
];

// Generate 100 mock supermarket products
const generateSupermarketProducts = () => {
    const products: any[] = [];
    const categories = [
        { id: 'veg', name: 'خضروات وفواكه' },
        { id: 'dairy', name: 'ألبان وأجبان' },
        { id: 'meat', name: 'لحوم ودواجن' },
        { id: 'bakery', name: 'مخبوزات' },
        { id: 'drinks', name: 'مشروبات' },
        { id: 'canned', name: 'مواد غذائية ومعلبات' },
        { id: 'cleaning', name: 'منظفات ومنزليات' },
        { id: 'personal', name: 'العناية الشخصية' },
        { id: 'snacks', name: 'وجبات خفيفة وحلويات' },
        { id: 'frozen', name: 'مجمدات' },
    ];

    const items = [
        // Veg & Fruits (Weight)
        { name: 'طماطم', cat: 'veg', price: 5.00, cost: 3.00, unit: 'weight' },
        { name: 'خيار', cat: 'veg', price: 4.50, cost: 2.50, unit: 'weight' },
        { name: 'بطاطس', cat: 'veg', price: 3.50, cost: 1.50, unit: 'weight' },
        { name: 'بصل', cat: 'veg', price: 3.00, cost: 1.20, unit: 'weight' },
        { name: 'جزر', cat: 'veg', price: 4.00, cost: 2.00, unit: 'weight' },
        { name: 'خس', cat: 'veg', price: 6.00, cost: 3.00, unit: 'weight' },
        { name: 'ليمون', cat: 'veg', price: 8.00, cost: 5.00, unit: 'weight' },
        { name: 'تفاح أحمر', cat: 'veg', price: 9.00, cost: 6.00, unit: 'weight' },
        { name: 'موز', cat: 'veg', price: 5.50, cost: 3.50, unit: 'weight' },
        { name: 'برتقال', cat: 'veg', price: 6.50, cost: 4.00, unit: 'weight' },
        
        // Dairy (Piece)
        { name: 'حليب كامل الدسم (1 لتر)', cat: 'dairy', price: 6.00, cost: 4.50 },
        { name: 'حليب قليل الدسم (1 لتر)', cat: 'dairy', price: 6.00, cost: 4.50 },
        { name: 'زبادي (170 جم)', cat: 'dairy', price: 2.00, cost: 1.20 },
        { name: 'لبنة (500 جم)', cat: 'dairy', price: 15.00, cost: 10.00 },
        { name: 'جبنة شيدر', cat: 'dairy', price: 12.00, cost: 8.00 },
        { name: 'جبنة موزاريلا مبشورة', cat: 'dairy', price: 25.00, cost: 18.00 },
        { name: 'زبدة غير مملحة', cat: 'dairy', price: 8.00, cost: 5.00 },
        { name: 'قشطة', cat: 'dairy', price: 4.00, cost: 2.50 },
        { name: 'جبنة فيتا', cat: 'dairy', price: 10.00, cost: 6.50 },
        { name: 'بيض (طبق 30)', cat: 'dairy', price: 18.00, cost: 14.00 },

        // Bakery
        { name: 'خبز توست أبيض', cat: 'bakery', price: 5.00, cost: 3.00 },
        { name: 'خبز توست بر', cat: 'bakery', price: 6.00, cost: 3.50 },
        { name: 'خبز صامولي (كيس)', cat: 'bakery', price: 2.00, cost: 1.00 },
        { name: 'كرواسون سادة', cat: 'bakery', price: 3.00, cost: 1.50 },
        { name: 'خبز برجر', cat: 'bakery', price: 4.00, cost: 2.00 },
        { name: 'فطيرة جبن', cat: 'bakery', price: 2.50, cost: 1.25 },
        { name: 'شابورة', cat: 'bakery', price: 10.00, cost: 6.00 },
        { name: 'معمول تمر', cat: 'bakery', price: 15.00, cost: 9.00 },
        { name: 'كيك شوكولاتة', cat: 'bakery', price: 8.00, cost: 5.00 },
        { name: 'خبز تورتيلا', cat: 'bakery', price: 7.00, cost: 4.00 },

        // Meat
        { name: 'دجاج كامل طازج (1000 جم)', cat: 'meat', price: 16.00, cost: 12.00 },
        { name: 'صدور دجاج فيليه', cat: 'meat', price: 20.00, cost: 15.00 },
        { name: 'لحم غنم نعيمي (كيلو)', cat: 'meat', price: 65.00, cost: 50.00, unit: 'weight' },
        { name: 'لحم عجل مفروم (كيلو)', cat: 'meat', price: 45.00, cost: 35.00, unit: 'weight' },
        { name: 'برجر دجاج (مجمّد)', cat: 'meat', price: 22.00, cost: 16.00 },
        { name: 'ناجت دجاج', cat: 'meat', price: 18.00, cost: 13.00 },
        { name: 'نقانق', cat: 'meat', price: 8.00, cost: 5.00 },
        { name: 'كبدة غنم (كيلو)', cat: 'meat', price: 30.00, cost: 20.00, unit: 'weight' },
        { name: 'شاورما دجاج متبل', cat: 'meat', price: 24.00, cost: 18.00 },
        { name: 'ريش غنم (كيلو)', cat: 'meat', price: 70.00, cost: 55.00, unit: 'weight' },

        // Drinks
        { name: 'مياه معدنية (330 مل)', cat: 'drinks', price: 1.00, cost: 0.50 },
        { name: 'بيبسي (علبة)', cat: 'drinks', price: 2.50, cost: 1.80 },
        { name: 'سفن أب (علبة)', cat: 'drinks', price: 2.50, cost: 1.80 },
        { name: 'عصير برتقال (1 لتر)', cat: 'drinks', price: 8.00, cost: 5.00 },
        { name: 'عصير تفاح (1 لتر)', cat: 'drinks', price: 8.00, cost: 5.00 },
        { name: 'مشروب طاقة', cat: 'drinks', price: 10.00, cost: 6.00 },
        { name: 'شاي (100 كيس)', cat: 'drinks', price: 15.00, cost: 10.00 },
        { name: 'قهوة عربية (500 جم)', cat: 'drinks', price: 40.00, cost: 30.00 },
        { name: 'قهوة سريعة التحضير', cat: 'drinks', price: 25.00, cost: 18.00 },
        { name: 'حليب بالنكهات', cat: 'drinks', price: 3.00, cost: 1.50 },

        // Canned/Pantry
        { name: 'أرز بسمتي (5 كجم)', cat: 'canned', price: 45.00, cost: 35.00 },
        { name: 'سكر ناعم (2 كجم)', cat: 'canned', price: 8.00, cost: 5.00 },
        { name: 'زيت نباتي (1.5 لتر)', cat: 'canned', price: 18.00, cost: 13.00 },
        { name: 'مكرونة (500 جم)', cat: 'canned', price: 4.00, cost: 2.00 },
        { name: 'صلصة طماطم', cat: 'canned', price: 2.00, cost: 1.00 },
        { name: 'تونة', cat: 'canned', price: 6.00, cost: 4.00 },
        { name: 'ذرة حلوة', cat: 'canned', price: 3.50, cost: 2.00 },
        { name: 'فول مدمس', cat: 'canned', price: 3.00, cost: 1.50 },
        { name: 'حمص بالطحينة', cat: 'canned', price: 4.00, cost: 2.50 },
        { name: 'كاتشب', cat: 'canned', price: 10.00, cost: 7.00 },

        // Snacks
        { name: 'شيبس بطاطس (عائلي)', cat: 'snacks', price: 7.00, cost: 4.00 },
        { name: 'بسكويت شاي', cat: 'snacks', price: 2.00, cost: 1.00 },
        { name: 'شوكولاتة بالحليب', cat: 'snacks', price: 4.00, cost: 2.50 },
        { name: 'مكسرات مشكلة', cat: 'snacks', price: 20.00, cost: 14.00 },
        { name: 'فشار', cat: 'snacks', price: 5.00, cost: 2.50 },
        { name: 'علكة', cat: 'snacks', price: 1.50, cost: 0.75 },
        { name: 'ويفر', cat: 'snacks', price: 1.00, cost: 0.50 },
        { name: 'كوكيز', cat: 'snacks', price: 12.00, cost: 8.00 },
        { name: 'جيلي', cat: 'snacks', price: 3.00, cost: 1.50 },
        { name: 'حلوى مصاص', cat: 'snacks', price: 0.50, cost: 0.20 },

        // Personal Care
        { name: 'شامبو للشعر', cat: 'personal', price: 18.00, cost: 12.00 },
        { name: 'صابون يد سائل', cat: 'personal', price: 12.00, cost: 8.00 },
        { name: 'معجون أسنان', cat: 'personal', price: 10.00, cost: 6.00 },
        { name: 'فرشاة أسنان', cat: 'personal', price: 5.00, cost: 2.50 },
        { name: 'مزيل عرق', cat: 'personal', price: 14.00, cost: 9.00 },
        { name: 'مناديل ورقية', cat: 'personal', price: 3.00, cost: 1.50 },
        { name: 'حفاضات أطفال', cat: 'personal', price: 60.00, cost: 45.00 },
        { name: 'سائل استحمام', cat: 'personal', price: 22.00, cost: 15.00 },
        { name: 'كريم مرطب', cat: 'personal', price: 25.00, cost: 18.00 },
        { name: 'شفرات حلاقة', cat: 'personal', price: 15.00, cost: 10.00 },

        // Cleaning
        { name: 'سائل غسيل صحون', cat: 'cleaning', price: 10.00, cost: 6.00 },
        { name: 'مسحوق غسيل ملابس (3 كجم)', cat: 'cleaning', price: 35.00, cost: 25.00 },
        { name: 'مبيض ملابس', cat: 'cleaning', price: 8.00, cost: 5.00 },
        { name: 'مطهر أرضيات', cat: 'cleaning', price: 15.00, cost: 9.00 },
        { name: 'مناديل مطبخ', cat: 'cleaning', price: 6.00, cost: 3.50 },
        { name: 'أكياس نفايات', cat: 'cleaning', price: 5.00, cost: 3.00 },
        { name: 'إسفنج غسيل', cat: 'cleaning', price: 3.00, cost: 1.50 },
        { name: 'معطر جو', cat: 'cleaning', price: 12.00, cost: 8.00 },
        { name: 'ورق قصدير', cat: 'cleaning', price: 10.00, cost: 6.00 },
        { name: 'صابون غسالة صحون', cat: 'cleaning', price: 25.00, cost: 18.00 },

        // Frozen
        { name: 'بطاطس مقلية (1 كجم)', cat: 'frozen', price: 12.00, cost: 8.00 },
        { name: 'بازلاء خضراء', cat: 'frozen', price: 6.00, cost: 3.50 },
        { name: 'خضروات مشكلة', cat: 'frozen', price: 6.00, cost: 3.50 },
        { name: 'بامية', cat: 'frozen', price: 7.00, cost: 4.00 },
        { name: 'فراولة مجمدة', cat: 'frozen', price: 9.00, cost: 5.50 },
        { name: 'عجينة بف باستري', cat: 'frozen', price: 8.00, cost: 5.00 },
        { name: 'آيس كريم فانيليا', cat: 'frozen', price: 15.00, cost: 10.00 },
        { name: 'سمبوسة جبن', cat: 'frozen', price: 18.00, cost: 12.00 },
        { name: 'براتا سادة', cat: 'frozen', price: 5.00, cost: 3.00 },
        { name: 'كبة لحم', cat: 'frozen', price: 20.00, cost: 14.00 },
    ];

    let idCounter = 1;
    items.forEach(item => {
        const catName = categories.find(c => c.id === item.cat)?.name || 'عام';
        products.push({
            id: `p${idCounter}`,
            name: item.name,
            category: catName,
            price: item.price,
            cost: item.cost,
            barcode: `${1000 + idCounter}`,
            stockByBranch: { 
                'b1': Math.floor(Math.random() * 100) + 20,
                'b2': Math.floor(Math.random() * 50) + 5 
            },
            lowStockThreshold: 10,
            imageUrls: [],
            unitType: item.unit || 'piece'
        });
        idCounter++;
    });

    return products;
}

const MOCK_SUPERMARKET_PRODUCTS = generateSupermarketProducts();

// Generate dummy movements for the demo
const generateMockStockMovements = (products: SupermarketProduct[]) => {
    const movements: StockMovement[] = [];
    const users = MOCK_USERS;
    const branches = ['b1', 'b2'];
    
    // Generate some random movements
    products.forEach(product => {
        // Initial stock
        movements.push({
            id: `sm_init_${product.id}`,
            productId: product.id,
            type: 'adjustment',
            quantity: 100,
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            branchId: 'b1',
            performedBy: 'admin2',
            notes: 'Initial Inventory'
        });
        
        // Some sales
        if (Math.random() > 0.5) {
             movements.push({
                id: `sm_sale_${product.id}`,
                productId: product.id,
                type: 'sale',
                quantity: -Math.floor(Math.random() * 5 + 1),
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                branchId: 'b1',
                performedBy: 'admin2',
                referenceId: `SALE-${Math.floor(Math.random() * 1000)}`
            });
        }

        // Some purchases
        if (Math.random() > 0.7) {
             movements.push({
                id: `sm_purch_${product.id}`,
                productId: product.id,
                type: 'purchase',
                quantity: Math.floor(Math.random() * 20 + 10),
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
                branchId: 'b1',
                performedBy: 'admin2',
                referenceId: `PO-${Math.floor(Math.random() * 1000)}`
            });
        }
    });
    
    return movements;
}

const MOCK_STOCK_MOVEMENTS = generateMockStockMovements(MOCK_SUPERMARKET_PRODUCTS);


// Helper for empty company data
export const getEmptyCompanyData = (): CompanyData => ({
    menuItems: [], ingredients: [], restaurantTables: [], takeawayOrders: [], deliveryOrders: [], reservations: [], kdsOrders: [], restaurantSalesHistory: [], paidWaiterCommissions: [],
    supermarketProducts: [], supermarketSalesHistory: [], heldSupermarketCarts: [], paidSupermarketCommissions: [], customers: [], cashDrawerSessions: [],
    referringCompanies: [], paidCompanyCommissions: [],
    ecommerceProducts: [], ecommerceOrders: [],
    personalTransactions: [], personalBudgets: [], personalExpenseCategories: ['food', 'transport', 'housing', 'bills', 'entertainment', 'health', 'shopping', 'savings', 'other'], personalGoals: [], personalSpreadsheet: { sheets: [], activeSheetId: '' },
    suppliers: [], purchaseInvoices: [], purchaseOrders: [],
    attendanceRecords: [], leaveRequests: [], employeeDocuments: [],
    floors: [], roomTypes: [], ratePlans: [], rooms: [], hotelReservations: [], folios: [], hotelGuests: [], maintenanceRequests: [], connectedChannels: [], channelManagerLogs: [], bookingGroups: [], addons: [], packages: [],
    automotiveProducts: [], automotiveSales: [], automotiveRentals: [],
    propertyListings: [], realEstateSales: [], realEstateRentals: [], paidAgentCommissions: [],
    promotions: [], roles: [],
    auditLog: [], projects: [], blueprints: [], serviceWorkOrders: [], tourPackages: [], tourBookings: [], resources: [], tourismInvoices: [], visitorLog: [], loginHistory: [], contactMessages: [],
    stockTransfers: [], services: [], appointments: [], stockMovements: [], stockTakingSessions: []
});


export const MOCK_COMPANY_DATA: { [key: string]: CompanyData } = {
    'c1': {
        ...getEmptyCompanyData(),
        menuItems: [
            { id: 'm1', name: 'Cheeseburger', category: 'Burgers', price: 25, cost: 10, imageUrl: '', taxRate: 15 },
            { id: 'm2', name: 'Fries', category: 'Sides', price: 10, cost: 3, imageUrl: '', taxRate: 15 },
            { id: 'm3', name: 'Cola', category: 'Drinks', price: 5, cost: 1, imageUrl: '', taxRate: 15 },
        ],
        restaurantTables: [
            { id: 't1', name: 'Table 1', status: TableStatus.Available, order: [], x: 20, y: 20, branchId: 'b1' },
            { id: 't2', name: 'Table 2', status: TableStatus.Available, order: [], x: 150, y: 20, branchId: 'b1' },
        ],
        roles: [
             { id: 'role_waiter', name: 'Waiter', permissions: [EmployeePermission.CAN_ACCESS_POS, EmployeePermission.CAN_ACCESS_KDS] },
             { id: 'role_kitchen', name: 'Kitchen Staff', permissions: [EmployeePermission.CAN_ACCESS_KDS] },
             { id: 'role_cashier', name: 'Cashier', permissions: [EmployeePermission.CAN_ACCESS_POS] }
        ],
    },
    'c2': {
        ...getEmptyCompanyData(),
        supermarketProducts: MOCK_SUPERMARKET_PRODUCTS,
        stockMovements: MOCK_STOCK_MOVEMENTS // Added mock movements here
    },
    'c3': getEmptyCompanyData(),
    'c4': {
         ...getEmptyCompanyData(),
         rooms: [
             { id: 'r101', roomNumber: '101', roomTypeId: 'rt_single', housekeepingStatus: HousekeepingStatus.Clean, floorId: 'f1', x: 20, y: 20 },
             { id: 'r102', roomNumber: '102', roomTypeId: 'rt_double', housekeepingStatus: HousekeepingStatus.Dirty, floorId: 'f1', x: 150, y: 20 }
         ],
         roomTypes: [
             { id: 'rt_single', name: 'Single Room', capacity: 1, imageUrls: [], amenities: ['wifi'] },
             { id: 'rt_double', name: 'Double Room', capacity: 2, imageUrls: [], amenities: ['wifi', 'tv'] }
         ],
         floors: [
             { id: 'f1', name: '1st Floor', order: 1 }
         ]
    },
    'c5': getEmptyCompanyData(),
    'c6': getEmptyCompanyData(),
    'c7': getEmptyCompanyData(),
    'c8': getEmptyCompanyData(),
    'c9': getEmptyCompanyData(),
    'c10': getEmptyCompanyData(),
};