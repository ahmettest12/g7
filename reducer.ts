
// FIX: Import missing types 'Appointment' and 'JournalEntry' to resolve compile errors.
// FIX: Import missing types Goal, HotelSettings, RestaurantSettings, SupermarketSettings.
// FIX: Import missing types 'HousekeepingStatus' and 'HotelGuest' to resolve type errors.
// FIX: Import missing types 'HotelGuest' and 'HousekeepingStatus' to resolve compilation errors.
import { AppState, Action, Appointment, Company, User, CompanyData, Customer, AccountingData, PayrollRecord, Notification, RestaurantTable, TableStatus, KDSOrderStatus, DeliveryOrderStatus, RestaurantSale, OrderItem, SupermarketProduct, SupermarketSale, SupermarketCartItem, CashDrawerSession, HeldSupermarketCart, Ingredient, JournalEntry, RecipeItem, Reservation, KDSOrder, PurchaseOrder, AttendanceRecord, LeaveRequest, EmployeeDocument, HotelGuest, HotelReservation, HotelReservationStatus, Folio, FolioItem, MaintenanceRequestStatus, AutomotiveProduct, AutomotiveSale, AutomotiveRental, TakeawayOrder, PropertyListing, RealEstateSale, RealEstateRental, RealEstateAgentCommission, Promotion, Role, ReferringCompany, SubscriptionPlanDetails, SubscriptionInvoice, PublicPage, Subscription, Language, Transaction, Budget, SpreadsheetData, Sheet, CompanyType, Branch, PayrollStatus, LeaveStatus, Blueprint, SystemPublicPage, TourPackage, TourBooking, Resource, EcommerceSettings, EcommerceProduct, EcommerceOrder, EcommerceOrderItem, SuperAdminTab, Currency, EcommerceOrderStatus, VisitorLogEntry, LoginHistoryEntry, AuditLogEntry, Account, AccountType, Goal, HotelSettings, HousekeepingStatus, RestaurantSettings, SupermarketSettings, StockMovement, ChannelManagerStatus, BookingGroup, PurchaseOrderStatus, Room, RoomType, RatePlan, Floor, StockTransfer, StockTakingSession, ContactMessage, StockTakingItem, PurchaseInvoice, DeliveryOrder } from './types';
import * as actions from './state/actions';
import { MOCK_COMPANIES, MOCK_USERS, MOCK_COMPANY_DATA, MOCK_CURRENCIES, DEFAULT_RESTAURANT_SETTINGS, DEFAULT_SUPERMARKET_SETTINGS, DEFAULT_CHART_OF_ACCOUNTS } from './constants';

const getInitialState = (): AppState => {
    // FIX: Initialize accountingData for all mock companies to ensure chart of accounts is available on startup.
    const accountingData: { [key: string]: AccountingData } = {};
    MOCK_COMPANIES.forEach(company => {
        // Personal finance companies don't use this accounting system.
        if (company.type !== CompanyType.Personal) {
            accountingData[company.id] = {
                chartOfAccounts: JSON.parse(JSON.stringify(DEFAULT_CHART_OF_ACCOUNTS)),
                journalEntries: []
            };
        }
    });

  return {
    companies: MOCK_COMPANIES,
    users: MOCK_USERS,
    companyData: MOCK_COMPANY_DATA as { [companyId: string]: CompanyData },
    accountingData: accountingData,
    payrollRecords: {},
    currencies: MOCK_CURRENCIES,
    currentCustomer: null,
    currentUser: null,
    notifications: [],
    ecommerceEnabled: true,
    // System fields removed - managed in SystemContext
    // systemPublicPages: MOCK_SYSTEM_PUBLIC_PAGES,
    // subscriptionPlans: MOCK_SUBSCRIPTION_PLANS,
    // subscriptionInvoices: [],
    // systemAuditLog: [],
    // systemLoginHistory: [],
    // activeSuperAdminTab: SuperAdminTab.Companies,
    systemIntegrations: {
        smsConfig: { provider: 'twilio', isEnabled: false },
        emailConfig: { provider: 'smtp', isEnabled: false }
    },
  };
};

export const initialState: AppState = getInitialState();

const updateCompanyData = (state: AppState, companyId: string, updates: Partial<CompanyData>): AppState => {
  return {
    ...state,
    companyData: {
      ...state.companyData,
      [companyId]: {
        ...(state.companyData[companyId] || {}),
        ...updates,
      } as CompanyData,
    },
  };
};

const updateCompanyAccountingData = (state: AppState, companyId: string, updates: Partial<AccountingData>): AppState => {
    const existingData = state.accountingData[companyId] || { chartOfAccounts: [], journalEntries: [] };
    return {
        ...state,
        accountingData: {
            ...state.accountingData,
            [companyId]: {
                ...existingData,
                ...updates,
            },
        },
    };
};

const updateCompanyPayrollRecords = (state: AppState, companyId: string, records: PayrollRecord[]): AppState => {
    return {
        ...state,
        payrollRecords: {
            ...state.payrollRecords,
            [companyId]: records,
        },
    };
};


