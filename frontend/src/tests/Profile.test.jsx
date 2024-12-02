import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Profile from '../pages/Profile';
import '@testing-library/jest-dom';
import moment from 'moment';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock alert
window.alert = jest.fn();

// Mock test data
const mockUserData = {
  username: 'testuser',
  email: 'test@example.com',
  displayName: 'Test User',
  bio: 'This is a test bio'
};

const mockBookings = [{
  _id: '1',
  timeSlot: moment().add(1, 'day').toISOString(), // Future date to ensure it's shown as upcoming
  courtId: {
    name: 'Test Court',
    address: '123 Test St'
  },
  status: 'confirmed'
}];

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'user_id') return '123';
      return null;
    });
  });

  const renderProfile = () => {
    return render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
  };

  test('renders and updates profile data correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData)
      })
    );
    
    axios.get.mockResolvedValueOnce({ data: mockBookings });

    renderProfile();

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Verify user profile information
    expect(screen.getByText(mockUserData.username)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.email)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.displayName)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.bio)).toBeInTheDocument();

    // Verify booking information is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Court')).toBeInTheDocument();
      expect(screen.getByText(/123 Test St/)).toBeInTheDocument();
    });
  });

  test('handles edit profile flow', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData)
      })
    );
    
    axios.get.mockResolvedValueOnce({ data: mockBookings });

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText(mockUserData.username)).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editButton);

    expect(screen.getByPlaceholderText('Enter display name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tell us about yourself/i)).toBeInTheDocument();
  });

  test('handles logout correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData)
      })
    );
    
    axios.get.mockResolvedValueOnce({ data: mockBookings });

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText(mockUserData.username)).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user_id');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
  });

  test('handles booking cancellation', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData)
      })
    );
    
    axios.get.mockResolvedValueOnce({ data: mockBookings });
    axios.delete.mockResolvedValueOnce({});

    renderProfile();

    // Wait for booking information to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Court')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Booking cancelled successfully');
    });
  });

  test('handles API error states', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Failed to fetch profile' })
      })
    );
    
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch bookings'));

    renderProfile();

    // We expect to see the bookings error message since both API calls fail
    await waitFor(() => {
      expect(screen.getByText('Failed to load bookings')).toBeInTheDocument();
    });
  });
});