

import { useMemo } from 'react';
import { Company } from '../types.ts';
import { useLanguage } from '../i18n/index.tsx';

export const useDateFormatter = (company: Company | undefined) => {
    const { language } = useLanguage();

    const formatDate = useMemo(() => {
        const settings = company?.formattingSettings || { calendar: 'gregorian', dateFormat: 'YYYY-MM-DD' };

        return (dateInput: string | Date | number): string => {
            if (!dateInput) return '';
            try {
                const date = new Date(dateInput);
                if (isNaN(date.getTime())) return ''; // Invalid date input

                if (settings.calendar === 'hijri') {
                    const locale = language === 'ar' ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura';
                    let options: Intl.DateTimeFormatOptions = {};
                    
                    if (settings.dateFormat === 'YYYY-MM-DD') {
                         options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                         // The default format is d/m/y, so we need to reorder it
                         const parts = new Intl.DateTimeFormat(locale, options).formatToParts(date);
                         const day = parts.find(p => p.type === 'day')?.value;
                         const month = parts.find(p => p.type === 'month')?.value;
                         const year = parts.find(p => p.type === 'year')?.value;
                         return `${year}-${month}-${day}`;

                    } else if (settings.dateFormat === 'DD/MM/YYYY') {
                         options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                    } else { // Month D, YYYY
                         options = { year: 'numeric', month: 'long', day: 'numeric' };
                    }
                    return new Intl.DateTimeFormat(locale, options).format(date);
                }

                // Gregorian
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                
                if (settings.dateFormat === 'DD/MM/YYYY') {
                    return `${day}/${month}/${year}`;
                }
                if (settings.dateFormat === 'Month D, YYYY') {
                    const monthName = date.toLocaleString(language, { month: 'long' });
                    return `${monthName} ${date.getDate()}, ${year}`;
                }
                // Default to YYYY-MM-DD
                return `${year}-${month}-${day}`;
            } catch(e) {
                console.error("Date formatting error:", e);
                return String(dateInput);
            }
        };
    }, [company, language]);

    return { formatDate };
};