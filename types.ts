

import type { CSSProperties } from 'react';

// Generic types
export type Language = 'en' | 'ar' | 'tr';
export type Action = { type: string; payload?: any };
export type Theme = {
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    layout: 'contained' | 'full-width';
    preset?: ThemePreset;
    socialLinks?: {
        whatsapp?: string;
        instagram?: string;
        x?: string;
        facebook?: string;
    };
};
export type ThemePreset = 'classic' | 'elegant' | 'bold' | 'dark';

export type PaymentMethod = 'cash' | 'card' | 'room_charge' | 'split';

export interface PaymentDetail {
    method: PaymentMethod;
    amount: number;
}

// ... (Keep existing interfaces for data structures like Product, Sale, etc. do NOT remove them as they are used by Contexts)
export interface ProductVariant {
    id: string;
    size?: string;
    color?: string;
    sku: string;
    stock: number;
    priceAdjustment?: number;
}

export interface SupermarketProduct {
    id: string;
    name: string;
    barcode?: string;
    sku?: string;
    category: string;
    price: number;
    pricingCurrency?: string;
    cost: number;
    stockByBranch: { [branchId: string]: number };
    lowStockThreshold: number;
    imageUrls: string[];
    unitType: 'piece' | 'weight';
    description?: string;
    notes?: string;
    taxRate?: number;
    isDigital?: boolean;
    variants?: ProductVariant[];
    expiryDate?: string;
    batchNumber?: string;
    origin?: 'local' | 'imported';
    originCountry?: string;
    storageLocation?: { aisle: string; shelf: string; bin: string };
    employeeCommissionRate?: number;
    companyCommissionRate?: number;
    priceHistory?: { price: number; date: string }[];
    priceLastUpdatedAt?: string;
    trackSerialNumbers?: boolean;
    serialNumbersByBranch?: { [branchId: string]: string[] };
    scaleProductCode?: string;
    createdAt?: string;
    seo?: {
        metaTitle: string;
        metaDescription: string;
    };
    shippingDetails?: {
        weightKg: number;
        lengthCm: number;
        widthCm: number;
        heightCm: number;
    };
    averageRating?: number;
    reviews?: Review[];
    syncStatus?: 'synced' | 'pending' | 'failed';
}

export interface SupermarketCartItem {
    uniqueId: string;
    product: SupermarketProduct;
    quantity: number;
    price: number;
    discount?: number;
    variant?: ProductVariant;
    taxRate: number;
    selectedSerialNumber?: string;
    promotionApplied?: string;
    originalCurrency?: string;
    exchangeRateUsed?: number;
}

export interface SupermarketSale {
    id: string;
    branchId: string;
    items: SupermarketCartItem[];
    totalAmount: number;
    taxAmount: number;
    discountAmount?: number;
    loyaltyDiscount?: number;
    timestamp: number;
    paymentMethod: PaymentMethod;
    paymentDetails?: PaymentDetail[];
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    employeeId?: string;
    employeeName?: string;
    cashDrawerSessionId?: string;
    amountTendered?: number;
    changeAmount?: number;
    employeeCommissionCalculated?: number;
    companyCommissionCalculated?: number;
    referringCompanyId?: string;
    isReturn?: boolean;
    originalSaleId?: string;
    source?: 'table' | 'takeaway';
    sourceId?: string;
    orderNumber?: number;
    syncStatus?: 'synced' | 'pending' | 'failed';
}

export interface MenuItem {
    id: string;
    name: string;
    barcode?: string;
    sku?: string;
    category: string;
    price: number;
    pricingCurrency?: string;
    cost: number;
    stock?: number;
    lowStockThreshold?: number;
    imageUrl?: string;
    imageUrls?: string[];
    taxRate?: number;
    description?: string;
    recipe?: RecipeItem[];
    employeeCommissionRate?: number;
    companyCommissionRate?: number;
    modifierGroups?: ModifierGroup[];
    averageRating?: number;
    reviews?: Review[];
}

export interface ModifierGroup {
    id: string;
    name: string;
    minSelection: number;
    maxSelection: number;
    options: ModifierOption[];
}

export interface ModifierOption {
    id: string;
    name: string;
    priceChange: number;
}

export interface SelectedModifier {
    groupName: string;
    optionName: string;
    priceChange: number;
}

export interface RecipeItem {
    ingredientId: string;
    quantity: number;
}

export interface OrderItem {
    uniqueId: string;
    menuItem: MenuItem;
    quantity: number;
    price: number;
    discount?: number;
    notes?: string;
    taxRate: number;
    selectedModifiers?: SelectedModifier[];
    kdsStatus?: 'sent' | 'preparing' | 'ready';
    promotionApplied?: string;
    originalCurrency?: string;
    exchangeRateUsed?: number;
}

export interface RestaurantSale {
    id: string;
    branchId: string;
    items: OrderItem[];
    totalAmount: number;
    taxAmount: number;
    discountAmount?: number;
    loyaltyDiscount?: number;
    timestamp: number;
    paymentMethod: PaymentMethod;
    paymentDetails?: PaymentDetail[];
    source: 'table' | 'takeaway';
    sourceId: string;
    waiterId?: string;
    customerId?: string;
    customerName?: string;
    employeeName?: string;
    cashDrawerSessionId?: string;
    amountTendered?: number;
    changeAmount?: number;
    orderNumber?: number;
}

export interface RestaurantTable {
    id: string;
    name: string;
    status: TableStatus;
    x: number;
    y: number;
    branchId: string;
    order: OrderItem[];
    waiterId?: string;
    isOrderReady?: boolean;
}

export enum TableStatus {
    Available = 'Available',
    Occupied = 'Occupied',
    Cleaning = 'Cleaning',
    PendingApproval = 'PendingApproval'
}

