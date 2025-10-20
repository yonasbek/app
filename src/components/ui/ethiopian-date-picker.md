# Ethiopian Date Picker Component

A reusable Ethiopian calendar date picker component for React/Next.js applications, styled with Tailwind CSS and built on top of `mui-ethiopian-datepicker`.

## Features

- ✅ **Ethiopian Calendar Only** - Displays only Ethiopian dates (Gregorian hidden)
- ✅ **Tailwind Styled** - Seamlessly integrates with Tailwind CSS design system
- ✅ **Fully Typed** - Complete TypeScript support
- ✅ **Localization** - Supports Amharic (AMH), Afan Oromo (AO), and Custom locales
- ✅ **Validation** - Built-in date validation and constraints
- ✅ **Accessible** - Follows accessibility best practices
- ✅ **Reusable** - Single component for all date picking needs

## Installation

The component is already set up in your project at:
```
src/components/ui/ethiopian-date-picker.tsx
```

## Basic Usage

```tsx
import { useState } from 'react';
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';

function MyComponent() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <EthiopianDatePicker
      label="Select Date"
      value={date}
      onChange={setDate}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Label text for the date picker |
| `value` | `Date \| null` | Required | The selected date value |
| `onChange` | `(date: Date) => void` | Required | Callback when date changes |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Disable the date picker |
| `fullWidth` | `boolean` | `true` | Take full width of container |
| `minDate` | `Date` | `undefined` | Minimum selectable date |
| `maxDate` | `Date` | `undefined` | Maximum selectable date |
| `disablePast` | `boolean` | `false` | Disable all past dates |
| `disableFuture` | `boolean` | `false` | Disable all future dates |
| `error` | `boolean` | `false` | Show error state |
| `helperText` | `string` | `undefined` | Helper text below the picker |
| `locale` | `'AMH' \| 'AO' \| 'CUSTOM'` | `'AMH'` | Localization type |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `className` | `string` | `''` | Additional CSS classes |

## Common Use Cases

### 1. Date Range Selection

```tsx
const [startDate, setStartDate] = useState<Date>(new Date());
const [endDate, setEndDate] = useState<Date>(new Date());

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
    minDate={startDate}
    required
  />
</div>
```

### 2. Future Dates Only (Appointments)

```tsx
<EthiopianDatePicker
  label="Appointment Date"
  value={date}
  onChange={setDate}
  disablePast={true}
  helperText="Please select a future date"
/>
```

### 3. Past Dates Only (Birth Date)

```tsx
<EthiopianDatePicker
  label="Date of Birth"
  value={birthDate}
  onChange={setBirthDate}
  disableFuture={true}
  required
/>
```

### 4. With Validation

```tsx
const [date, setDate] = useState<Date | null>(null);
const [error, setError] = useState(false);

<EthiopianDatePicker
  label="Required Date"
  value={date}
  onChange={(newDate) => {
    setDate(newDate);
    setError(false);
  }}
  required
  error={error}
  helperText={error ? "This field is required" : ""}
/>
```

### 5. Form Integration

```tsx
interface FormData {
  title: string;
  startDate: string; // ISO format for backend
  endDate: string;
}

const [formData, setFormData] = useState<FormData>({
  title: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
});

const [startDate, setStartDate] = useState<Date>(new Date());

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
```

## Styling

The component uses Tailwind CSS classes and is fully styled by default. You can add additional classes:

```tsx
<EthiopianDatePicker
  label="Date"
  value={date}
  onChange={setDate}
  className="my-4"
/>
```

### Custom Styling via Global CSS

The component uses the `.ethiopian-datepicker-wrapper` class. You can override styles in your `globals.css`:

```css
.ethiopian-datepicker-wrapper .MuiPickersDay-root.Mui-selected {
  background-color: #your-color !important;
}
```

## Localization

### Amharic (Default)

```tsx
<EthiopianDatePicker
  label="ቀን ይምረጡ"
  value={date}
  onChange={setDate}
  locale="AMH"
/>
```

### Afan Oromo

```tsx
<EthiopianDatePicker
  label="Guyyaa Filadhu"
  value={date}
  onChange={setDate}
  locale="AO"
/>
```

## Date Format

The component handles Ethiopian calendar dates internally but returns standard JavaScript `Date` objects. To convert for backend storage:

```tsx
// Convert to ISO string for backend
const isoDate = date.toISOString().split('T')[0]; // "2024-10-16"

// Convert to full ISO
const fullISO = date.toISOString(); // "2024-10-16T12:00:00.000Z"
```

## Integration Examples

### Activities Page

```tsx
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';

// In your component
<div className="grid grid-cols-2 gap-4">
  <EthiopianDatePicker
    label="Start Date"
    value={startDate}
    onChange={(date) => {
      setStartDate(date);
      setFormData((prev) => ({
        ...prev,
        start_date: date.toISOString().split('T')[0],
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
        end_date: date.toISOString().split('T')[0],
      }));
    }}
    minDate={startDate}
    required
  />
</div>
```

### Training Enrollment

```tsx
<EthiopianDatePicker
  label="Enrollment Date"
  value={enrollmentDate}
  onChange={setEnrollmentDate}
  disableFuture={true}
  required
  helperText="Date when trainee enrolled"
/>
```

### Room Booking

```tsx
<div className="grid grid-cols-2 gap-4">
  <EthiopianDatePicker
    label="Check-in Date"
    value={checkIn}
    onChange={setCheckIn}
    disablePast={true}
    required
  />
  <EthiopianDatePicker
    label="Check-out Date"
    value={checkOut}
    onChange={setCheckOut}
    minDate={checkIn}
    disablePast={true}
    required
  />
</div>
```

## Troubleshooting

### Date not displaying correctly
- Ensure you're passing a valid JavaScript `Date` object
- Check that the date is not `null` or `undefined`

### Styling issues
- Make sure Tailwind CSS is properly configured
- Verify that `globals.css` includes the Ethiopian date picker styles

### TypeScript errors
- Import the component with proper typing: `import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker'`
- Ensure your date state is typed as `Date` or `Date | null`

## Dependencies

- `mui-ethiopian-datepicker` - Ethiopian calendar implementation
- `@mui/material` - Material-UI components
- `@mui/x-date-pickers` - Date picker components
- `@emotion/react` - Styling solution
- `@emotion/styled` - Styled components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This component is part of your internal project.


