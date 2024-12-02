import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import axios from 'axios';
import BookingPage from '../pages/BookingPage';
import '@testing-library/jest-dom';
import moment from 'moment';

// Mock axios
jest.mock('axios');

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => jest.fn()
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock data
const mockSlots = [
  { date: '2024-12-01', time: 8, isAvailable: true },
  { date: '2024-12-01', time: 9, isAvailable: false },
  { date: '2024-12-01', time: 10, isAvailable: true }
];

describe('BookingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ courtId: '123' });
    mockLocalStorage.getItem.mockReturnValue('user123');
    axios.get.mockResolvedValue({ data: { availableSlots: mockSlots } });
  });

  const renderBookingPage = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <BookingPage />
        </BrowserRouter>
      );
    });
  };

  test('renders booking page with dates and time slots', async () => {
    await renderBookingPage();

    // Check if basic elements are rendered
    expect(screen.getByText('Book a Slot')).toBeInTheDocument();
    expect(screen.getByText('Today Date:')).toBeInTheDocument();

    // Check if time slots are rendered
    expect(screen.getByText('8:00-9:00')).toBeInTheDocument();
    expect(screen.getByText('9:00-10:00')).toBeInTheDocument();
  });

  test('allows selecting available time slots', async () => {
    await renderBookingPage();

    // Find and click an available slot button
    const availableButtons = await screen.findAllByText('Available');
    fireEvent.click(availableButtons[0]);

    // Check if the button changes to "Selected"
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  test('handles booking submission', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    axios.post.mockResolvedValueOnce({
      data: {
        booking: {
          courtId: '123',
          date: '2024-12-01',
          timeSlot: '8:00-9:00'
        }
      }
    });

    await renderBookingPage();

    // Select a time slot
    const availableButtons = await screen.findAllByText('Available');
    fireEvent.click(availableButtons[0]);

    // Click book now button
    const bookButton = screen.getByText('Book Now');
    await act(async () => {
      fireEvent.click(bookButton);
    });

    // Verify API call and navigation
    expect(axios.post).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/confirmation', expect.any(Object));
  });

  test('shows error when booking fails', async () => {
    window.alert = jest.fn();
    axios.post.mockRejectedValueOnce(new Error('Booking failed'));

    await renderBookingPage();

    // Select a time slot
    const availableButtons = await screen.findAllByText('Available');
    fireEvent.click(availableButtons[0]);

    // Click book now button
    const bookButton = screen.getByText('Book Now');
    await act(async () => {
      fireEvent.click(bookButton);
    });

    expect(window.alert).toHaveBeenCalledWith('Booking failed');
  });
});