export interface TakeawayOrder {
    id: string;
    orderNumber: number;
    order: OrderItem[];
    status: 'new' | 'preparing' | 'ready' | 'completed';
    customerName?: string;
    customerPhone?: string;
}

export interface DeliveryOrder {
    id: string;
    orderNumber: number;
    order: OrderItem[];
    status: DeliveryOrderStatus;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    driverId?: string;
    deliveryFee: number;
    timestamp: number;
}

export enum DeliveryOrderStatus {
    New = 'New',
    Preparing = 'Preparing',
    ReadyForDelivery = 'ReadyForDelivery',
    OutOfDelivery = 'OutOfDelivery',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled'
}

export interface KDSOrder {
    id: string;
    tableId: string;
    tableName: string;
    items: OrderItem[]; 
    status: KDSOrderStatus;
    timestamp: number;
}

export enum KDSOrderStatus {
    New = 'New',
    Preparing = 'Preparing',
    Ready = 'Ready'
}

export interface Ingredient {
    id: string;
    name: string;
    stockByBranch: { [branchId: string]: number };
    unit: string;
    cost: number;
    lowStockThreshold: number;
}

export interface WaiterCommission {
    id: string;
    waiterId: string;
    waiterName: string;
    amountPaid: number;
    paymentDate: string;
    periodStartDate: string;
    periodEndDate: string;
    paymentSource?: 'cash' | 'bank';
    cashDrawerSessionId?: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
}

export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export type TransactionCategory = 'salary' | 'food' | 'transport' | 'housing' | 'bills' | 'entertainment' | 'health' | 'shopping' | 'savings' | 'other';

export interface Budget {
    category: TransactionCategory;
    amount: number;
}

export interface SpreadsheetData {
    sheets: Sheet[];
    activeSheetId: string;
}

export interface Sheet {
    id: string;
    name: string;
    columns: SpreadsheetColumn[];
    rows: SpreadsheetRow[];
}

export interface SpreadsheetColumn {
    id: string;
    name: string;
    width: number;
    type: 'text' | 'numeric' | 'date';
}

export interface SpreadsheetRow {
    id: string;
    [columnId: string]: CellData | string;
}

export interface CellData {
    value: string | number | null;
    style?: CellStyle;
}

export interface CellStyle {
    bold?: boolean;
    italic?: boolean;
    textColor?: string;
    backgroundColor?: string;
    align?: 'left' | 'center' | 'right';
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
}

// --- SYSTEM INTEGRATIONS (SUPER ADMIN) ---
export interface SystemIntegrations {
    smsConfig?: {
        provider: 'twilio' | 'unifonic' | 'vonage' | 'custom';
        accountSid?: string;
        authToken?: string;
        senderId?: string;
        isEnabled: boolean;
    };
    emailConfig?: {
        provider: 'smtp' | 'sendgrid' | 'mailgun';
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        fromEmail?: string;
        apiKey?: string;
        isEnabled: boolean;
    };
}

// Common Types for App State
// Cleaned up AppState - Removed legacy data props that were moved to Contexts
export interface AppState {
    companies: Company[];
    users: User[];
    // Deprecated: Legacy data container, kept as 'any' for backward compatibility
    companyData: { [id: string]: CompanyData };
    accountingData: { [companyId: string]: AccountingData };
    payrollRecords: { [companyId: string]: PayrollRecord[] };
    currencies: Currency[];
    currentUser: User | null; // Auth Context also holds this
    currentCustomer: Customer | null; // Sales Context also holds this
    notifications: Notification[];
    ecommerceEnabled: boolean;
    systemIntegrations: SystemIntegrations;
    impersonatorId?: string; 
}

// Cleaned up CompanyData - Used as 'any' alias for legacy support, but interfaces below are kept for Contexts
export type CompanyData = any;

export enum AttendanceStatus {
    Present = 'Present',
    Absent = 'Absent',
    Late = 'Late',
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string;
    status: AttendanceStatus;
    checkInTime?: string;
    checkOutTime?: string;
}

export enum LeaveStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
}

export interface EmployeeDocument {
    id: string;
    employeeId: string;
    name: string;
    fileUrl: string;
}

export enum PayrollStatus {
    Pending = 'Pending',
    Paid = 'Paid',
}

export interface PayrollRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    period: string; // e.g. "May 2024"
    baseSalary: number;
    commissions: number;
    deductions: number;
    netPay: number;
    status: PayrollStatus;
    paymentDate?: string;
    paymentSource?: 'cash' | 'bank';
    cashDrawerSessionId?: string;
    branchId?: string;
}


// Purchasing Types
export interface Supplier {
    id: string;
    name: string;
    contactInfo?: string;
}

export interface PurchaseInvoice {
    id: string;
    supplierId?: string;
    supplierName: string;
    date: string;
    description: string;
    totalAmount: number;
    imageUrls?: string[];
    paymentStatus: 'paid' | 'unpaid';
    paymentDate?: string;
    paymentMethod?: 'cash' | 'bank';
    cashDrawerSessionId?: string;
    branchId?: string;
}

export enum PurchaseOrderStatus {
    Draft = 'Draft',
    Sent = 'Sent',
    Completed = 'Completed',
}

export interface PurchaseOrderItem {
    productId: string; // Can be Ingredient ID or SupermarketProduct ID
    productName: string;
    quantity: number;
    cost: number;
}

export interface PurchaseOrder {
    id: string;
    supplierId?: string;
    date: string;
    items: PurchaseOrderItem[];
    totalAmount: number;
    status: PurchaseOrderStatus;
    branchId?: string;
    requesterId?: string;
}


// Accounting Types
export enum AccountType {
    Asset = 'Asset',
    Liability = 'Liability',
    Equity = 'Equity',
    Revenue = 'Revenue',
    Expense = 'Expense',
}

