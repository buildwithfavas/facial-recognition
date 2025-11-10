import React from 'react';
import { Form } from 'react-bootstrap';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  label?: string;
  helpText?: string;
  required?: boolean;
}

export default function DatePicker({ value, onChange, label, helpText, required }: DatePickerProps) {
  // Parse existing value or use empty strings
  const parsedDate = value ? value.split('-') : ['', '', ''];
  const [selectedYear, setSelectedYear] = React.useState(parsedDate[0] || '');
  const [selectedMonth, setSelectedMonth] = React.useState(parsedDate[1] || '');
  const [selectedDay, setSelectedDay] = React.useState(parsedDate[2] || '');

  // Sync with external value changes
  React.useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setSelectedYear(y || '');
      setSelectedMonth(m || '');
      setSelectedDay(d || '');
    }
  }, [value]);

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);

  const handleChange = (type: 'day' | 'month' | 'year', val: string) => {
    let newDay = selectedDay;
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (type === 'day') {
      newDay = val;
      setSelectedDay(val);
    }
    if (type === 'month') {
      newMonth = val;
      setSelectedMonth(val);
    }
    if (type === 'year') {
      newYear = val;
      setSelectedYear(val);
    }

    // Only call onChange if we have all three values
    if (newDay && newMonth && newYear) {
      // Day is already padded from the select options
      onChange(`${newYear}-${newMonth}-${newDay}`);
    } else {
      // Clear the date if incomplete
      onChange('');
    }
  };

  const selectStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  };

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label style={{ fontSize: '14px', fontWeight: '500' }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </Form.Label>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Form.Select
          value={selectedMonth}
          onChange={(e) => handleChange('month', e.target.value)}
          style={{ ...selectStyle, flex: 2 }}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={selectedDay}
          onChange={(e) => handleChange('day', e.target.value)}
          style={{ ...selectStyle, flex: 1 }}
        >
          <option value="">Day</option>
          {days.map((d) => {
            const paddedDay = d.toString().padStart(2, '0');
            return (
              <option key={d} value={paddedDay}>
                {d}
              </option>
            );
          })}
        </Form.Select>

        <Form.Select
          value={selectedYear}
          onChange={(e) => handleChange('year', e.target.value)}
          style={{ ...selectStyle, flex: 1.5 }}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Form.Select>
      </div>
      {helpText && (
        <Form.Text style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '6px', display: 'block' }}>
          {helpText}
        </Form.Text>
      )}
    </Form.Group>
  );
}
