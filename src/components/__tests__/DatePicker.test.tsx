import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from '../DatePicker';

describe('DatePicker Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render all three dropdowns', () => {
    render(<DatePicker value="" onChange={mockOnChange} label="Date of Birth" />);
    
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });

  it('should display parsed date correctly', () => {
    render(<DatePicker value="1998-03-15" onChange={mockOnChange} />);
    
    // Should select March (03), day 15, year 1998
    const selects = screen.getAllByRole('combobox');
    expect(selects[0]).toHaveValue('03'); // Month
    expect(selects[1]).toHaveValue('15'); // Day
    expect(selects[2]).toHaveValue('1998'); // Year
  });

  it('should handle day with leading zero correctly', () => {
    render(<DatePicker value="2000-01-01" onChange={mockOnChange} />);
    
    const selects = screen.getAllByRole('combobox');
    expect(selects[1]).toHaveValue('01'); // Day should be '01' not '1'
  });

  it('should call onChange when all three values are selected', () => {
    render(<DatePicker value="" onChange={mockOnChange} />);
    
    const selects = screen.getAllByRole('combobox');
    
    // Select month, day, year
    fireEvent.change(selects[0], { target: { value: '06' } }); // June
    fireEvent.change(selects[1], { target: { value: '15' } }); // 15th
    fireEvent.change(selects[2], { target: { value: '1995' } }); // 1995
    
    expect(mockOnChange).toHaveBeenCalledWith('1995-06-15');
  });

  it('should call onChange with empty string if any value is missing', () => {
    render(<DatePicker value="1998-03-15" onChange={mockOnChange} />);
    
    const selects = screen.getAllByRole('combobox');
    
    // Clear month
    fireEvent.change(selects[0], { target: { value: '' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should render label when provided', () => {
    render(<DatePicker value="" onChange={mockOnChange} label="Birth Date" />);
    
    expect(screen.getByText('Birth Date')).toBeInTheDocument();
  });

  it('should render help text when provided', () => {
    render(<DatePicker value="" onChange={mockOnChange} helpText="Select your date of birth" />);
    
    expect(screen.getByText('Select your date of birth')).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(<DatePicker value="" onChange={mockOnChange} label="Date" required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should sync with external value changes', () => {
    const { rerender } = render(<DatePicker value="2000-01-01" onChange={mockOnChange} />);
    
    let selects = screen.getAllByRole('combobox');
    expect(selects[2]).toHaveValue('2000');
    
    // Update value prop
    rerender(<DatePicker value="2010-01-01" onChange={mockOnChange} />);
    
    selects = screen.getAllByRole('combobox');
    expect(selects[2]).toHaveValue('2010');
  });
});