export interface Account {
    id: string; // Account Number
    name: string;
    type: AccountType;
    parentAccountId: string | null;
    balance: number;
    children?: Account[];
}

export interface JournalEntryLine {
    accountId: string;
    debit: number;
    credit: number;
}

export interface JournalEntry {
    id: string;
    date: string;
    description: string;
    lines: JournalEntryLine[];
    branchId?: string;
}

export interface AccountingData {
    chartOfAccounts: Account[];
    journalEntries: JournalEntry[];
}


// Commission Company Types
export interface ReferringCompany {
    id: string;
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    taxNumber?: string;
    commissionRate?: number; // Base rate for this company
}

export interface SupermarketCommission { // Employee Commission in Retail
    id: string;
    employeeId: string;
    employeeName: string;
    amountPaid: number;
    paymentDate: string;
    periodStartDate: string;
    periodEndDate: string;
    totalSales: number;
    breakdown: CommissionSaleBreakdown[];
    paymentSource?: 'cash' | 'bank';
    cashDrawerSessionId?: string;
}

export interface PaidCompanyCommission { // Partner Company Commission
    id: string;
    referringCompanyId: string;
    companyName: string;
    amountPaid: number;
    paymentDate: string;
    periodStartDate: string;
    periodEndDate: string;
    breakdown: CommissionSaleBreakdown[];
    totalSales: number;
    totalInvoices: number;
    companyBaseRate: number;
    totalBaseCommission: number;
    totalProductCommission: number;
    paymentSource?: 'cash' | 'bank';
    cashDrawerSessionId?: string;
}

export interface CommissionSaleBreakdown {
    category: string;
    totalSales: number;
    commission: number;
}

// Hotel Types
export enum HousekeepingStatus {
    Clean = 'Clean',
    Dirty = 'Dirty',
    CleaningInProgress = 'CleaningInProgress',
    Inspected = 'Inspected',
    OutOfService = 'OutOfService',
}

export interface Floor {
    id: string;
    name: string;
    order: number;
}

export interface RoomType {
    id: string;
    name: string;
    capacity: number;
    imageUrls: string[];
    amenities: string[];
}

export interface RatePlan {
    id: string;
    roomTypeId: string;
    name: string;
    price: number; // Base price per night
}

export interface Room {
    id: string;
    roomNumber: string;
    roomTypeId: string;
    floorId: string;
    housekeepingStatus: HousekeepingStatus;
    assignedHousekeeperId?: string;
    x?: number; // For floor plan drag-drop
    y?: number;
}

export enum HotelReservationStatus {
    Pending = 'pending', // For web bookings
    Confirmed = 'confirmed',
    CheckedIn = 'checkedIn',
    CheckedOut = 'checkedOut',
    Cancelled = 'cancelled',
    NoShow = 'noShow',
}

export interface HotelReservation {
    id: string;
    guestId?: string; // Link to guest profile
    guestName: string;
    guestPhone?: string;
    checkInDate: string;
    checkOutDate: string;
    roomId: string;
    roomTypeId: string;
    numberOfGuests: number;
    status: HotelReservationStatus;
    ratePlanId?: string; // Selected rate plan
    customRate?: number; // Override price
    folioId: string;
    groupId?: string;
    addons: string[]; // IDs of selected addons
}

export interface HotelGuest {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    preferences?: string;
    reservationHistory: string[]; // Reservation IDs
    loyaltyTierId?: string;
    loyaltyPoints: number;
    notes?: string;
}

export interface FolioItem {
    id: string;
    description: string;
    amount: number;
    type: 'charge' | 'payment';
    timestamp: number;
    paymentMethod?: PaymentMethod; // For payments
}

export interface Folio {
    id: string;
    reservationId: string;
    items: FolioItem[];
    balance: number;
}

export enum MaintenanceRequestStatus {
    Reported = 'Reported',
    InProgress = 'InProgress',
    Completed = 'Completed',
}

export interface MaintenanceRequest {
    id: string;
    roomId: string;
    description: string;
    reportedBy: string; // User ID
    date: string;
    status: MaintenanceRequestStatus;
}

export interface HotelSettings {
    generalTax: GeneralTax;
    receipt: ReceiptDesign;
    allowCustomerRegistration?: boolean;
    loyaltyProgram: LoyaltyProgram;
    savedBrochures?: SavedBrochure[];
}

export interface Addon {
    id: string;
    name: string;
    price: number;
    taxRate?: number;
    perGuest?: boolean; // Charge per guest or per room?
    perNight?: boolean; // Charge per night or once?
}

export interface HotelPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    taxRate?: number;
    includedAddonIds: string[];
}

// Channel Manager Types (Mock)
export enum ChannelManagerStatus {
    Connected = 'Connected',
    Syncing = 'Syncing',
    Error = 'Error',
    Disabled = 'Disabled',
}

export interface ConnectedChannel {
    id: string;
    name: string; // e.g., Booking.com, Expedia
    status: ChannelManagerStatus;
    lastSync: number;
}

export interface ChannelManagerLog {
    id: string;
    timestamp: number;
    message: string;
    type: 'info' | 'error';
}

// Group Booking
export interface BookingGroup {
    id: string;
    name: string;
    checkInDate: string;
    checkOutDate: string;
}


// Automotive Types
export enum VehicleCondition {
    New = 'New',
    Used = 'Used',
}

export enum FuelType {
    Gasoline = 'Gasoline',
    Diesel = 'Diesel',
    Electric = 'Electric',
    Hybrid = 'Hybrid',
}

export enum Transmission {
    Automatic = 'Automatic',
    Manual = 'Manual',
}

