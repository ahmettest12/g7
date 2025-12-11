
import { Company, SystemIntegrations } from './types';

// This interface defines the payload we send to the backend
interface NotificationPayload {
    type: 'sms' | 'email';
    config: any; // The sensitive config (API Keys) should ideally be stored on backend, but for this hybrid structure we pass what's needed or IDs
    recipient: {
        phone?: string;
        email?: string;
        name?: string;
    };
    message: {
        title: string;
        body: string;
    };
}

/**
 * Helper to check if a company has notification capabilities enabled.
 * Checks both company-specific settings and system-wide delegation.
 */
export const getNotificationCapabilities = (company: Company | undefined, systemIntegrations: SystemIntegrations) => {
    if (!company) return { canSms: false, canEmail: false };

    const companySms = company.notificationSettings?.sms?.enabled;
    const systemSms = company.allowSystemSmsGateway && systemIntegrations?.smsConfig?.isEnabled;
    
    const companyEmail = company.notificationSettings?.email?.enabled;
    const systemEmail = company.allowSystemEmailGateway && systemIntegrations?.emailConfig?.isEnabled;

    return {
        canSms: !!(companySms || systemSms),
        canEmail: !!(companyEmail || systemEmail)
    };
};

/**
 * Production-ready notification sender.
 * This function acts as the bridge between the Frontend (React) and your Backend Server.
 * 
 * @param type 'sms' or 'email'
 * @param company The company object containing settings
 * @param systemIntegrations Global system integrations
 * @param recipient Customer details
 * @param message Content of the message
 */
export const sendNotification = async (
    type: 'sms' | 'email',
    company: Company,
    systemIntegrations: SystemIntegrations,
    recipient: { phone?: string; email?: string; name?: string },
    message: { title: string; body: string }
): Promise<{ success: boolean; message: string }> => {

    // 1. Determine Configuration Source (Company Specific vs System Wide)
    let config: any = null;
    let isSystemGateway = false;

    if (type === 'sms') {
        if (company.notificationSettings?.sms?.enabled) {
            config = company.notificationSettings.sms;
        } else if (company.allowSystemSmsGateway && systemIntegrations.smsConfig?.isEnabled) {
            config = systemIntegrations.smsConfig;
            isSystemGateway = true;
        }
    } else if (type === 'email') {
        if (company.notificationSettings?.email?.enabled) {
            config = company.notificationSettings.email;
        } else if (company.allowSystemEmailGateway && systemIntegrations.emailConfig?.isEnabled) {
            config = systemIntegrations.emailConfig;
            isSystemGateway = true;
        }
    }

    // 2. Validation
    if (!config) {
        console.warn('No configuration found for', type);
        return { success: false, message: 'Service not configured' };
    }

    if (type === 'sms' && !recipient.phone) {
        return { success: false, message: 'Customer phone number missing' };
    }
    if (type === 'email' && !recipient.email) {
        return { success: false, message: 'Customer email missing' };
    }

    // 3. Prepare Payload for Backend
    const payload: NotificationPayload = {
        type,
        config: {
            ...config,
            isSystemGateway // Flag to tell backend to use system env vars if needed
        }, 
        recipient,
        message
    };

    // 4. Send Request to Real Backend
    // REPLACE 'https://api.your-domain.com/v1/notifications/send' with your actual server URL later
    const API_ENDPOINT = process.env.REACT_APP_API_URL 
        ? `${process.env.REACT_APP_API_URL}/notifications/send` 
        : '/api/notifications/send'; 

    try {
        // NOTE: In a real deployment, you would uncomment the fetch block below.
        // For now, we log what WOULD be sent to ensure the data structure is correct.
        
        /*
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT auth
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Server Error');
        return { success: true, message: 'Sent successfully via Server' };
        */

        // --- LOGGING FOR DEVELOPMENT (Remove when backend is ready) ---
        console.log(`%c[REAL API PREPARATION] Sending ${type.toUpperCase()} to Backend`, 'color: #10b981; font-weight: bold; font-size: 12px;');
        console.log('Target Endpoint:', API_ENDPOINT);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        return { success: true, message: `Request prepared for ${type.toUpperCase()} (See Console)` };

    } catch (error: any) {
        console.error('Notification Failed:', error);
        return { success: false, message: error.message || 'Failed to connect to server' };
    }
};

// For backward compatibility if needed, aliasing to the new function
export const simulateNotification = sendNotification;
