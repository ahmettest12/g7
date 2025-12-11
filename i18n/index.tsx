import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import i18next, { TFunction } from 'i18next';
import { Language } from '../types';
import { useAppContext } from '../state/AppContext.tsx';
import { useAuth } from '../state/AuthContext.tsx';
import * as actions from '../state/actions';

// List of all translation file namespaces
const namespaces = ['common', 'restaurant', 'supermarket', 'commission', 'hotel', 'automotive', 'personal', 'public', 'real_estate', 'employee', 'promotions', 'purchasing', 'hr', 'payroll', 'accounting', 'manufacturing', 'tourism', 'website_builder', 'pos', 'ecommerce', 'dashboard', 'analytics', 'auditLog', 'notifications', 'branches', 'appointment', 'reports', 'onlineOrders'];

// Helper to safely fetch JSON with content-type check
const safeFetchJson = async (url: string) => {
    try {
        const response = await fetch(url);
        
        // If network error or 404/500
        if (!response.ok) {
            return {};
        }

        // Check if the server returned HTML (common SPA fallback behavior for 404s)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
            // This is likely index.html returned instead of a JSON file
            return {};
        }

        const text = await response.text();
        
        // Double check content starts with JSON-like character
        if (text.trim().startsWith('<')) {
             return {};
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.warn(`Invalid JSON in ${url}`);
            return {};
        }
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return {};
    }
};

// Function to load and merge all translation files for a given language
const loadAllTranslations = async (language: Language): Promise<any> => {
    const promises = namespaces.map(async (ns) => {
        return await safeFetchJson(`/i18n/${ns}/${language}.json`);
    });

    // Load root language file
    const rootPromise = safeFetchJson(`/i18n/${language}.json`);
    
    // Wait for all fetches to complete
    const translationsArray = await Promise.all([rootPromise, ...promises]);
    
    const isObject = (item: any) => {
      return (item && typeof item === 'object' && !Array.isArray(item));
    };

    const deepMerge = (target: any, ...sources: any[]): any => {
      if (!sources.length) {
        return target;
      }
      const source = sources.shift();

      if (isObject(target) && isObject(source)) {
        for (const key in source) {
          if (isObject(source[key])) {
            if (!target[key]) {
              Object.assign(target, { [key]: {} });
            }
            deepMerge(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }

      return deepMerge(target, ...sources);
    };
    
    // Merge all loaded JSON objects
    return deepMerge({}, ...translationsArray);
};


interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: TFunction;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { dispatch } = useAppContext();
    const { authState } = useAuth();
    // FIX: Get currentUser from authState
    const { currentUser } = authState;
    
    const [i18nInstance, setI18nInstance] = useState<i18next.i18n | null>(null);
    const [language, setLanguageState] = useState<Language>(currentUser?.language || 'ar');
    const [isLoading, setIsLoading] = useState(true);

    // Effect to update language state when the logged-in user's preference changes
    useEffect(() => {
        const effectiveLanguage = currentUser?.language || (localStorage.getItem('language') as Language) || 'ar';
        if (language !== effectiveLanguage) {
          setLanguageState(effectiveLanguage);
        }
    }, [currentUser]);

    // Function to change the language
    const setLanguage = (lang: Language) => {
        localStorage.setItem('language', lang);
        if (currentUser) {
            dispatch({
                type: actions.UPDATE_USER_LANGUAGE,
                payload: { userId: currentUser.id, language: lang }
            });
        }
        setLanguageState(lang);
    };

    // Effect to initialize or change the language in i18next
    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            setIsLoading(true);
            try {
                const translations = await loadAllTranslations(language);
                
                if (!isMounted) return;

                const i18n = i18next.createInstance();
                await i18n.init({
                    lng: language,
                    fallbackLng: 'en',
                    resources: {
                        [language]: {
                            translation: translations
                        }
                    },
                    interpolation: {
                        escapeValue: false // React already escapes values
                    },
                    react: {
                        useSuspense: false 
                    }
                });
                
                document.documentElement.lang = language;
                document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
                
                if (isMounted) {
                    setI18nInstance(i18n);
                }
            } catch (e) {
                console.error("Failed to initialize i18n", e);
                // Fallback instance to prevent crash
                if (isMounted && !i18nInstance) {
                     const fallbackI18n = i18next.createInstance();
                     await fallbackI18n.init({ lng: 'en', resources: {} });
                     setI18nInstance(fallbackI18n);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        init();
        
        return () => { isMounted = false; };
    }, [language]);


    // Loading State
    if (isLoading || !i18nInstance) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-sans">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-semibold text-lg animate-pulse">تحميل النظام...</p>
                </div>
            </div>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: i18nInstance.t.bind(i18nInstance), isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