export enum Drivetrain {
    FWD = 'FWD',
    RWD = 'RWD',
    AWD = 'AWD',
}

export interface AutomotiveProduct {
    id: string;
    type: 'sale' | 'rental' | 'part';
    status: 'available' | 'sold' | 'rented';
    make: string;
    model: string;
    year: number;
    cost: number; // Purchase price
    price?: number; // Sale price
    dailyRentalRate?: number; // For rentals
    features: string[];
    imageUrls: string[];
    // Specifics
    vin?: string;
    series?: string;
    fuelType?: FuelType;
    transmission?: Transmission;
    condition?: VehicleCondition;
    mileage?: number;
    bodyType?: string;
    enginePower?: number;
    engineVolume?: number;
    drivetrain?: Drivetrain;
    color?: string;
    warranty?: boolean;
    heavilyDamaged?: boolean;
    plate?: string; // License plate
    description?: string;
}

export interface AutomotiveSale {
    id: string;
    branchId: string;
    productId: string;
    productName: string;
    customerId: string;
    salespersonId: string;
    saleDate: string;
    salePrice: number;
    downPayment?: number;
    paymentMethod?: 'cash' | 'installments';
    cost: number;
    notes?: string;
    auditedBy?: string; // For contract audit
    auditNotes?: string;
}

export interface AutomotiveRental {
    id: string;
    branchId: string;
    productId: string;
    productName: string;
    customerId: string;
    startDate: string;
    endDate: string;
    dailyRate: number;
    securityDeposit: number;
    insuranceDetails?: string;
    status: 'active' | 'completed' | 'cancelled';
    notes?: string;
    auditedBy?: string; // For contract audit
    auditNotes?: string;
}

export enum WorkOrderStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    AwaitingParts = 'AwaitingParts',
    Completed = 'Completed',
}

export interface ServiceWorkOrder {
    id: string;
    customerId: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleVin?: string;
    technicianId?: string; // Employee ID
    startDate: string;
    completionDate?: string;
    status: WorkOrderStatus;
    description?: string; // Issue description
    laborHours: number;
    partsUsed: { partId: string; quantity: number; price: number }[]; // From Inventory
    totalCost: number;
    notes?: string;
}

// Real Estate Types
export interface PropertyListing {
    id: string;
    type: 'sale' | 'rent';
    status: 'available' | 'sold' | 'rented';
    title: string;
    description: string;
    address: string;
    price?: number; // Sale price
    rent?: number; // Monthly rent
    area: number; // sqm
    bedrooms: number;
    bathrooms: number;
    imageUrls: string[];
    features?: string[];
    agentId?: string;
    ownerId?: string; // Customer ID who owns it
    documents?: PropertyDocument[]; // e.g. Title deed
}

export interface PropertyDocument {
    id: string;
    name: string;
    fileUrl: string;
}

export interface RealEstateSale {
    id: string;
    branchId: string;
    listingId: string;
    listingTitle: string;
    customerId: string; // Buyer
    agentId: string;
    saleDate: string;
    salePrice: number;
    commissionAmount: number;
}

export interface RealEstateRental {
    id: string;
    branchId: string;
    listingId: string;
    listingTitle: string;
    tenantId: string; // Customer
    agentId: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
    commissionAmount: number;
}

export interface RealEstateAgentCommission {
    id: string;
    agentId: string;
    agentName: string;
    amountPaid: number;
    paymentDate: string;
    periodStartDate: string;
    periodEndDate: string;
}


// E-commerce
export interface EcommerceSettings {
    shippingZones: ShippingZone[];
    allowGuestCheckout: boolean;
    loyaltyProgram: LoyaltyProgram;
}

export interface ShippingZone {
    id: string;
    name: string;
    countries: string[];
    price: number;
}

export interface EcommerceProduct extends SupermarketProduct {
    description: string;
    isDigital: boolean;
    shippingDetails?: {
        weightKg: number;
        lengthCm: number;
        widthCm: number;
        heightCm: number;
    };
    seo?: {
        metaTitle: string;
        metaDescription: string;
    };
}

export enum EcommerceOrderStatus {
    New = 'new',
    Processing = 'processing',
    Shipped = 'shipped',
    Delivered = 'delivered',
    Cancelled = 'cancelled'
}

export interface EcommerceOrder {
    id: string;
    orderNumber: number;
    customerId: string;
    items: EcommerceOrderItem[];
    status: EcommerceOrderStatus;
    shippingAddress: string;
    trackingNumber?: string;
    totalAmount: number;
    taxAmount: number;
    discountAmount?: number;
    timestamp: number;
    notes?: string;
}

export type EcommerceOrderItem = 
    | (SupermarketCartItem & { menuItem?: never; selectedModifiers?: never })
    | (Omit<SupermarketCartItem, 'product'> & { product?: never; menuItem: MenuItem; selectedModifiers?: SelectedModifier[] });


export interface Review {
    id: string;
    customerId: string;
    customerName: string;
    rating: number;
    comment: string;
    date?: string;
}

// Manufacturing
export interface Project {
    id: string;
    name: string;
    description: string;
    customerId: string;
    status: 'new' | 'in_progress' | 'completed' | 'on_hold';
    startDate: string;
    endDate?: string;
    estimatedCost: number;
    actualCost: number;
    blueprintImageUrl?: string;
    billOfMaterials?: BillOfMaterialItem[];
    dimensions?: ProjectDimension[];
}

export interface ProjectDimension {
    id: string;
    description: string;
    length?: number;
    width?: number;
    height?: number;
    unit: 'cm' | 'm' | 'mm';
    notes?: string;
}

export interface BillOfMaterialItem {
    itemId: string; // Ingredient/Raw Material ID
    quantity: number;
    cost: number;
}

