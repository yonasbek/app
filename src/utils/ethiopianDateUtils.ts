import { EthiopianDateUtil } from 'mui-ethiopian-datepicker';

/**
 * Utility functions for converting and formatting dates to Ethiopian calendar
 */

/**
 * Converts a Gregorian date to Ethiopian date string for display
 * @param date - Date object, string, or undefined
 * @param format - Format type for the output
 * @returns Formatted Ethiopian date string
 */
export function formatToEthiopianDate(
    date: Date | string | undefined,
    format: 'short' | 'medium' | 'long' = 'medium'
): string {
    if (!date) return '';

    try {
        const gregorianDate = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(gregorianDate.getTime())) {
            return '';
        }

        const ethiopianDate = EthiopianDateUtil.toEth(gregorianDate);

        switch (format) {
            case 'short':
                return `${ethiopianDate.Day}/${ethiopianDate.Month}/${ethiopianDate.Year}`;
            case 'medium':
                return `${ethiopianDate.Day} ${getEthiopianMonthName(ethiopianDate.Month)} ${ethiopianDate.Year}`;
            case 'long':
                return `${ethiopianDate.Day} ${getEthiopianMonthName(ethiopianDate.Month)} ${ethiopianDate.Year}`;
            default:
                return `${ethiopianDate.Day} ${getEthiopianMonthName(ethiopianDate.Month)} ${ethiopianDate.Year}`;
        }
    } catch (error) {
        console.error('Error converting date to Ethiopian:', error);
        return '';
    }
}

/**
 * Converts a Gregorian date to Ethiopian date with time for display
 * @param dateTime - Date object, string, or undefined
 * @param includeTime - Whether to include time in the output
 * @returns Formatted Ethiopian date string with optional time
 */
export function formatToEthiopianDateTime(
    dateTime: Date | string | undefined,
    includeTime: boolean = true
): string {
    if (!dateTime) return '';

    try {
        const gregorianDate = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

        if (isNaN(gregorianDate.getTime())) {
            return '';
        }

        const ethiopianDate = EthiopianDateUtil.toEth(gregorianDate);
        const dateStr = `${ethiopianDate.Day} ${getEthiopianMonthName(ethiopianDate.Month)} ${ethiopianDate.Year}`;

        if (includeTime) {
            const timeStr = gregorianDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return `${dateStr} ${timeStr}`;
        }

        return dateStr;
    } catch (error) {
        console.error('Error converting date to Ethiopian:', error);
        return '';
    }
}

/**
 * Gets Ethiopian month name in Amharic
 * @param month - Month number (1-13)
 * @returns Ethiopian month name
 */
function getEthiopianMonthName(month: number): string {
    const monthNames = [
        '', // 0-indexed
        'መስከረም', // Meskerem
        'ጥቅምት', // Tikimt
        'ሕዳር', // Hidar
        'ታኅሣሥ', // Tahsas
        'ጥር', // Tir
        'የካቲት', // Yekatit
        'መጋቢት', // Megabit
        'ሚያዝያ', // Miazia
        'ግንቦት', // Ginbot
        'ሰኔ', // Sene
        'ሐምሌ', // Hamle
        'ነሐሴ', // Nehase
        'ጳጉሜን' // Pagumen
    ];

    return monthNames[month] || '';
}

/**
 * Gets Ethiopian day name in Amharic
 * @param dayOfWeek - Day of week number (0-6)
 * @returns Ethiopian day name
 */
function getEthiopianDayName(dayOfWeek: number): string {
    const dayNames = [
        'እሁድ', // Sunday
        'ሰኞ', // Monday
        'ማክሰኞ', // Tuesday
        'ረቡዕ', // Wednesday
        'ሐሙስ', // Thursday
        'አርብ', // Friday
        'ቅዳሜ' // Saturday
    ];

    return dayNames[dayOfWeek] || '';
}

/**
 * Formats a date range in Ethiopian calendar
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export function formatEthiopianDateRange(
    startDate: Date | string | undefined,
    endDate: Date | string | undefined
): string {
    if (!startDate) return '';

    const startEth = formatToEthiopianDate(startDate, 'medium');

    if (!endDate) {
        return startEth;
    }

    const endEth = formatToEthiopianDate(endDate, 'medium');

    return `${startEth} - ${endEth}`;
}

/**
 * Gets the current Ethiopian date
 * @returns Current Ethiopian date string
 */
export function getCurrentEthiopianDate(): string {
    return formatToEthiopianDate(new Date(), 'medium');
}

/**
 * Checks if a date is in Ethiopian calendar format (basic validation)
 * @param dateStr - Date string to validate
 * @returns True if appears to be Ethiopian date format
 */
export function isEthiopianDate(dateStr: string): boolean {
    // Basic check for Ethiopian date format (contains Amharic characters)
    const ethiopianPattern = /[\u1200-\u137F]/;
    return ethiopianPattern.test(dateStr);
}