export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    // --- AUTH ---
    case actions.LOG_LOGIN_HISTORY: {
        const { loginEntry } = action.payload;
        let updatedCompanyData = { ...state.companyData };
  
        if (loginEntry) {
            // System level logging is handled in SystemContext now.
            // We only handle company-level logging here.
            
            const auditEntry: AuditLogEntry = {
              id: `audit_login_${Date.now()}`,
              userId: loginEntry.userId,
              userName: loginEntry.userName,
              actionType: 'USER_LOGIN',
              detailsKey: 'auditLog.USER_LOGIN',
              detailsParams: { ip: loginEntry.ipAddress, location: `${loginEntry.city}, ${loginEntry.country}` },
              timestamp: loginEntry.timestamp
            };
            
            if (loginEntry.companyId && updatedCompanyData[loginEntry.companyId]) {
                const companyLoginHistory = updatedCompanyData[loginEntry.companyId].loginHistory || [];
                const companyAuditLog = updatedCompanyData[loginEntry.companyId].auditLog || [];
  
                updatedCompanyData = {
                    ...updatedCompanyData,
                    [loginEntry.companyId]: {
                        ...updatedCompanyData[loginEntry.companyId],
                        loginHistory: [...companyLoginHistory, loginEntry],
                        auditLog: [...companyAuditLog, auditEntry]
                    }
                };
            }
        }
        
        return { 
            ...state, 
            companyData: updatedCompanyData,
        };
    }
    case actions.CUSTOMER_LOGIN: {
        const { customer, companyId } = action.payload;
        return { ...state, currentCustomer: { ...customer, companyId } };
    }
    case actions.CUSTOMER_REGISTER: {
        const { companyId, customerData } = action.payload;
        const newCustomer: Customer = {
            ...customerData,
            id: `cust_${Date.now()}`,
            loyaltyPoints: 0,
            purchaseHistory: []
        };
         const updatedState = updateCompanyData(state, companyId, {
            customers: [...(state.companyData[companyId]?.customers || []), newCustomer]
        });
        return {
            ...updatedState,
            currentCustomer: { ...newCustomer, companyId }
        }
    }
    case actions.CUSTOMER_LOGOUT:
        return { ...state, currentCustomer: null };
    case actions.UPDATE_USER_LANGUAGE: {
        const { userId, language } = action.payload;
        // This action now only updates the user object in the 'users' array.
        // The currentUser state is managed by AuthContext.
        return {
            ...state,
            users: state.users.map(u => u.id === userId ? {...u, language: language} : u),
        }
    }
    case actions.UPDATE_USER_THEME: {
        const { userId, theme } = action.payload;
        return {
            ...state,
            users: state.users.map(u => u.id === userId ? {...u, theme: theme} : u),
        }
    }
    case actions.UPDATE_USER_PREFERENCES: {
        const { userId, companyType, preferences } = action.payload;
        const updateUser = (user: User) => ({
            ...user,
            preferences: {
                ...user.preferences,
                [companyType]: {
                    ...(user.preferences?.[companyType as keyof User['preferences']]),
                    ...preferences
                }
            }
        });

        return {
            ...state,
            users: state.users.map(u => u.id === userId ? updateUser(u) : u),
        };
    }
    case actions.UPDATE_CUSTOMER_PROFILE: {
        const { companyId, customerId, updates } = action.payload;
        const newCustomers = (state.companyData[companyId]?.customers || []).map(c => 
            c.id === customerId ? { ...c, ...updates, password: updates.password || c.password } : c
        );
        const newCurrentCustomer = state.currentCustomer?.id === customerId 
            ? { ...state.currentCustomer, ...updates, password: updates.password || state.currentCustomer.password } 
            : state.currentCustomer;

        return {
            ...updateCompanyData(state, companyId, { customers: newCustomers }),
            currentCustomer: newCurrentCustomer
        };
    }

    // --- COMPANY ---
    case actions.ADD_COMPANY: {
      const { company, adminUser } = action.payload;
      const newCompany = { ...company, adminUserId: adminUser.id, storageUsageMB: 0, storageLimitOverrideMB: undefined };
      const newState = {
        ...state,
        companies: [...state.companies, newCompany],
        users: [...state.users, adminUser],
      };
      return updateCompanyData(newState, company.id, {
        menuItems: [], ingredients: [], restaurantTables: [], takeawayOrders: [], deliveryOrders: [], reservations: [], kdsOrders: [], restaurantSalesHistory: [], paidWaiterCommissions: [],
        supermarketProducts: [], supermarketSalesHistory: [], heldSupermarketCarts: [], paidSupermarketCommissions: [], customers: [], cashDrawerSessions: [],
        referringCompanies: [], paidCompanyCommissions: [],
        ecommerceProducts: [],
        ecommerceOrders: [],
        personalTransactions: [], personalBudgets: [], personalExpenseCategories: ['food', 'transport', 'housing', 'bills', 'entertainment', 'health', 'shopping', 'savings', 'other'], personalGoals: [], personalSpreadsheet: { sheets: [], activeSheetId: '' },
        suppliers: [], purchaseInvoices: [], purchaseOrders: [],
        attendanceRecords: [], leaveRequests: [], employeeDocuments: [],
        floors: [], roomTypes: [], ratePlans: [], rooms: [], hotelReservations: [], folios: [], hotelGuests: [], maintenanceRequests: [], connectedChannels: [], channelManagerLogs: [], bookingGroups: [], addons: [], packages: [],
        automotiveProducts: [], automotiveSales: [], automotiveRentals: [],
        propertyListings: [], realEstateSales: [], realEstateRentals: [], paidAgentCommissions: [],
        promotions: [], roles: [],
        auditLog: [],
        projects: [],
        blueprints: [],
        services: [],
        appointments: [],
        serviceWorkOrders: [],
        tourPackages: [],
        tourBookings: [],
        resources: [],
        tourismInvoices: [],
        visitorLog: [],
        loginHistory: [],
        stockMovements: [],
        stockTransfers: [],
        stockTakingSessions: [],
        contactMessages: [],
      });
    }
    case actions.UPDATE_COMPANY: {
        const { companyId, updates } = action.payload;
        return {
            ...state,
            companies: state.companies.map(c => c.id === companyId ? {...c, ...updates} : c),
        };
    }
    case actions.DELETE_COMPANY: {
        const companyId = action.payload;
        return {
            ...state,
            companies: state.companies.filter(c => c.id !== companyId),
            users: state.users.filter(u => u.companyId !== companyId),
        };
    }
    case actions.ADD_BRANCH: {
        const { companyId, branch } = action.payload;
        const newBranch: Branch = { ...branch, id: `b_${Date.now()}`};
        return {
            ...state,
            companies: state.companies.map(c => c.id === companyId ? {...c, branches: [...c.branches, newBranch]} : c),
        };
    }
    case actions.UPDATE_BRANCH: {
        const { companyId, branch } = action.payload;
        return {
            ...state,
            companies: state.companies.map(c => c.id === companyId ? {...c, branches: c.branches.map(b => b.id === branch.id ? branch : b) } : c),
        };
    }
    case actions.DELETE_BRANCH: {
        const { companyId, branchId } = action.payload;
        return {
            ...state,
            companies: state.companies.map(c => c.id === companyId ? {...c, branches: c.branches.filter(b => b.id !== branchId) } : c),
        };
    }
    case actions.UPDATE_PUBLIC_PAGE: {
        const { companyId, publicPage } = action.payload;
        return {
            ...state,
            companies: state.companies.map(c => c.id === companyId ? {...c, publicPage} : c),
        };
    }
     case actions.SET_COMPANY_QR_CODE: {
        const { companyId, dataUrl } = action.payload;
        return {
            ...state,
            companies: state.companies.map(c => c.id === companyId ? {...c, qrCodeDataUrl: dataUrl} : c),
        };
    }
    case actions.UPDATE_SUBSCRIPTION: {
        const { companyId, subscription } = action.payload;
        return {
            ...state,
            companies: state.companies.map(c => c.id === companyId ? {...c, subscription} : c),
        };
    }
    case actions.LOG_VISITOR: {
        const { companyId, entry } = action.payload as { companyId: string; entry: VisitorLogEntry };
        if (!state.companyData[companyId]) return state;
        return updateCompanyData(state, companyId, {
            visitorLog: [...(state.companyData[companyId].visitorLog || []), entry],
        });
    }
     // Super Admin - Removed System State actions as they are handled in SystemContext

    case actions.UPDATE_SUPER_ADMIN_PROFILE: {
        const { userId, updates } = action.payload;
        const newUsers = state.users.map(u => {
            if (u.id === userId) {
                const newUpdates = { ...updates };
                if (!newUpdates.password) {
                    delete newUpdates.password;
                }
                return { ...u, ...newUpdates };
            }
            return u;
        });
        return {
            ...state,
            users: newUsers,
        };
    }
    case actions.ADD_CURRENCY: {
        const newCurrency = action.payload as Currency;
        return { ...state, currencies: [...state.currencies, newCurrency] };
    }
    case actions.DELETE_CURRENCY: {
        const currencyCode = action.payload as string;
        return { ...state, currencies: state.currencies.filter(c => c.code !== currencyCode) };
    }
    case actions.ADD_SUPER_ADMIN_EMPLOYEE: {
        const newEmployee = action.payload as User;
        return { ...state, users: [...state.users, newEmployee] };
    }
    case actions.UPDATE_SUPER_ADMIN_EMPLOYEE: {
        const updatedEmployee = action.payload as User;
        const newUsers = state.users.map(u => u.id === updatedEmployee.id ? { ...u, ...updatedEmployee } : u);
        return { ...state, users: newUsers };
    }
    case actions.DELETE_SUPER_ADMIN_EMPLOYEE: {
        const { userId } = action.payload;
        return { ...state, users: state.users.filter(u => u.id !== userId) };
    }
    case actions.UPDATE_SYSTEM_INTEGRATIONS: {
        const updates = action.payload;
        return {
            ...state,
            systemIntegrations: {
                ...state.systemIntegrations,
                ...updates
            }
        }
    }
    // Employee
    case actions.ADD_EMPLOYEE: {
        const newUser = action.payload;
        return {
            ...state,
            users: [...state.users, newUser],
        };
    }
    case actions.UPDATE_EMPLOYEE: {
        const updatedUser = action.payload;
        const newUsers = state.users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
        return {
            ...state,
            users: newUsers,
        };
    }
    case actions.DELETE_EMPLOYEE: {
        const { userId } = action.payload;
        return {
            ...state,
            users: state.users.filter(u => u.id !== userId),
        };
    }
    // RBAC
    case actions.ADD_ROLE: {
        const { companyId, role } = action.payload;
        const newRole: Role = { ...role, id: `role_${Date.now()}` };
        return updateCompanyData(state, companyId, {
            roles: [...(state.companyData[companyId]?.roles || []), newRole],
        });
    }
    case actions.UPDATE_ROLE: {
        const { companyId, role } = action.payload;
        return updateCompanyData(state, companyId, {
            roles: (state.companyData[companyId]?.roles || []).map(r => r.id === role.id ? role : r),
        });
    }
    case actions.DELETE_ROLE: {
        const { companyId, roleId } = action.payload;
        return updateCompanyData(state, companyId, {
            roles: (state.companyData[companyId]?.roles || []).filter(r => r.id !== roleId),
        });
    }
    // Promotion Actions
    case actions.ADD_PROMOTION: {
        const { companyId, promotion } = action.payload;
        const companyData = state.companyData[companyId] || ({} as CompanyData);
        const promotions = companyData.promotions || [];
        return updateCompanyData(state, companyId, {
            promotions: [...promotions, promotion],
        });
    }
    case actions.UPDATE_PROMOTION: {
        const { companyId, promotion } = action.payload;
        const companyData = state.companyData[companyId] || ({} as CompanyData);
        const promotions = companyData.promotions || [];
        return updateCompanyData(state, companyId, {
            promotions: promotions.map(p => p.id === promotion.id ? promotion : p),
        });
    }
    case actions.DELETE_PROMOTION: {
        const { companyId, promotionId } = action.payload;
        const companyData = state.companyData[companyId] || ({} as CompanyData);
        const promotions = companyData.promotions || [];
        return updateCompanyData(state, companyId, {
            promotions: promotions.filter(p => p.id !== promotionId),
        });
    }
    case actions.ADD_SAVED_BROCHURE: {
        const { companyId, brochure } = action.payload;
        const company = state.companies.find(c => c.id === companyId);
        if (!company) return state;
  
        if (company.type === CompanyType.Restaurant || company.type === CompanyType.Hotel) {
          const settings = company.restaurantSettings || DEFAULT_RESTAURANT_SETTINGS;
          const savedBrochures = settings.savedBrochures || [];
          const newSettings = { ...settings, savedBrochures: [...savedBrochures, brochure] };
          return {
              ...state,
              companies: state.companies.map(c => c.id === companyId ? {...c, restaurantSettings: newSettings} : c)
          }
        } else if (company.type === CompanyType.Supermarket || company.type === CompanyType.Commission) {
          const settings = company.supermarketSettings || DEFAULT_SUPERMARKET_SETTINGS;
          const savedBrochures = settings.savedBrochures || [];
          const newSettings = { ...settings, savedBrochures: [...savedBrochures, brochure] };
          return {
              ...state,
              companies: state.companies.map(c => c.id === companyId ? {...c, supermarketSettings: newSettings} : c)
          }
        }
        return state;
    }
    // Accounting
    case actions.ADD_ACCOUNT: {
        const { companyId, account } = action.payload;
        const accountingData = state.accountingData[companyId] || { chartOfAccounts: [], journalEntries: [] };
        return updateCompanyAccountingData(state, companyId, {
            chartOfAccounts: [...accountingData.chartOfAccounts, account],
        });
    }
    case actions.ADD_JOURNAL_ENTRY: {
        const { companyId, entry } = action.payload;
        const accountingData = state.accountingData[companyId] || { chartOfAccounts: [], journalEntries: [] };
        return updateCompanyAccountingData(state, companyId, {
            journalEntries: [...accountingData.journalEntries, entry],
        });
    }
     case actions.ADD_GENERAL_EXPENSE: {
        const { companyId, expense } = action.payload;
        const accountingData = state.accountingData[companyId] || { chartOfAccounts: [], journalEntries: [] };
        
        const newEntry: JournalEntry = {
            id: `je_${Date.now()}`,
            date: expense.date,
            description: expense.description,
            lines: [
                { accountId: expense.expenseAccountId, debit: expense.amount, credit: 0 },
                { accountId: expense.paymentSource === 'cash' ? '1001' : '1002', debit: 0, credit: expense.amount }
            ],
            branchId: state.currentUser?.branchId
        };

        let newState = updateCompanyAccountingData(state, companyId, {
            journalEntries: [...accountingData.journalEntries, newEntry]
        });

        if (expense.cashDrawerSessionId) {
             const companyData = newState.companyData[companyId];
             const updatedSessions = (companyData.cashDrawerSessions || []).map(session => {
                if (session.id === expense.cashDrawerSessionId) {
                    return { ...session, cashPayouts: (session.cashPayouts || 0) + expense.amount };
                }
                return session;
            });
            newState = updateCompanyData(newState, companyId, { cashDrawerSessions: updatedSessions });
        }

        return newState;
    }

    // Purchasing Actions
    case actions.ADD_PURCHASE_INVOICE: {
        const { companyId, invoice } = action.payload;
        const newInvoice: PurchaseInvoice = { ...invoice, id: `pi_${Date.now()}` };
        let newState = updateCompanyData(state, companyId, {
            purchaseInvoices: [...(state.companyData[companyId].purchaseInvoices || []), newInvoice]
        });

        if (invoice.paymentStatus === 'paid') {
             const accountingData = state.accountingData[companyId];
             const newEntry: JournalEntry = {
                id: `je_pi_${newInvoice.id}`,
                date: invoice.date,
                description: `Purchase Invoice #${newInvoice.id} - ${invoice.supplierName}`,
                lines: [
                    { accountId: '5001', debit: invoice.totalAmount, credit: 0 }, // COGS
                    { accountId: invoice.paymentMethod === 'cash' ? '1001' : '1002', debit: 0, credit: invoice.totalAmount }
                ],
                branchId: invoice.branchId
            };
            newState = updateCompanyAccountingData(newState, companyId, {
                journalEntries: [...(accountingData?.journalEntries || []), newEntry]
            });

            if (invoice.cashDrawerSessionId) {
                 const companyData = newState.companyData[companyId];
                 const updatedSessions = (companyData.cashDrawerSessions || []).map(session => {
                    if (session.id === invoice.cashDrawerSessionId) {
                        return { ...session, cashPayouts: (session.cashPayouts || 0) + invoice.totalAmount };
                    }
                    return session;
                });
                newState = updateCompanyData(newState, companyId, { cashDrawerSessions: updatedSessions });
            }
        }
        
        return newState;
    }
    case actions.UPDATE_PURCHASE_INVOICE: {
        const { companyId, invoiceUpdate } = action.payload;
        const companyData = state.companyData[companyId];
        const oldInvoice = companyData.purchaseInvoices.find(i => i.id === invoiceUpdate.id);
        
        let newState = updateCompanyData(state, companyId, {
            purchaseInvoices: companyData.purchaseInvoices.map(i => i.id === invoiceUpdate.id ? invoiceUpdate : i)
        });

        if (oldInvoice?.paymentStatus === 'unpaid' && invoiceUpdate.paymentStatus === 'paid') {
             const accountingData = state.accountingData[companyId];
             const newEntry: JournalEntry = {
                id: `je_pi_${invoiceUpdate.id}`,
                date: invoiceUpdate.paymentDate || new Date().toISOString(),
                description: `Purchase Invoice Payment #${invoiceUpdate.id} - ${invoiceUpdate.supplierName}`,
                lines: [
                    { accountId: '5001', debit: invoiceUpdate.totalAmount, credit: 0 }, // COGS or Payable if accrual
                    { accountId: invoiceUpdate.paymentMethod === 'cash' ? '1001' : '1002', debit: 0, credit: invoiceUpdate.totalAmount }
                ],
                branchId: invoiceUpdate.branchId
            };
            newState = updateCompanyAccountingData(newState, companyId, {
                journalEntries: [...(accountingData?.journalEntries || []), newEntry]
            });

            if (invoiceUpdate.cashDrawerSessionId) {
                 const companyData = newState.companyData[companyId];
                 const updatedSessions = (companyData.cashDrawerSessions || []).map(session => {
                    if (session.id === invoiceUpdate.cashDrawerSessionId) {
                        return { ...session, cashPayouts: (session.cashPayouts || 0) + invoiceUpdate.totalAmount };
                    }
                    return session;
                });
                newState = updateCompanyData(newState, companyId, { cashDrawerSessions: updatedSessions });
            }
        }

        return newState;
    }
    case actions.ADD_PURCHASE_ORDER: {
        const { companyId, order } = action.payload;
        return updateCompanyData(state, companyId, {
            purchaseOrders: [...(state.companyData[companyId].purchaseOrders || []), order]
        });
    }
     case actions.UPDATE_PURCHASE_ORDER: {
        const { companyId, order } = action.payload;
        return updateCompanyData(state, companyId, {
            purchaseOrders: (state.companyData[companyId].purchaseOrders || []).map(o => o.id === order.id ? order : o)
        });
    }
    case actions.COMPLETE_PURCHASE_ORDER: {
        const { companyId, orderId } = action.payload;
        const companyData = state.companyData[companyId];
        const order = companyData.purchaseOrders.find(o => o.id === orderId);
        
        if (!order) return state;

        const updatedOrders = companyData.purchaseOrders.map(o => o.id === orderId ? { ...o, status: PurchaseOrderStatus.Completed } : o);
        
        // Update Inventory
        let updatedProducts = [...(companyData.supermarketProducts || [])];
        let updatedIngredients = [...(companyData.ingredients || [])];
        
        // Assume items in PO are mapped to products/ingredients correctly
        // Simplification: Update stock based on item name/id match
        const newMovements: StockMovement[] = [];

        order.items.forEach(item => {
            const prodIndex = updatedProducts.findIndex(p => p.id === item.productId);
            if (prodIndex > -1) {
                const branchId = order.branchId || 'b1';
                const currentStock = updatedProducts[prodIndex].stockByBranch[branchId] || 0;
                updatedProducts[prodIndex] = {
                    ...updatedProducts[prodIndex],
                    stockByBranch: {
                        ...updatedProducts[prodIndex].stockByBranch,
                        [branchId]: currentStock + item.quantity
                    },
                    cost: item.cost // Update cost with latest PO cost
                };
                
                newMovements.push({
                    id: `sm_po_${order.id}_${item.productId}`,
                    productId: item.productId,
                    type: 'purchase',
                    quantity: item.quantity,
                    date: new Date().toISOString(),
                    branchId: branchId,
                    performedBy: order.requesterId,
                    referenceId: order.id
                });

            } else {
                // Try Ingredients
                const ingIndex = updatedIngredients.findIndex(i => i.id === item.productId);
                if (ingIndex > -1) {
                    const branchId = order.branchId || 'b1';
                    const currentStock = updatedIngredients[ingIndex].stockByBranch[branchId] || 0;
                    updatedIngredients[ingIndex] = {
                        ...updatedIngredients[ingIndex],
                        stockByBranch: {
                            ...updatedIngredients[ingIndex].stockByBranch,
                            [branchId]: currentStock + item.quantity
                        },
                        cost: item.cost
                    };
                    
                     newMovements.push({
                        id: `sm_po_${order.id}_${item.productId}`,
                        productId: item.productId,
                        type: 'purchase',
                        quantity: item.quantity,
                        date: new Date().toISOString(),
                        branchId: branchId,
                        performedBy: order.requesterId,
                        referenceId: order.id
                    });
                }
            }
        });

        return updateCompanyData(state, companyId, {
            purchaseOrders: updatedOrders,
            supermarketProducts: updatedProducts,
            ingredients: updatedIngredients,
            stockMovements: [...(companyData.stockMovements || []), ...newMovements]
        });
    }

    // Payroll
    case actions.PROCESS_PAYROLL: {
        const { companyId, period } = action.payload;
        const companyEmployees = state.users.filter(u => u.companyId === companyId);
        const existingRecordsForPeriod = (state.payrollRecords[companyId] || []).filter(r => r.period === period);
        const newRecords = companyEmployees
            .filter(e => e.baseSalary && !existingRecordsForPeriod.find(r => r.employeeId === e.id))
            .map(e => {
                const netPay = (e.baseSalary || 0);
                const employee = state.users.find(u => u.id === e.id)!;
                const newRecord: PayrollRecord = {
                    id: `pr_${e.id}_${period}`,
                    employeeId: e.id,
                    employeeName: e.name,
                    period,
                    baseSalary: e.baseSalary || 0,
                    commissions: 0,
                    deductions: 0,
                    netPay,
                    status: PayrollStatus.Pending,
                    branchId: employee.branchId,
                };
                return newRecord;
            });
        return updateCompanyPayrollRecords(state, companyId, [...existingRecordsForPeriod, ...newRecords]);
    }
    case actions.MARK_PAYROLL_AS_PAID: {
        const { companyId, payrollRecordId, paymentSource, cashDrawerSessionId } = action.payload;
        const records = (state.payrollRecords[companyId] || []);
        const recordToPay = records.find(r => r.id === payrollRecordId);
        if (!recordToPay) return state;

        const updatedRecords = records.map(r =>
            r.id === payrollRecordId ? { ...r, status: PayrollStatus.Paid, paymentDate: new Date().toISOString(), paymentSource, cashDrawerSessionId } : r
        );
        let newState = updateCompanyPayrollRecords(state, companyId, updatedRecords);
        
        if (paymentSource === 'cash' && cashDrawerSessionId) {
            const companyData = newState.companyData[companyId];
            const updatedSessions = (companyData.cashDrawerSessions || []).map(session => {
                if (session.id === cashDrawerSessionId) {
                    return { ...session, cashPayouts: (session.cashPayouts || 0) + recordToPay.netPay };
                }
                return session;
            });
            newState = updateCompanyData(newState, companyId, { cashDrawerSessions: updatedSessions });
        }
        
        // Add Journal Entry
        const accountingData = state.accountingData[companyId];
        const newEntry: JournalEntry = {
            id: `je_pay_${payrollRecordId}`,
            date: new Date().toISOString(),
            description: `Payroll Payment - ${recordToPay.employeeName} (${recordToPay.period})`,
            lines: [
                { accountId: '5003', debit: recordToPay.netPay, credit: 0 }, // Salaries Expense
                { accountId: paymentSource === 'cash' ? '1001' : '1002', debit: 0, credit: recordToPay.netPay }
            ],
            branchId: recordToPay.branchId
        };
        newState = updateCompanyAccountingData(newState, companyId, {
             journalEntries: [...(accountingData?.journalEntries || []), newEntry]
        });

        return newState;
    }

    // --- GENERIC COMMISSION ---
    case actions.ADD_REFERRING_COMPANY: {
        const { companyId, company } = action.payload;
        const newCompany: ReferringCompany = { ...company, id: `rc_${Date.now()}`};
        return updateCompanyData(state, companyId, { referringCompanies: [...(state.companyData[companyId]?.referringCompanies || []), newCompany] });
    }
    case actions.PAY_COMPANY_COMMISSION: {
        const { companyId, commissionRecord } = action.payload;
        let newState = updateCompanyData(state, companyId, { paidCompanyCommissions: [...(state.companyData[companyId]?.paidCompanyCommissions || []), commissionRecord] });
        if (commissionRecord.paymentSource === 'cash' && commissionRecord.cashDrawerSessionId) {
            const companyData = newState.companyData[companyId];
            const updatedSessions = (companyData.cashDrawerSessions || []).map(session => {
                if (session.id === commissionRecord.cashDrawerSessionId) {
                    return { ...session, cashPayouts: (session.cashPayouts || 0) + commissionRecord.amountPaid };
                }
                return session;
            });
            newState = updateCompanyData(newState, companyId, { cashDrawerSessions: updatedSessions });
        }
        
        // Journal Entry
        const accountingData = state.accountingData[companyId];
        const newEntry: JournalEntry = {
            id: `je_comm_${commissionRecord.id}`,
            date: commissionRecord.paymentDate,
            description: `Partner Commission - ${commissionRecord.companyName}`,
            lines: [
                { accountId: '5005', debit: commissionRecord.amountPaid, credit: 0 }, // Commission Expense
                { accountId: commissionRecord.paymentSource === 'cash' ? '1001' : '1002', debit: 0, credit: commissionRecord.amountPaid }
            ],
             branchId: state.currentUser?.branchId
        };
         newState = updateCompanyAccountingData(newState, companyId, {
             journalEntries: [...(accountingData?.journalEntries || []), newEntry]
        });

        return newState;
    }

    // --- E-COMMERCE ORDERS ---
     case actions.CREATE_ECOMMERCE_ORDER: {
        const { companyId, order } = action.payload as { companyId: string, order: Omit<EcommerceOrder, 'id' | 'orderNumber'> };
        const companyData = state.companyData[companyId];
        const orderNumber = (companyData?.ecommerceOrders?.length || 0) + 1001;
        const newOrder: EcommerceOrder = {
            ...order,
            id: `ecom_${Date.now()}_${orderNumber}`,
            orderNumber: orderNumber,
        };
        return updateCompanyData(state, companyId, {
            ecommerceOrders: [...(companyData?.ecommerceOrders || []), newOrder]
        });
    }
    case actions.UPDATE_ECOMMERCE_ORDER_STATUS: {
        const { companyId, orderId, status } = action.payload;
        const company = state.companies.find(c => c.id === companyId);
        const companyData = state.companyData[companyId];

        const newOrders = (companyData?.ecommerceOrders || []).map(o =>
            o.id === orderId ? { ...o, status } : o
        );
        
        // KDS integration logic should be here if needed
        let newKdsOrders = [...(companyData?.kdsOrders || [])];
        if ((company?.type === CompanyType.Restaurant || company?.type === CompanyType.Hotel) && status === EcommerceOrderStatus.Processing) {
             // ... KDS logic (omitted for brevity, copied from SalesContext if needed or kept simple)
        }
        
        return updateCompanyData(state, companyId, { ecommerceOrders: newOrders });
    }
    case actions.UPDATE_ECOMMERCE_ORDER_DETAILS: {
         const { companyId, orderId, updates } = action.payload;
         const companyData = state.companyData[companyId];
         const newOrders = (companyData?.ecommerceOrders || []).map(o => 
             o.id === orderId ? { ...o, ...updates } : o
         );
         return updateCompanyData(state, companyId, { ecommerceOrders: newOrders });
    }
    case actions.ADD_ECOMMERCE_PRODUCT: {
        const { companyId, product } = action.payload;
        const newProduct: EcommerceProduct = { ...product, id: `ep_${Date.now()}` };
        return updateCompanyData(state, companyId, {
            ecommerceProducts: [...(state.companyData[companyId]?.ecommerceProducts || []), newProduct],
        });
    }
    case actions.UPDATE_ECOMMERCE_PRODUCT: {
        const { companyId, product } = action.payload;
        return updateCompanyData(state, companyId, {
            ecommerceProducts: (state.companyData[companyId]?.ecommerceProducts || []).map(p => p.id === product.id ? product : p),
        });
    }
    case actions.DELETE_ECOMMERCE_PRODUCT: {
        const { companyId, productId } = action.payload;
        return updateCompanyData(state, companyId, {
            ecommerceProducts: (state.companyData[companyId]?.ecommerceProducts || []).filter(p => p.id !== productId),
        });
    }
    case actions.ADD_PRODUCT_REVIEW: {
        const { companyId, productId, productType, review } = action.payload;
        const companyData = state.companyData[companyId];
        
        if (productType === 'menuItem') {
            const items = companyData.menuItems.map(i => {
                 if (i.id === productId) {
                     const reviews = [...(i.reviews || []), review];
                     const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                     return { ...i, reviews, averageRating: avg };
                 }
                 return i;
            });
            return updateCompanyData(state, companyId, { menuItems: items });
        } else {
             const items = [...(companyData.supermarketProducts || []), ...(companyData.ecommerceProducts || [])].map(p => {
                if (p.id === productId) {
                    const reviews = [...(p.reviews || []), review];
                    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                    return { ...p, reviews, averageRating: avg };
                }
                return p;
            });
             return updateCompanyData(state, companyId, { 
                 supermarketProducts: items.filter(p => !('isDigital' in p)) as SupermarketProduct[],
                 ecommerceProducts: items.filter(p => 'isDigital' in p) as EcommerceProduct[]
             });
        }
    }
    
    // --- SETTINGS ---
    case actions.UPDATE_SUPERMARKET_SETTINGS: {
        const { companyId, settings } = action.payload as { companyId: string, settings: SupermarketSettings };
        return {
            ...state,
            companies: state.companies.map(c => 
                (c.id === companyId && (c.type === CompanyType.Supermarket || c.type === CompanyType.Commission))
                ? { ...c, supermarketSettings: settings } 
                : c
            ),
        };
    }
    case actions.UPDATE_RESTAURANT_SETTINGS: {
        const { companyId, settings } = action.payload as { companyId: string, settings: RestaurantSettings };
        return {
            ...state,
            companies: state.companies.map(c => 
                (c.id === companyId && c.type === CompanyType.Restaurant)
                ? { ...c, restaurantSettings: settings } 
                : c
            ),
        };
    }
    case actions.UPDATE_HOTEL_SETTINGS: {
        const { companyId, settings } = action.payload as { companyId: string, settings: HotelSettings };
        return {
            ...state,
            companies: state.companies.map(c => 
                (c.id === companyId && c.type === CompanyType.Hotel)
                ? { ...c, hotelSettings: settings } 
                : c
            ),
        };
    }
    case actions.UPDATE_ECOMMERCE_SETTINGS: {
        const { companyId, settings } = action.payload as { companyId: string, settings: EcommerceSettings };
        return {
            ...state,
            companies: state.companies.map(c => 
                (c.id === companyId && c.type === CompanyType.Ecommerce)
                ? { ...c, ecommerceSettings: settings } 
                : c
            ),
        };
    }

    // --- RESTAURANT ---
    case actions.ACCEPT_DELIVERY_ORDER: {
         // Logic handled in SalesContext
         return state;
    }
    case actions.ADD_MENU_ITEM: {
        const { companyId, menuItem } = action.payload;
        const newItem = { ...menuItem, id: `mi_${Date.now()}` };
        return updateCompanyData(state, companyId, {
            menuItems: [...(state.companyData[companyId]?.menuItems || []), newItem],
        });
    }
    case actions.UPDATE_MENU_ITEM: {
        const { companyId, menuItem } = action.payload;
        return updateCompanyData(state, companyId, {
            menuItems: (state.companyData[companyId]?.menuItems || []).map(item => item.id === menuItem.id ? menuItem : item),
        });
    }
     case actions.DELETE_MENU_ITEM: {
        const { companyId, menuItemId } = action.payload;
        return updateCompanyData(state, companyId, {
            menuItems: (state.companyData[companyId]?.menuItems || []).filter(item => item.id !== menuItemId),
        });
    }
    case actions.ADD_RESTAURANT_TABLE: {
         // Logic in SalesContext
        return state;
    }
    case actions.DELETE_RESTAURANT_TABLE: {
         // Logic in SalesContext
        return state;
    }
    case actions.UPDATE_RESTAURANT_TABLE_DETAILS: {
         // Logic in SalesContext
        return state;
    }
    case actions.UPDATE_TABLE_LAYOUT: {
         // Logic in SalesContext
        return state;
    }
    case actions.UPDATE_TABLE_ORDER: {
         // Logic in SalesContext
      return state;
    }
    case actions.SUBMIT_AND_APPROVE_TABLE_ORDER: {
          // Logic in SalesContext
         return state;
    }
    case actions.APPROVE_TABLE_ORDER: {
         // Logic in SalesContext
        return state;
    }
    case actions.FINALIZE_TABLE_ORDER: {
         // Logic in SalesContext
        return state;
    }
    case actions.ASSIGN_WAITER_TO_TABLE: {
         // Logic in SalesContext
        return state;
    }
    case actions.MERGE_TABLE_ORDERS: {
         // Logic in SalesContext
        return state;
    }
    case actions.CREATE_TAKEAWAY_ORDER: {
         // Logic in SalesContext
        return state;
    }
    case actions.UPDATE_TAKEAWAY_ORDER: {
         // Logic in SalesContext
        return state;
    }
    case actions.COMPLETE_TAKEAWAY_SALE: {
         // Logic in SalesContext
        return state;
    }
     case actions.RESET_TAKEAWAY_COUNTER: {
         // Logic in SalesContext
        return state;
    }
    case actions.COMPLETE_RESTAURANT_SALE: {
         // Logic in SalesContext mostly, but update loyalty might be duplicated here for state consistency in non-Sales components?
         // Actually, let's keep sales logic in SalesContext.
         return state;
    }
    case actions.ADD_KDS_ORDER: {
         // Logic in SalesContext
        return state;
    }
    case actions.UPDATE_KDS_ORDER_STATUS: {
         // Logic in SalesContext
        return state;
    }
    case actions.COMPLETE_DELIVERY_SALE: {
         // Logic in SalesContext
         return state;
    }

    // --- SUPERMARKET & CUSTOMER ---
     case actions.ADD_SUPERMARKET_PRODUCT: {
        const { companyId, product } = action.payload;
        const newProduct = { ...product, id: `sp_${Date.now()}`, createdAt: new Date().toISOString(), priceLastUpdatedAt: new Date().toISOString() };
        return updateCompanyData(state, companyId, {
            supermarketProducts: [...(state.companyData[companyId]?.supermarketProducts || []), newProduct],
        });
    }
    case actions.UPDATE_SUPERMARKET_PRODUCT: {
        const { companyId, product } = action.payload;
        const oldProduct = (state.companyData[companyId]?.supermarketProducts || []).find(p => p.id === product.id);
        const priceChanged = oldProduct?.price !== product.price;

        return updateCompanyData(state, companyId, {
            supermarketProducts: (state.companyData[companyId]?.supermarketProducts || []).map(p =>
                p.id === product.id ? {...p, ...product, priceLastUpdatedAt: priceChanged ? new Date().toISOString() : p.priceLastUpdatedAt} : p
            ),
        });
    }
    case actions.DELETE_SUPERMARKET_PRODUCT: {
        const { companyId, productId } = action.payload;
        return updateCompanyData(state, companyId, {
            supermarketProducts: (state.companyData[companyId]?.supermarketProducts || []).filter(p => p.id !== productId),
        });
    }
     case actions.COMPLETE_SUPERMARKET_SALE: {
         // Logic in SalesContext
         return state;
      }
    case actions.HOLD_SUPERMARKET_CART: {
         // Logic in SalesContext
        return state;
    }
    case actions.RESUME_SUPERMARKET_CART: {
         // Logic in SalesContext
        return state;
    }
    case actions.DISCARD_HELD_SUPERMARKET_CART: {
         // Logic in SalesContext
        return state;
    }
    case actions.ADD_CUSTOMER: {
        const { companyId, customer, customerId } = action.payload;
        const newCustomer: Customer = {
            ...customer,
            id: customerId || `cust_${Date.now()}`,
            loyaltyPoints: 0,
            purchaseHistory: []
        };
        return updateCompanyData(state, companyId, {
            customers: [...(state.companyData[companyId]?.customers || []), newCustomer]
        });
    }
     case actions.UPDATE_CUSTOMER: {
        const { companyId, customer } = action.payload;
        return updateCompanyData(state, companyId, {
            customers: (state.companyData[companyId]?.customers || []).map(c => c.id === customer.id ? {...c, ...customer} : c)
        });
    }
    case actions.APPROVE_CUSTOMER: {
         // Logic in SalesContext
         return state;
    }
    case actions.OPEN_CASH_DRAWER: {
         // Logic in SalesContext
        return state;
    }
    case actions.CLOSE_CASH_DRAWER: {
         // Logic in SalesContext
         return state;
    }
    case actions.PROCESS_RETURN_EXCHANGE: {
         // Logic in SalesContext
        return state;
    }

    // --- HR ---
    case actions.ADD_ATTENDANCE_RECORD: {
        const { companyId, record } = action.payload;
        return updateCompanyData(state, companyId, {
            attendanceRecords: [...state.companyData[companyId].attendanceRecords, record]
        });
    }
    case actions.ADD_LEAVE_REQUEST: {
        const { companyId, request } = action.payload;
        return updateCompanyData(state, companyId, {
            leaveRequests: [...state.companyData[companyId].leaveRequests, request]
        });
    }
    case actions.UPDATE_LEAVE_REQUEST_STATUS: {
        const { companyId, requestId, status } = action.payload;
        const newLeaveRequests = state.companyData[companyId].leaveRequests.map(req => 
            req.id === requestId ? { ...req, status } : req
        );
        return updateCompanyData(state, companyId, { leaveRequests: newLeaveRequests });
    }
    case actions.ADD_EMPLOYEE_DOCUMENT: {
        const { companyId, document } = action.payload;
        return updateCompanyData(state, companyId, {
            employeeDocuments: [...state.companyData[companyId].employeeDocuments, document]
        });
    }


    // --- AUTOMOTIVE ---
    case actions.ADD_AUTOMOTIVE_PRODUCT: {
        const { companyId, product } = action.payload;
        const newProduct: AutomotiveProduct = { ...product, id: `auto_${Date.now()}` } as AutomotiveProduct;
        return updateCompanyData(state, companyId, {
            automotiveProducts: [...state.companyData[companyId].automotiveProducts, newProduct]
        });
    }
    case actions.UPDATE_AUTOMOTIVE_PRODUCT: {
        const { companyId, product } = action.payload;
        return updateCompanyData(state, companyId, {
            automotiveProducts: state.companyData[companyId].automotiveProducts.map(p => p.id === product.id ? product : p)
        });
    }
    case actions.DELETE_AUTOMOTIVE_PRODUCT: {
        const { companyId, productId } = action.payload;
        return updateCompanyData(state, companyId, {
            automotiveProducts: state.companyData[companyId].automotiveProducts.filter(p => p.id !== productId)
        });
    }
    case actions.ADD_AUTOMOTIVE_SALE: {
         // Logic in SalesContext
        return state;
    }
    case actions.ADD_AUTOMOTIVE_RENTAL: {
         // Logic in SalesContext
        return state;
    }
     case actions.COMPLETE_AUTOMOTIVE_RENTAL: {
         // Logic in SalesContext
        return state;
    }
    case actions.ADD_SERVICE_WORK_ORDER: {
        const { companyId, workOrder } = action.payload;
        return updateCompanyData(state, companyId, {
            serviceWorkOrders: [...state.companyData[companyId].serviceWorkOrders, { ...workOrder, id: `swo_${Date.now()}` }]
        });
    }

    // --- REAL ESTATE ---
    case actions.ADD_PROPERTY_LISTING: {
        const { companyId, listing } = action.payload;
        const newListing: PropertyListing = { 
            ...listing, 
            id: `pl_${Date.now()}`,
            status: 'available',
        };
        return updateCompanyData(state, companyId, {
            propertyListings: [...state.companyData[companyId].propertyListings, newListing],
        });
    }
    case actions.UPDATE_PROPERTY_LISTING: {
        const { companyId, listing } = action.payload;
        return updateCompanyData(state, companyId, {
            propertyListings: state.companyData[companyId].propertyListings.map(l => l.id === listing.id ? listing : l),
        });
    }
    case actions.DELETE_PROPERTY_LISTING: {
        const { companyId, listingId } = action.payload;
        return updateCompanyData(state, companyId, {
            propertyListings: state.companyData[companyId].propertyListings.filter(l => l.id !== listingId),
        });
    }
    case actions.ADD_REAL_ESTATE_SALE: {
         // Logic in SalesContext
        return state;
    }
    case actions.ADD_REAL_ESTATE_RENTAL: {
         // Logic in SalesContext
        return state;
    }
    case actions.PAY_REAL_ESTATE_COMMISSION: {
         const { companyId, commissionRecord } = action.payload;
         return updateCompanyData(state, companyId, {
             paidAgentCommissions: [...state.companyData[companyId].paidAgentCommissions, commissionRecord]
         });
    }

    // --- MANUFACTURING ---
    case actions.ADD_BLUEPRINT: {
        const { companyId, blueprint } = action.payload;
        const newBlueprint: Blueprint = { ...blueprint, id: `bp_${Date.now()}` };
        return updateCompanyData(state, companyId, {
             blueprints: [...state.companyData[companyId].blueprints, newBlueprint]
        });
    }
     case actions.UPDATE_BLUEPRINT: {
        const { companyId, blueprint } = action.payload;
        return updateCompanyData(state, companyId, {
            blueprints: state.companyData[companyId].blueprints.map(b => b.id === blueprint.id ? blueprint : b)
        });
    }
    case actions.DELETE_BLUEPRINT: {
        const { companyId, blueprintId } = action.payload;
        return updateCompanyData(state, companyId, {
            blueprints: state.companyData[companyId].blueprints.filter(b => b.id !== blueprintId)
        });
    }

    // --- TOURISM ---
    case actions.ADD_TOUR_PACKAGE: {
        const { companyId, tourPackage } = action.payload;
        const newPackage: TourPackage = { ...tourPackage, id: `tp_${Date.now()}` };
        return updateCompanyData(state, companyId, {
            tourPackages: [...state.companyData[companyId].tourPackages, newPackage]
        });
    }
    case actions.UPDATE_TOUR_PACKAGE: {
        const { companyId, tourPackage } = action.payload;
        return updateCompanyData(state, companyId, {
            tourPackages: state.companyData[companyId].tourPackages.map(p => p.id === tourPackage.id ? tourPackage : p)
        });
    }
    case actions.DELETE_TOUR_PACKAGE: {
        const { companyId, packageId } = action.payload;
        return updateCompanyData(state, companyId, {
            tourPackages: state.companyData[companyId].tourPackages.filter(p => p.id !== packageId)
        });
    }
    case actions.ADD_TOUR_BOOKING: {
        const { companyId, booking } = action.payload;
        const newBooking: TourBooking = { ...booking, id: `tb_${Date.now()}` };
        return updateCompanyData(state, companyId, {
            tourBookings: [...state.companyData[companyId].tourBookings, newBooking]
        });
    }
    case actions.UPDATE_TOUR_BOOKING: {
        const { companyId, booking } = action.payload;
        return updateCompanyData(state, companyId, {
            tourBookings: state.companyData[companyId].tourBookings.map(b => b.id === booking.id ? booking : b)
        });
    }
    case actions.DELETE_TOUR_BOOKING: {
        const { companyId, bookingId } = action.payload;
        return updateCompanyData(state, companyId, {
            tourBookings: state.companyData[companyId].tourBookings.filter(b => b.id !== bookingId)
        });
    }
    case actions.ADD_RESOURCE: {
        const { companyId, resource } = action.payload;
        const newResource: Resource = { ...resource, id: `res_${Date.now()}` };
        return updateCompanyData(state, companyId, {
            resources: [...state.companyData[companyId].resources, newResource]
        });
    }
    case actions.UPDATE_RESOURCE: {
        const { companyId, resource } = action.payload;
        return updateCompanyData(state, companyId, {
            resources: state.companyData[companyId].resources.map(r => r.id === resource.id ? resource : r)
        });
    }
    case actions.DELETE_RESOURCE: {
        const { companyId, resourceId } = action.payload;
        return updateCompanyData(state, companyId, {
            resources: state.companyData[companyId].resources.filter(r => r.id !== resourceId)
        });
    }
     case actions.ADD_TOURISM_INVOICE: {
        const { companyId, invoice } = action.payload;
        return updateCompanyData(state, companyId, {
            tourismInvoices: [...state.companyData[companyId].tourismInvoices, invoice]
        });
    }
    case actions.UPDATE_TOURISM_INVOICE_STATUS: {
        const { companyId, invoiceId, status } = action.payload;
        const newInvoices = state.companyData[companyId].tourismInvoices.map(i => 
            i.id === invoiceId ? { ...i, status } : i
        );
        return updateCompanyData(state, companyId, { tourismInvoices: newInvoices });
    }

    // --- APPOINTMENT ---
    case actions.ADD_APPOINTMENT: {
        const { companyId, appointment } = action.payload;
        const newAppointment: Appointment = { ...appointment, id: `appt_${Date.now()}` };
        return updateCompanyData(state, companyId, {
            appointments: [...state.companyData[companyId].appointments, newAppointment]
        });
    }

    // --- PERSONAL FINANCE ---
    case actions.ADD_PERSONAL_TRANSACTION: {
        const { companyId, transaction } = action.payload;
        return updateCompanyData(state, companyId, {
            personalTransactions: [...state.companyData[companyId].personalTransactions, transaction]
        });
    }
    case actions.UPDATE_PERSONAL_TRANSACTION: {
        const { companyId, transaction } = action.payload;
        return updateCompanyData(state, companyId, {
            personalTransactions: state.companyData[companyId].personalTransactions.map(t => t.id === transaction.id ? transaction : t)
        });
    }
    case actions.DELETE_PERSONAL_TRANSACTION: {
        const { companyId, transactionId } = action.payload;
         return updateCompanyData(state, companyId, {
            personalTransactions: state.companyData[companyId].personalTransactions.filter(t => t.id !== transactionId)
        });
    }
    case actions.UPDATE_PERSONAL_BUDGET: {
        const { companyId, category, amount } = action.payload;
        const currentBudgets = state.companyData[companyId].personalBudgets;
        const existingBudgetIndex = currentBudgets.findIndex(b => b.category === category);
        let newBudgets;
        if (existingBudgetIndex >= 0) {
            newBudgets = [...currentBudgets];
            newBudgets[existingBudgetIndex] = { ...newBudgets[existingBudgetIndex], amount };
        } else {
            newBudgets = [...currentBudgets, { category, amount }];
        }
        return updateCompanyData(state, companyId, { personalBudgets: newBudgets });
    }
    case actions.UPDATE_PERSONAL_SPREADSHEET: {
        const { companyId, spreadsheetData } = action.payload;
        return updateCompanyData(state, companyId, { personalSpreadsheet: spreadsheetData });
    }
    
    // --- STOCK TRANSFER & STOCK TAKING ---
    case actions.ADD_STOCK_TRANSFER: {
        const { companyId, transfer } = action.payload;
        const newTransfer: StockTransfer = { ...transfer, id: `st_${Date.now()}`, status: 'pending' };
        return updateCompanyData(state, companyId, {
            stockTransfers: [...(state.companyData[companyId]?.stockTransfers || []), newTransfer]
        });
    }
    case actions.UPDATE_STOCK_TRANSFER: {
        const { companyId, transfer } = action.payload;
        return updateCompanyData(state, companyId, {
            stockTransfers: (state.companyData[companyId]?.stockTransfers || []).map(t => t.id === transfer.id ? transfer : t)
        });
    }
    case actions.UPDATE_STOCK_TRANSFER_STATUS: {
        const { companyId, transferId, status } = action.payload;
        // Logic for stock transfer status update and inventory adjustment
        let updatedProducts = [...(state.companyData[companyId]?.supermarketProducts || [])];
        let updatedIngredients = [...(state.companyData[companyId]?.ingredients || [])];
        let newMovements: StockMovement[] = [];
        
        const transfers = state.companyData[companyId]?.stockTransfers || [];
        const transfer = transfers.find(t => t.id === transferId);
        
        if (transfer && status === 'completed' && transfer.status !== 'completed') {
            // Move stock
            transfer.items.forEach(item => {
                // Update Source (Decrease)
                const prodIndex = updatedProducts.findIndex(p => p.id === item.productId);
                if (prodIndex > -1) {
                    updatedProducts[prodIndex] = {
                        ...updatedProducts[prodIndex],
                        stockByBranch: {
                            ...updatedProducts[prodIndex].stockByBranch,
                            [transfer.sourceBranchId]: (updatedProducts[prodIndex].stockByBranch[transfer.sourceBranchId] || 0) - item.quantity,
                            [transfer.destinationBranchId]: (updatedProducts[prodIndex].stockByBranch[transfer.destinationBranchId] || 0) + item.quantity
                        }
                    };
                    
                    newMovements.push({
                         id: `sm_tr_out_${Date.now()}_${item.productId}`,
                         productId: item.productId,
                         type: 'transfer_out',
                         quantity: -item.quantity,
                         date: new Date().toISOString(),
                         branchId: transfer.sourceBranchId,
                         performedBy: state.currentUser?.id,
                         referenceId: transfer.id
                    });
                     newMovements.push({
                         id: `sm_tr_in_${Date.now()}_${item.productId}`,
                         productId: item.productId,
                         type: 'transfer_in',
                         quantity: item.quantity,
                         date: new Date().toISOString(),
                         branchId: transfer.destinationBranchId,
                         performedBy: state.currentUser?.id,
                         referenceId: transfer.id
                    });

                } else {
                    // Try ingredients
                    const ingIndex = updatedIngredients.findIndex(i => i.id === item.productId);
                    if (ingIndex > -1) {
                        updatedIngredients[ingIndex] = {
                            ...updatedIngredients[ingIndex],
                            stockByBranch: {
                                ...updatedIngredients[ingIndex].stockByBranch,
                                [transfer.sourceBranchId]: (updatedIngredients[ingIndex].stockByBranch[transfer.sourceBranchId] || 0) - item.quantity,
                                [transfer.destinationBranchId]: (updatedIngredients[ingIndex].stockByBranch[transfer.destinationBranchId] || 0) + item.quantity
                            }
                        };
                        // Similar logic for ingredients
                         newMovements.push({
                             id: `sm_tr_out_${Date.now()}_${item.productId}`,
                             productId: item.productId,
                             type: 'transfer_out',
                             quantity: -item.quantity,
                             date: new Date().toISOString(),
                             branchId: transfer.sourceBranchId,
                             performedBy: state.currentUser?.id,
                             referenceId: transfer.id
                        });
                         newMovements.push({
                             id: `sm_tr_in_${Date.now()}_${item.productId}`,
                             productId: item.productId,
                             type: 'transfer_in',
                             quantity: item.quantity,
                             date: new Date().toISOString(),
                             branchId: transfer.destinationBranchId,
                             performedBy: state.currentUser?.id,
                             referenceId: transfer.id
                        });
                    }
                }
            });
        }

        const updatedTransfers = transfers.map(t => t.id === transferId ? { ...t, status } : t);

        return updateCompanyData(state, companyId, {
            stockTransfers: updatedTransfers,
            supermarketProducts: updatedProducts,
            ingredients: updatedIngredients,
            stockMovements: [...(state.companyData[companyId]?.stockMovements || []), ...newMovements]
        });
    }
    
    case actions.RECORD_WASTAGE: {
        const { companyId, item, quantity, reason, date } = action.payload;
        const currentUser = state.currentUser;
        // FIX: Use optional chaining and fallback properly for company
        const company = state.companies.find(c => c.id === companyId);
        const branchId = currentUser?.branchId || company?.branches?.[0]?.id || 'main';
        
        let updatedProducts = [...(state.companyData[companyId]?.supermarketProducts || [])];
        let updatedIngredients = [...(state.companyData[companyId]?.ingredients || [])];
        
        // Check if it's a product
        const prodIndex = updatedProducts.findIndex(p => p.id === item.id);
        if (prodIndex > -1) {
             updatedProducts[prodIndex] = {
                ...updatedProducts[prodIndex],
                stockByBranch: {
                    ...updatedProducts[prodIndex].stockByBranch,
                    [branchId]: (updatedProducts[prodIndex].stockByBranch[branchId] || 0) - quantity
                }
            };
        } else {
            // Check ingredient
            const ingIndex = updatedIngredients.findIndex(i => i.id === item.id);
             if (ingIndex > -1) {
                updatedIngredients[ingIndex] = {
                    ...updatedIngredients[ingIndex],
                    stockByBranch: {
                        ...updatedIngredients[ingIndex].stockByBranch,
                        [branchId]: (updatedIngredients[ingIndex].stockByBranch[branchId] || 0) - quantity
                    }
                };
            }
        }
        
        const newMovement: StockMovement = {
            id: `sm_wastage_${Date.now()}`,
            productId: item.id,
            type: 'wastage',
            quantity: -quantity,
            date: date,
            branchId: branchId,
            performedBy: currentUser?.id,
            notes: reason
        };

        return updateCompanyData(state, companyId, {
             supermarketProducts: updatedProducts,
             ingredients: updatedIngredients,
             stockMovements: [...(state.companyData[companyId]?.stockMovements || []), ...newMovement] // Removed spread operator
        });
    }

    case actions.ADD_STOCK_TAKING_SESSION: {
        const { companyId, session } = action.payload;
        return updateCompanyData(state, companyId, {
            stockTakingSessions: [...(state.companyData[companyId]?.stockTakingSessions || []), session]
        });
    }

    case actions.UPDATE_STOCK_TAKING_ITEM: {
        const { companyId, sessionId, productId, quantity } = action.payload;
        const sessions = state.companyData[companyId]?.stockTakingSessions || [];
        const updatedSessions = sessions.map(s => {
            if (s.id === sessionId) {
                const newItems = s.items.map(i => i.productId === productId ? { ...i, countedStock: quantity } : i);
                return { ...s, items: newItems };
            }
            return s;
        });
        return updateCompanyData(state, companyId, { stockTakingSessions: updatedSessions });
    }

    case actions.APPROVE_STOCK_RECONCILIATION: {
         const { companyId, sessionId } = action.payload;
         const companyData = state.companyData[companyId];
         const session = companyData.stockTakingSessions.find(s => s.id === sessionId);
         if (!session || session.status === 'completed') return state;
         
         const branchId = session.branchId;
         let updatedProducts = [...(companyData.supermarketProducts || [])];
         let updatedIngredients = [...(companyData.ingredients || [])];
         const newMovements: StockMovement[] = [];

         session.items.forEach(item => {
             const variance = item.countedStock - item.systemStock;
             if (variance !== 0) {
                 const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
                 if (productIndex > -1) {
                     updatedProducts[productIndex] = {
                         ...updatedProducts[productIndex],
                         stockByBranch: { ...updatedProducts[productIndex].stockByBranch, [branchId]: item.countedStock }
                     };
                     
                     newMovements.push({
                        id: `sm_adj_${Date.now()}_${item.productId}`,
                        productId: item.productId,
                        type: 'adjustment',
                        quantity: variance,
                        date: new Date().toISOString(),
                        branchId: branchId,
                        performedBy: state.currentUser?.id,
                        referenceId: session.id,
                        notes: 'Stock Taking Reconciliation'
                    });
                 } else {
                    const ingredientIndex = updatedIngredients.findIndex(i => i.id === item.productId);
                    if (ingredientIndex > -1) {
                        updatedIngredients[ingredientIndex] = {
                            ...updatedIngredients[ingredientIndex],
                            stockByBranch: { ...updatedIngredients[ingredientIndex].stockByBranch, [branchId]: item.countedStock }
                        };

                        newMovements.push({
                            id: `sm_adj_${Date.now()}_${item.productId}`,
                            productId: item.productId,
                            type: 'adjustment',
                            quantity: variance,
                            date: new Date().toISOString(),
                            branchId: branchId,
                            performedBy: state.currentUser?.id,
                            referenceId: session.id,
                            notes: 'Stock Taking Reconciliation'
                        });
                    }
                 }
             }
         });
         
         const updatedSessions = companyData.stockTakingSessions.map(s => s.id === sessionId ? { ...s, status: 'completed' as const } : s);
         
         return updateCompanyData(state, companyId, {
             supermarketProducts: updatedProducts,
             ingredients: updatedIngredients,
             stockTakingSessions: updatedSessions,
             stockMovements: [...(companyData.stockMovements || []), ...newMovements]
         });
    }
    // --- NOTIFICATIONS ---
    case actions.ADD_NOTIFICATION: {
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    }
    case actions.REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    }
    case actions.CLEAR_ALL_NOTIFICATIONS: {
        return {
            ...state,
            notifications: []
        }
    }

    default:
      return state;
  }
};
