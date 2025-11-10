import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserModal from '../EditUserModal';
import * as Recognition from '../../features/faces/Recognition';

// Mock the Recognition module
vi.mock('../../features/faces/Recognition', () => ({
  updateFaceByIndex: vi.fn(),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('EditUserModal Component', () => {
  const mockOnHide = vi.fn();
  const mockOnUserUpdated = vi.fn();
  
  const mockFace = {
    name: 'John Doe',
    descriptor: [1, 2, 3],
    dob: '1990-05-15',
    gender: 'male',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with face data', () => {
    render(
      <EditUserModal
        show={true}
        onHide={mockOnHide}
        face={mockFace}
        faceIndex={0}
        onUserUpdated={mockOnUserUpdated}
      />
    );

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('should validate name is required', async () => {
    render(
      <EditUserModal
        show={true}
        onHide={mockOnHide}
        face={mockFace}
        faceIndex={0}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter name');
    const saveButton = screen.getByText('Save Changes');

    // Clear name
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(Recognition.updateFaceByIndex).not.toHaveBeenCalled();
    });
  });

  it('should call updateFaceByIndex with correct parameters', async () => {
    render(
      <EditUserModal
        show={true}
        onHide={mockOnHide}
        face={mockFace}
        faceIndex={0}
        onUserUpdated={mockOnUserUpdated}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter name');
    const saveButton = screen.getByText('Save Changes');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(Recognition.updateFaceByIndex).toHaveBeenCalledWith(
        0,
        'Jane Doe',
        '1990-05-15',
        'male'
      );
      expect(mockOnUserUpdated).toHaveBeenCalled();
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  it('should use nullish coalescing for faceIndex 0', () => {
    render(
      <EditUserModal
        show={true}
        onHide={mockOnHide}
        face={mockFace}
        faceIndex={0} // This is the critical test
        onUserUpdated={mockOnUserUpdated}
      />
    );

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Should use index 0, not -1
    expect(Recognition.updateFaceByIndex).toHaveBeenCalledWith(
      0, // Should be 0, not -1
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
  });

  it('should reset form when face is null', () => {
    const { rerender } = render(
      <EditUserModal
        show={true}
        onHide={mockOnHide}
        face={mockFace}
        faceIndex={0}
      />
    );

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();

    // Rerender with null face
    rerender(
      <EditUserModal
        show={true}
        onHide={mockOnHide}
        face={null}
        faceIndex={-1}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter name');
    expect(nameInput).toHaveValue('');
  });

  it('should hide "Select Gender" placeholder option', () => {
    render(
      <EditUserModal
        show={true}
        onHide={mockOnHide}
        face={mockFace}
        faceIndex={0}
      />
    );

    const genderSelect = screen.getAllByRole('combobox').find(
      (el) => el.querySelector('option[value=""]')
    );

    const placeholderOption = genderSelect?.querySelector('option[value=""]');
    expect(placeholderOption).toHaveAttribute('disabled');
    expect(placeholderOption).toHaveAttribute('hidden');
  });
});