export interface Blueprint {
    id: string;
    name: string;
    projectId: string;
    elements: BlueprintElement[];
    viewBox: { width: number; height: number };
}

export interface BlueprintElement {
    id: string;
    type: 'rect' | 'circle' | 'ellipse' | 'line' | 'text' | 'polygon' | 'image' | 'shape' | 'symbol' | 'product';
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: string; // For polygon
    fill?: string;
    stroke?: string;
    text?: string;
    // Additional properties for brochure/design
    content?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    imageUrl?: string;
    productId?: string;
    displayPrice?: number;
    displayName?: string;
    displayImageUrl?: string;
    backgroundColor?: string;
    textColor?: string;
    rotation?: number;
    opacity?: number;
    shapeType?: 'rectangle' | 'ellipse' | 'star' | 'smiley';
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    symbolName?: string;
    style?: CSSProperties;
}

export type BrochureElement = BlueprintElement;

// Tourism
export interface TourismSettings {
    // ...
}

export interface TourPackage {
    id: string;
    name: string;
    description: string;
    durationDays: number;
    pricePerPerson: number;
    itinerary: string[];
    imageUrls: string[];
    includedServices: string[];
}

export enum TourBookingStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Cancelled = 'cancelled',
}

export interface TourBooking {
    id: string;
    tourPackageId: string;
    customerName: string;
    customerPhone: string;
    travelDate: string;
    numberOfTravelers: number;
    totalPrice: number;
    status: TourBookingStatus;
    guideId?: string;
    resourceIds?: string[]; // e.g. Vehicle ID
}

export interface Resource {
    id: string;
    name: string;
    type: 'vehicle' | 'equipment';
    capacity?: number;
    status?: 'available' | 'in_use' | 'maintenance';
}

export enum TourismInvoiceStatus {
    Draft = 'draft',
    Sent = 'sent',
    Paid = 'paid',
    Overdue = 'overdue',
}

export interface TourismInvoice {
    id: string;
    invoiceNumber: string;
    bookingId: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    status: TourismInvoiceStatus;
    customerName: string;
    tourPackageName: string;
}


// Website Builder
export interface WebsiteBuilderSettings {
    // ...
}

// Appointment
export interface AppointmentSettings {
    // ...
}

export interface Service {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
}

export enum AppointmentStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Cancelled = 'Cancelled',
    Completed = 'Completed',
    Scheduled = 'Scheduled', // Add Scheduled mapping to Confirmed
}

export interface Appointment {
    id: string;
    serviceId: string;
    customerId?: string;
    customerName: string;
    customerPhone: string;
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes?: string;
}

// Other
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  tableId?: string;
  status: ReservationStatus;
}

export interface LoyaltyProgram {
    isEnabled: boolean;
    pointsPerCurrencyUnit: number;
    tiers: LoyaltyTier[];
    pointsPerDiscountUnit?: number; // e.g. 100 points = 1 currency unit discount
}

export interface LoyaltyTier {
    id: string;
    name: string;
    pointsThreshold: number;
    benefits: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: EmployeePermission[];
}

export enum EmployeePermission {
    CAN_ACCESS_POS = 'CAN_ACCESS_POS',
    CAN_USE_PRICE_CHECKER = 'CAN_USE_PRICE_CHECKER',
    CAN_APPROVE_ORDERS = 'CAN_APPROVE_ORDERS',
    CAN_ACCESS_KDS = 'CAN_ACCESS_KDS',
    CAN_MANAGE_DELIVERY = 'CAN_MANAGE_DELIVERY',
    CAN_VIEW_REPORTS = 'CAN_VIEW_REPORTS',
    CAN_MANAGE_INVENTORY = 'CAN_MANAGE_INVENTORY',
    CAN_MANAGE_RESERVATIONS = 'CAN_MANAGE_RESERVATIONS',
    CAN_USE_INVENTORY_SCANNER = 'CAN_USE_INVENTORY_SCANNER',
    
    // Hotel Specific
    CAN_MANAGE_FRONT_DESK = 'CAN_MANAGE_FRONT_DESK',
    CAN_MANAGE_HOUSEKEEPING = 'CAN_MANAGE_HOUSEKEEPING',
    CAN_MANAGE_MAINTENANCE = 'CAN_MANAGE_MAINTENANCE',

    // Automotive
    CAN_PERFORM_MAINTENANCE = 'CAN_PERFORM_MAINTENANCE', // Mechanic
    
    // E-commerce
    CAN_MANAGE_ECOMMERCE_ORDERS = 'CAN_MANAGE_ECOMMERCE_ORDERS',
    CAN_MANAGE_ECOMMERCE_PRODUCTS = 'CAN_MANAGE_ECOMMERCE_PRODUCTS',
    
    // General
    HAS_GENERAL_PERMISSIONS = 'HAS_GENERAL_PERMISSIONS',
}

// Promotion Types
export enum PromotionType {
    CATEGORY_DISCOUNT = 'CATEGORY_DISCOUNT',
    BOGO = 'BOGO',
    BUNDLE_DEAL = 'BUNDLE_DEAL',
    TIERED_DISCOUNT = 'TIERED_DISCOUNT',
    GLOBAL_DISCOUNT = 'GLOBAL_DISCOUNT',
}

export interface BasePromotion {
    id: string;
    name: string;
    description?: string;
    type: PromotionType;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    startTime?: string; // e.g. '14:00'
    endTime?: string; // e.g. '17:00'
}

export interface CategoryDiscountPromotion extends BasePromotion {
    type: PromotionType.CATEGORY_DISCOUNT;
    categoryName: string;
    categoryDiscountPercentage: number;
}

