

import Dexie, { Table } from 'dexie';
import { 
    SupermarketProduct, 
    SupermarketSale, 
    SyncQueueItem, 
    User, 
    Customer, 
    JournalEntry, 
    AttendanceRecord, 
    LeaveRequest, 
    EmployeeDocument,
    Role
} from '../types';

export class AppDatabase extends Dexie {
    products!: Table<SupermarketProduct, string>;
    sales!: Table<SupermarketSale, string>;
    syncQueue!: Table<SyncQueueItem, number>;
    
    // New Tables
    users!: Table<User, string>;
    customers!: Table<Customer, string>;
    journalEntries!: Table<JournalEntry, string>;
    attendance!: Table<AttendanceRecord, string>;
    leaveRequests!: Table<LeaveRequest, string>;
    documents!: Table<EmployeeDocument, string>;
    roles!: Table<Role, string>;

    constructor() {
        super('ProCountDB');
        // Version 2: Added support for HR, Accounting, CRM, and Users
        // Added index for companyId to all relevant tables to support fast filtering/pagination
        (this as any).version(2).stores({
            products: 'id, name, barcode, category, syncStatus, companyId',
            sales: 'id, timestamp, syncStatus, totalAmount, companyId',
            syncQueue: '++id, actionType, dataType, timestamp',
            users: 'id, email, role, companyId, branchId',
            customers: 'id, phone, email, companyId',
            journalEntries: 'id, date, companyId',
            attendance: 'id, date, employeeId, companyId',
            leaveRequests: 'id, status, employeeId, companyId',
            documents: 'id, employeeId, companyId',
            roles: 'id, companyId'
        });
    }
}

export const db = new AppDatabase();

export const seedDatabase = async () => {
    try {
        if (!(db as any).isOpen()) {
             await (db as any).open();
        }
        
        // Seed Products if empty
        const productCount = await db.products.count();
        if (productCount === 0) {
            console.log("Seeding database with mock products...");
            const items = [
                { name: 'Tomato', cat: 'Vegetables', price: 5.00, cost: 3.00, unit: 'weight' },
                { name: 'Cucumber', cat: 'Vegetables', price: 4.50, cost: 2.50, unit: 'weight' },
                { name: 'Full Fat Milk (1L)', cat: 'Dairy', price: 6.00, cost: 4.50 },
                { name: 'White Toast', cat: 'Bakery', price: 5.00, cost: 3.00 },
                { name: 'Whole Chicken (1000g)', cat: 'Meat', price: 16.00, cost: 12.00 },
                { name: 'Pepsi (Can)', cat: 'Drinks', price: 2.50, cost: 1.80 },
                { name: 'Basmati Rice (5kg)', cat: 'Pantry', price: 45.00, cost: 35.00 },
                { name: 'Potato Chips', cat: 'Snacks', price: 7.00, cost: 4.00 },
                { name: 'Shampoo', cat: 'Personal Care', price: 18.00, cost: 12.00 },
                { name: 'Dish Soap', cat: 'Cleaning', price: 10.00, cost: 6.00 },
            ];

            const products: SupermarketProduct[] = items.map((item, index) => ({
                id: `p${index + 1}`,
                name: item.name,
                category: item.cat,
                price: item.price,
                cost: item.cost,
                barcode: `${1000 + index + 1}`,
                stockByBranch: { 'b1': 50, 'b2': 20 },
                lowStockThreshold: 10,
                imageUrls: [],
                unitType: (item.unit as any) || 'piece',
                syncStatus: 'synced',
                taxRate: 15,
                createdAt: new Date().toISOString(),
                priceLastUpdatedAt: new Date().toISOString(),
                // Default company for seeding
                // In a real app, seed data might be handled differently
                companyId: 'c2' // Assign to Supermarket demo company
            }));

            await db.products.bulkAdd(products);
        }

        // Seed Users if empty
        const userCount = await db.users.count();
        if (userCount === 0) {
            // Import MOCK_USERS to seed initial admin users
            // We do this dynamically to avoid circular dependency issues
             console.log("Seeding initial users...");
             // Placeholder for user seeding logic if needed
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
