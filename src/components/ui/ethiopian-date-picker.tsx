'use client';

import React from 'react';
import EtDatePicker, { EtLocalizationProvider } from "mui-ethiopian-datepicker";
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Custom theme for Material-UI DatePicker to match Tailwind styling
const datePickerTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.375rem', // rounded-md
                        '& fieldset': {
                            borderColor: '#d1d5db', // gray-300
                        },
                        '&:hover fieldset': {
                            borderColor: '#9ca3af', // gray-400
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6', // blue-500
                            borderWidth: '1px',
                        },
                    },
                },
            },
        },
    },
});

export interface EthiopianDatePickerProps {
    label: string;
    value: Date | null;
    onChange: (date: Date) => void;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disablePast?: boolean;
    disableFuture?: boolean;
    error?: boolean;
    helperText?: string;
    locale?: 'AMH' | 'AO' | 'CUSTOM';
    placeholder?: string;
    className?: string;
}

export const EthiopianDatePicker: React.FC<EthiopianDatePickerProps> = ({
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    fullWidth = true,
    minDate,
    maxDate,
    disablePast = false,
    disableFuture = false,
    error = false,
    helperText,
    locale = 'AMH',
    placeholder,
    className = '',
}) => {
    return (
        <div className={`ethiopian-datepicker-wrapper ${className}`}>
            <EtLocalizationProvider
                locale={locale}
                disableGregorian={true}
                disableSwitcher={true}
            >
                <ThemeProvider theme={datePickerTheme}>
                    <EtDatePicker
                        label={label}
                        value={value}
                        onChange={(selectedDate: Date) => {
                            if (selectedDate) {
                                onChange(selectedDate);
                            }
                        }}
                        suppressHydrationWarning={true}
                        fullWidth={fullWidth}
                        required={required}
                        disabled={disabled}
                        mindate={minDate}
                        maxdate={maxDate}
                        disablepast={disablePast.toString()}
                        disablefuture={disableFuture.toString()}
                    />
                    {helperText && (
                        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                            {helperText}
                        </p>
                    )}
                </ThemeProvider>
            </EtLocalizationProvider>
        </div>
    );
};

export default EthiopianDatePicker;