export interface BogoPromotion extends BasePromotion {
    type: PromotionType.BOGO;
    buyProductIds: string[]; // IDs of products to buy
    buyCategoryNames?: string[]; // Categories to buy from
    applyToAllProducts?: boolean; // Global BOGO
    buyQuantity: number;
    getProductIds: string[]; // IDs of products to get
    getQuantity: number;
    getDiscountPercentage: number; // 100 for free, 50 for half price etc.
    isSameProduct: boolean; // If true, getProductIds is ignored/same as buyProductIds
}

export interface BundleDealPromotion extends BasePromotion {
    type: PromotionType.BUNDLE_DEAL;
    bundleProductIds: string[];
    bundlePrice: number;
}

export interface TieredDiscountLevel {
    quantity: number;
    discountPercentage: number;
}

export interface TieredDiscountPromotion extends BasePromotion {
    type: PromotionType.TIERED_DISCOUNT;
    productIds: string[];
    tiers: TieredDiscountLevel[];
}

export interface GlobalDiscountPromotion extends BasePromotion {
    type: PromotionType.GLOBAL_DISCOUNT;
    discountPercentage: number;
}

export type Promotion = CategoryDiscountPromotion | BogoPromotion | BundleDealPromotion | TieredDiscountPromotion | GlobalDiscountPromotion;


export interface SavedBrochure {
    id: string;
    name: string;
    design: BrochureDesign;
    lastModified: number;
}

export interface BrochureDesign {
    backgroundColor: string;
    width_mm?: number;
    height_mm?: number;
    dpi?: number;
    elements: BrochureElement[];
}

// Other
export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    params?: { [key: string]: string | number };
}

export interface Currency {
    code: string;
    name: string;
}

export interface SystemPublicPage {
    id: string;
    name: string;
    slug: string;
    pageType: 'PLATFORM_OFFERS' | 'COMPANIES_AGGREGATOR';
    pageContent: PublicPage;
    settings?: any;
}

export interface AuditLogEntry {
    id: string;
    userId: string;
    userName: string;
    actionType: string;
    detailsKey: string;
    detailsParams?: any;
    timestamp: number;
}

export interface LoginHistoryEntry {
    id: string;
    userId: string;
    userName: string;
    timestamp: number;
    ipAddress: string;
    country: string;
    city: string;
    companyId?: string;
}

export interface VisitorLogEntry {
    id: string;
    timestamp: number;
    ipAddress: string;
    userAgent: string;
    pageUrl: string;
    referrer: string;
    country: string;
    countryCode: string;
    city: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: number;
    isRead: boolean;
}

export interface ActivityItem {
    id: string;
    icon: string;
    text: string;
    timestamp: number;
}


// Tab Types for Routing/State
export enum SuperAdminTab {
    Companies = 'companies',
    PublicPages = 'public_pages',
    Plans = 'plans',
    Billing = 'billing',
    AuditLog = 'audit_log',
    Settings = 'settings',
}

export type RestaurantActiveTab = 'dashboard' | 'pos' | 'approval' | 'delivery' | 'reservations' | 'kds' | 'management' | 'queue_display' | 'no_access' | 'cash_drawer';
export type RestaurantManagementTab = 'analytics' | 'online_orders' | 'menu_items' | 'ingredients' | 'recipes' | 'crm' | 'employee_commissions' | 'partner_commissions' | 'payroll' | 'hr' | 'employees' | 'roles' | 'accounting' | 'public_page' | 'mobile' | 'ai_assistant' | 'settings' | 'audit_log' | 'branches' | 'design_print' | 'loyalty' | 'sales_history' | 'reports' | 'expenses' | 'stock_transfers' | 'stock_taking' | 'promotions' | 'purchasing';

export type SupermarketActiveTab = 'pos' | 'sales_history' | 'online_orders' | 'cash_drawer' | 'inventory_scanner' | 'price_checker' | 'management' | 'inventory' | 'purchasing' | 'promotions' | 'customers' | 'messages' | 'crm' | 'loyalty' | 'employees' | 'roles' | 'employee_commissions' | 'partner_commissions' | 'hr' | 'reports' | 'analytics' | 'ai_assistant' | 'settings' | 'scale_settings' | 'design_print' | 'accounting' | 'payroll' | 'public_page' | 'audit_log' | 'branches' | 'stock_transfers' | 'expenses' | 'dashboard';

export type CommissionActiveTab = SupermarketActiveTab | 'partner_commissions';

export type HotelActiveTab = 'dashboard' | 'frontDesk' | 'tapeChart' | 'floor_plan' | 'reservations' | 'public_reservations' | 'guests' | 'billing' | 'housekeeping' | 'maintenance' | 'reports' | 'settings' | 'employees' | 'roles' | 'channel_manager' | 'public_page' | 'ai_assistant' | 'pos' | 'menu_items' | 'ingredients' | 'recipes' | 'audit_log' | 'branches' | 'rooms';

export type AutomotiveActiveTab = 'dashboard' | 'inventory' | 'service_center' | 'contracts' | 'customers' | 'pos' | 'parts_inventory' | 'sales_history' | 'cash_drawer' | 'public_page' | 'audit_log' | 'branches' | 'settings';

export type RealEstateActiveTab = 'listings' | 'map' | 'contracts' | 'agents' | 'crm' | 'commissions' | 'analytics' | 'public_page' | 'audit_log' | 'branches' | 'settings';

export type ManufacturingActiveTab = 'dashboard' | 'projects' | 'blueprint_designer' | 'raw_materials' | 'finished_goods' | 'purchasing' | 'customers' | 'accounting' | 'employees' | 'hr' | 'public_page' | 'audit_log' | 'branches' | 'settings';

export type TourismActiveTab = 'dashboard' | 'tour_packages' | 'bookings' | 'scheduler' | 'resources' | 'finance' | 'employees' | 'customers' | 'public_page' | 'settings' | 'audit_log' | 'branches' | 'roles';

