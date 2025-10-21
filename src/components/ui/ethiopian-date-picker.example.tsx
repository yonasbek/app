/**
 * Ethiopian Date Picker Component - Usage Examples
 * 
 * This file demonstrates various ways to use the EthiopianDatePicker component
 * throughout your application.
 */

import { useState } from 'react';
import { EthiopianDatePicker } from './ethiopian-date-picker';

// ============================================
// Example 1: Basic Usage
// ============================================
export function BasicExample() {
    const [date, setDate] = useState<Date>(new Date());

    return (
        <EthiopianDatePicker
            label="Select Date"
            value={date}
            onChange={setDate}
        />
    );
}

// ============================================
// Example 2: Required Field with Validation
// ============================================
export function RequiredFieldExample() {
    const [date, setDate] = useState<Date | null>(null);
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (!date) {
            setError(true);
        } else {
            setError(false);
            // Process form
        }
    };

    return (
        <div>
            <EthiopianDatePicker
                label="Birth Date *"
                value={date}
                onChange={(newDate) => {
                    setDate(newDate);
                    setError(false);
                }}
                required
                error={error}
                helperText={error ? "Date is required" : ""}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

// ============================================
// Example 3: Date Range (Start and End Date)
// ============================================
export function DateRangeExample() {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    return (
        <div className="grid grid-cols-2 gap-4">
            <EthiopianDatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                required
            />
            <EthiopianDatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate} // End date must be after start date
                required
            />
        </div>
    );
}

// ============================================
// Example 4: Disable Past Dates
// ============================================
export function FutureDatesOnlyExample() {
    const [date, setDate] = useState<Date>(new Date());

    return (
        <EthiopianDatePicker
            label="Appointment Date"
            value={date}
            onChange={setDate}
            disablePast={true}
            helperText="Please select a future date"
        />
    );
}

// ============================================
// Example 5: Disable Future Dates
// ============================================
export function PastDatesOnlyExample() {
    const [date, setDate] = useState<Date>(new Date());

    return (
        <EthiopianDatePicker
            label="Date of Birth"
            value={date}
            onChange={setDate}
            disableFuture={true}
            helperText="Select your birth date"
        />
    );
}

// ============================================
// Example 6: With Min and Max Date Range
// ============================================
export function DateRangeConstraintExample() {
    const [date, setDate] = useState<Date>(new Date());
    const minDate = new Date('2024-01-01');
    const maxDate = new Date('2024-12-31');

    return (
        <EthiopianDatePicker
            label="Event Date"
            value={date}
            onChange={setDate}
            minDate={minDate}
            maxDate={maxDate}
            helperText="Date must be within 2024"
        />
    );
}

// ============================================
// Example 7: Disabled State
// ============================================
export function DisabledExample() {
    const [date] = useState<Date>(new Date());

    return (
        <EthiopianDatePicker
            label="Fixed Date"
            value={date}
            onChange={() => { }}
            disabled={true}
            helperText="This date cannot be changed"
        />
    );
}

// ============================================
// Example 8: Different Locale (Afan Oromo)
// ============================================
export function AfanOromoLocaleExample() {
    const [date, setDate] = useState<Date>(new Date());

    return (
        <EthiopianDatePicker
            label="Guyyaa Filadhu"
            value={date}
            onChange={setDate}
            locale="AO" // Afan Oromo
        />
    );
}

// ============================================
// Example 9: Form Integration with State Management
// ============================================
export function FormIntegrationExample() {
    const [formData, setFormData] = useState({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Submit to API
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
                <EthiopianDatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => {
                        setStartDate(date);
                        setFormData((prev) => ({
                            ...prev,
                            startDate: date.toISOString().split('T')[0],
                        }));
                    }}
                    required
                />

                <EthiopianDatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => {
                        setEndDate(date);
                        setFormData((prev) => ({
                            ...prev,
                            endDate: date.toISOString().split('T')[0],
                        }));
                    }}
                    minDate={startDate}
                    required
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}

// ============================================
// Example 10: Multiple Date Pickers in a Grid
// ============================================
export function MultiplePickersExample() {
    const [dates, setDates] = useState({
        registration: new Date(),
        training: new Date(),
        evaluation: new Date(),
        certification: new Date(),
    });

    const updateDate = (field: keyof typeof dates, date: Date) => {
        setDates((prev) => ({ ...prev, [field]: date }));
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <EthiopianDatePicker
                label="Registration Date"
                value={dates.registration}
                onChange={(date) => updateDate('registration', date)}
                required
            />
            <EthiopianDatePicker
                label="Training Date"
                value={dates.training}
                onChange={(date) => updateDate('training', date)}
                minDate={dates.registration}
                required
            />
            <EthiopianDatePicker
                label="Evaluation Date"
                value={dates.evaluation}
                onChange={(date) => updateDate('evaluation', date)}
                minDate={dates.training}
                required
            />
            <EthiopianDatePicker
                label="Certification Date"
                value={dates.certification}
                onChange={(date) => updateDate('certification', date)}
                minDate={dates.evaluation}
                required
            />
        </div>
    );
}


