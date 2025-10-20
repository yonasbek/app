# Ethiopian Date Picker - Quick Start Guide

## 🚀 Quick Start (Copy & Paste Ready)

### 1. Import the Component
```tsx
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';
```

### 2. Add State
```tsx
const [date, setDate] = useState<Date>(new Date());
```

### 3. Use the Component
```tsx
<EthiopianDatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
  required
/>
```

---

## 📋 Common Patterns

### Single Date Picker
```tsx
const [date, setDate] = useState<Date>(new Date());

<EthiopianDatePicker
  label="Date"
  value={date}
  onChange={setDate}
/>
```

### Date Range (Start & End)
```tsx
const [startDate, setStartDate] = useState<Date>(new Date());
const [endDate, setEndDate] = useState<Date>(new Date());

<div className="grid grid-cols-2 gap-4">
  <EthiopianDatePicker label="Start Date" value={startDate} onChange={setStartDate} />
  <EthiopianDatePicker label="End Date" value={endDate} onChange={setEndDate} minDate={startDate} />
</div>
```

### With Form Data
```tsx
const [date, setDate] = useState<Date>(new Date());
const [formData, setFormData] = useState({ dateField: '' });

<EthiopianDatePicker
  label="Date"
  value={date}
  onChange={(selectedDate) => {
    setDate(selectedDate);
    setFormData(prev => ({
      ...prev,
      dateField: selectedDate.toISOString().split('T')[0]
    }));
  }}
/>
```

---

## 🎯 Common Props Combinations

### Future Dates Only
```tsx
disablePast={true}
```

### Past Dates Only
```tsx
disableFuture={true}
```

### Required Field
```tsx
required
```

### With Min/Max Date
```tsx
minDate={new Date('2024-01-01')}
maxDate={new Date('2024-12-31')}
```

### With Validation Message
```tsx
error={hasError}
helperText={hasError ? "This field is required" : ""}
```

---

## 🔧 Where to Use in Your Project

### ✅ Plans & Activities
- Activity start/end dates
- Plan creation dates
- Milestone dates

### ✅ Training Module
- Enrollment dates
- Training session dates
- Certification dates

### ✅ Attendance
- Attendance date selection
- Leave request dates

### ✅ Memos
- Document dates
- Approval dates

### ✅ Room Booking
- Check-in/Check-out dates
- Reservation dates

### ✅ Contacts
- Meeting dates
- Follow-up dates

---

## 📍 File Locations

**Component**: `src/components/ui/ethiopian-date-picker.tsx`  
**Examples**: `src/components/ui/ethiopian-date-picker.example.tsx`  
**Full Docs**: `src/components/ui/ethiopian-date-picker.md`  
**Styles**: `src/app/globals.css` (Ethiopian Date Picker section)

---

## 🎨 Features Built-in

✅ Only shows Ethiopian calendar (Gregorian hidden)  
✅ Tailwind CSS styled  
✅ Amharic localization by default  
✅ Full TypeScript support  
✅ Form-ready with ISO date conversion  
✅ Accessible & keyboard navigable  
✅ Mobile responsive  

---

## 💡 Tips

1. **Always use Date objects** for `value` prop
2. **Convert to ISO** for backend: `date.toISOString().split('T')[0]`
3. **Use minDate** for date ranges to prevent invalid selections
4. **Add helperText** for better UX
5. **Set required** for mandatory fields

---

## ⚡ Copy-Paste Templates

### Template 1: Activity Dates
```tsx
import { useState } from 'react';
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';

const [startDate, setStartDate] = useState<Date>(new Date());
const [endDate, setEndDate] = useState<Date>(new Date());
const [formData, setFormData] = useState({
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0],
});

<div className="grid grid-cols-2 gap-4">
  <EthiopianDatePicker
    label="Start Date"
    value={startDate}
    onChange={(date) => {
      setStartDate(date);
      setFormData(prev => ({ ...prev, start_date: date.toISOString().split('T')[0] }));
    }}
    required
  />
  <EthiopianDatePicker
    label="End Date"
    value={endDate}
    onChange={(date) => {
      setEndDate(date);
      setFormData(prev => ({ ...prev, end_date: date.toISOString().split('T')[0] }));
    }}
    minDate={startDate}
    required
  />
</div>
```

### Template 2: Future Date Selection
```tsx
import { useState } from 'react';
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';

const [appointmentDate, setAppointmentDate] = useState<Date>(new Date());

<EthiopianDatePicker
  label="Appointment Date"
  value={appointmentDate}
  onChange={setAppointmentDate}
  disablePast={true}
  required
  helperText="Please select a future date"
/>
```

### Template 3: Birth Date
```tsx
import { useState } from 'react';
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';

const [birthDate, setBirthDate] = useState<Date | null>(null);

<EthiopianDatePicker
  label="Date of Birth"
  value={birthDate}
  onChange={setBirthDate}
  disableFuture={true}
  required
/>
```

---

## 🐛 Quick Troubleshooting

**Issue**: Date picker not showing
- **Fix**: Make sure you imported from `@/components/ui/ethiopian-date-picker`

**Issue**: TypeScript error on onChange
- **Fix**: Make sure your state is typed as `Date` or `Date | null`

**Issue**: Styles not applying
- **Fix**: Check that `globals.css` includes the Ethiopian date picker styles

**Issue**: Gregorian calendar still showing
- **Fix**: Component automatically hides it - clear browser cache if needed

---

## 📞 Need Help?

- Check full documentation: `ethiopian-date-picker.md`
- See examples: `ethiopian-date-picker.example.tsx`
- Review current usage: `src/app/(auth)/plans/[id]/activities/new/page.tsx`