export type EcommerceActiveTab = 'dashboard' | 'orders' | 'products' | 'customers' | 'analytics' | 'promotions' | 'public_page' | 'audit_log' | 'branches' | 'settings';

export type WebsiteBuilderActiveTab = 'dashboard' | 'pages' | 'analytics' | 'subscribers' | 'audit_log' | 'branches' | 'settings';

export type AppointmentActiveTab = 'dashboard' | 'calendar' | 'services' | 'staff' | 'customers' | 'reports' | 'public_page' | 'settings' | 'audit_log' | 'branches' | 'public_reservations';

export type BranchActiveTab = 'dashboard' | 'employees' | 'inventory' | 'expenses';

// Stock Transfer
export interface StockTransfer {
    id: string;
    date: string;
    sourceBranchId: string;
    destinationBranchId: string;
    items: {
        productId: string;
        quantity: number;
        productName: string;
    }[];
    status: 'pending' | 'completed' | 'cancelled';
    notes?: string;
}

export interface NotificationProviderConfig {
    enabled: boolean;
    provider: string; // 'twilio', 'sendgrid', 'smtp', 'custom_sms', etc.
    apiKey?: string;
    apiSecret?: string;
    senderId?: string; // The name displayed to the customer
    fromEmail?: string;
    host?: string; // SMTP
    port?: number; // SMTP
    username?: string; // SMTP
    password?: string; // SMTP
}

export interface Company {
    id: string;
    name: string;
    slug: string;
    type: CompanyType;
    adminUserId: string;
    currency: string;
    exchangeRates?: { [currencyCode: string]: number }; // Added exchange rates
    createdAt: string;
    syncStatus: SyncStatus;
    storageUsageMB: number;
    storageLimitOverrideMB?: number;
    features: {
        pos: boolean;
        accounting: boolean;
        inventory: boolean;
        crm: boolean;
        payroll: boolean;
        commissions: boolean;
        ecommerce: boolean;
    };
    publicPage: PublicPage;
    subscription: Subscription;
    customDomain?: string;
    formattingSettings?: FormattingSettings;
    branches: Branch[];
    address?: string;
    mainBranchName?: string;
    mainBranchPhone?: string;
    taxNumber?: string;
    email?: string;
    phone?: string;
    companyCommissionRate?: number;
    employeeCommissionRate?: number;
    qrCodeDataUrl?: string;
    
    notificationSettings?: {
        sms?: NotificationProviderConfig;
        email?: NotificationProviderConfig;
    };

    // Settings per type
    restaurantSettings?: RestaurantSettings;
    supermarketSettings?: SupermarketSettings;
    hotelSettings?: HotelSettings;
    ecommerceSettings?: EcommerceSettings;
    manufacturingSettings?: any;
    tourismSettings?: TourismSettings;
    websiteBuilderSettings?: WebsiteBuilderSettings;
    appointmentSettings?: AppointmentSettings;
    
    // Flags to allow using System Gateways
    allowSystemSmsGateway?: boolean;
    allowSystemEmailGateway?: boolean;
}

export enum CompanyType {
    Restaurant = 'Restaurant',
    Supermarket = 'Supermarket',
    Commission = 'Commission',
    Hotel = 'Hotel',
    Automotive = 'Automotive',
    RealEstate = 'RealEstate',
    Manufacturing = 'Manufacturing',
    Tourism = 'Tourism',
    Ecommerce = 'Ecommerce',
    WebsiteBuilder = 'WebsiteBuilder',
    Appointment = 'Appointment',
    Personal = 'Personal'
}

export enum SyncStatus {
    Synced = 'Synced',
    Unsynced = 'Unsynced',
}

export interface User {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: UserRole;
    companyId: string;
    roleId?: string;
    branchId?: string;
    baseSalary?: number;
    commissionRate?: number;
    language?: Language;
    theme?: 'light' | 'dark';
    enableNotifications?: boolean;
    superAdminPermissions?: SuperAdminPermission[];
    preferences?: any;
    isPubliclyBookable?: boolean;
    workingHours?: WorkingHour[];
    phone?: string;
    address?: string;
}

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    COMPANY_ADMIN = 'COMPANY_ADMIN',
    BRANCH_MANAGER = 'BRANCH_MANAGER',
    EMPLOYEE = 'EMPLOYEE',
}

export interface PublicPage {
    isEnabled: boolean;
    template: string;
    theme: Theme;
    sections: Section[];
}

export interface Section {
    id: string;
    type: 'hero' | 'text' | 'testimonials' | 'video' | 'menu' | 'products' | 'rooms' | 'tours' | 'cars' | 'listings' | 'projects' | 'services' | 'appointment_booking' | 'reservation' | 'cta' | 'gallery' | 'companies_aggregator' | 'promotions_aggregator' | 'banner' | 'contact';
    title: string;
    backgroundColor?: string;
    paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    marginY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    layout?: 'single-column' | 'two-column' | 'three-column';
    [key: string]: any;
}

export interface Subscription {
    planId: string;
    status: 'active' | 'expired' | 'trial';
    expiryDate: string;
}

export interface SubscriptionPlanDetails {
    id: string;
    name: string;
    price: number;
    storageLimitMB: number;
    features: Company['features'];
}

export interface Branch {
    id: string;
    name: string;
    address?: string;
    phone?: string;
}

export interface RestaurantSettings {
    generalTax: GeneralTax;
    receipt: ReceiptDesign;
    takeawayCounter?: number;
    allowCustomerRegistration?: boolean;
    loyaltyProgram: LoyaltyProgram;
    savedBrochures?: SavedBrochure[];
}

export interface SupermarketSettings {
    generalTax: GeneralTax;
    receipt: ReceiptDesign;
    scaleSettings?: ScaleSettings;
    allowCustomerRegistration?: boolean;
    loyaltyProgram: LoyaltyProgram;
    savedBrochures?: SavedBrochure[];
    expiryAlertThresholdDays?: number;
}

export interface GeneralTax {
    name: string;
    rate: number;
    isEnabled: boolean;
}

export interface ReceiptDesign {
    headerText: string;
    footerText: string;
    showLogo: boolean;
    showBarcode: boolean;
    fontSize: number;
    barcodeHeight: number;
    barcodeWidth: number;
    showDate?: boolean;
    showTime?: boolean;
    showCustomer?: boolean;
    showCashier?: boolean;
    customTitle?: string;
    paperSize?: '80mm' | '57mm';
    showTaxNumber?: boolean;
    showQrCode?: boolean;
    showPaymentDetails?: boolean;
    showTaxBreakdown?: boolean;
}

export interface ScaleSettings {
    format: 'generic' | 'mettler_toledo' | 'digi' | 'cas';
    barcodePrefix?: string;
    productCodeLength: number;
    valueIsPrice: boolean;
    valueLength: number;
    weightDecimalPlaces: number;
}

export interface Customer {
    id: string;
    companyId?: string;
    name: string;
    phone: string;
    email?: string;
    password?: string;
    address?: string;
    secondaryAddress?: string;
    idNumber?: string;
    taxNumber?: string;
    interests?: string;
    budget?: number;
    loyaltyPoints: number;
    purchaseHistory: { saleId: string; date: string; amount: number; }[];
    status?: 'pending' | 'approved' | 'rejected';
}

export interface SubscriptionInvoice {
    id: string;
    companyId: string;
    companyName: string;
    planId: string;
    planName: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: 'paid' | 'unpaid' | 'overdue';
    paidDate?: string;
}

export interface HeldSupermarketCart {
    id: string;
    cart: SupermarketCartItem[];
    customerId?: string;
    customerName?: string;
    employeeId?: string;
    timestamp: number;
}

export interface CashDrawerSession {
    id: string;
    userId: string;
    branchId: string;
    openingBalance: number;
    openedAt: string;
    closedAt?: string;
    closingBalance?: number;
    actualBalance?: number;
    difference?: number;
    expectedBalance?: number;
    cashSales?: number;
    cashPayouts?: number;
    status: 'open' | 'closed';
}

export interface StockMovement {
    id: string;
    productId: string;
    type: 'sale' | 'purchase' | 'return' | 'adjustment' | 'transfer_out' | 'transfer_in' | 'wastage';
    quantity: number;
    date: string;
    branchId: string;
    performedBy?: string;
    referenceId?: string;
    notes?: string;
}

export interface StockTakingItem {
    productId: string;
    productName: string;
    systemStock: number;
    countedStock: number;
}

export interface StockTakingSession {
    id: string;
    branchId: string;
    startDate: string;
    status: 'in_progress' | 'completed';
    items: StockTakingItem[];
    notes?: string;
    performedBy: string;
}

export interface TextSection extends Section {
    type: 'text';
    content: string;
    columns: Column[];
}

export interface Column {
    id: string;
    title: string;
    content: string;
}

export interface GallerySection extends Section {
    type: 'gallery';
    images: GalleryImage[];
}

export interface GalleryImage {
    id: string;
    url: string;
    caption?: string;
}

export interface TestimonialsSection extends Section {
    type: 'testimonials';
    testimonials: Testimonial[];
}

export interface Testimonial {
    id: string;
    customerName: string;
    comment: string;
    rating: number;
}

export interface VideoSection extends Section {
    type: 'video';
    videoUrl: string;
    description?: string;
}

export interface BannerSection extends Section {
    type: 'banner';
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
}

export interface ProductsSection extends Section {
    type: 'products';
    filter: 'all' | 'newest' | 'bestsellers';
    productSelection?: {
        mode: 'all' | 'categories' | 'manual';
        selectedCategories?: string[];
        selectedProductIds?: string[];
        excludedProductIds?: string[];
    };
}

export interface CallToActionSection extends Section {
    type: 'cta';
    buttonText: string;
    buttonLink: string;
}

export interface ReservationSection extends Section {
    type: 'reservation';
}

export interface CompaniesAggregatorSection extends Section {
    type: 'companies_aggregator';
    settings?: {
        visibleCompanyIds: string[];
        companyOrder: string[];
    };
}

export interface PromotionsAggregatorSection extends Section {
    type: 'promotions_aggregator';
}

export interface ContactSection extends Section {
    type: 'contact';
    show_map: boolean;
    show_form: boolean;
}

export enum SuperAdminPermission {
    CAN_MANAGE_COMPANIES = 'CAN_MANAGE_COMPANIES',
    CAN_MANAGE_PLANS = 'CAN_MANAGE_PLANS',
    CAN_MANAGE_BILLING = 'CAN_MANAGE_BILLING',
    CAN_VIEW_SYSTEM_LOGS = 'CAN_VIEW_SYSTEM_LOGS',
    CAN_MANAGE_SETTINGS = 'CAN_MANAGE_SETTINGS',
}

export interface FormattingSettings {
    calendar: 'gregorian' | 'hijri';
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'Month D, YYYY';
}

export interface WorkingHour {
    dayOfWeek: number; // 0-6
    startTime: string;
    endTime: string;
    isWorking: boolean;
}
export interface SyncQueueItem {
    id?: number;
    actionType: 'CREATE' | 'UPDATE' | 'DELETE';
    dataType: 'PRODUCT' | 'SALE' | 'CUSTOMER' | 'INVOICE' | 'SETTINGS'; // Expand as needed
    payload: any;
    timestamp: number;
}