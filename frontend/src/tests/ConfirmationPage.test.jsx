import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import ConfirmationPage from '../pages/ConfirmationPage';
import '@testing-library/jest-dom';

// Mock useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

describe('ConfirmationPage', () => {
  const mockBooking = {
    courtName: 'Test Court',
    date: '2024-12-01',
    timeSlot: '8:00-9:00',
    courtLocation: '123 Test St'
  };

  beforeEach(() => {
    useLocation.mockReturnValue({
      state: { booking: mockBooking }
    });
  });

  test('renders booking confirmation with details', () => {
    render(
      <BrowserRouter>
        <ConfirmationPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Booking Confirmation')).toBeInTheDocument();
    expect(screen.getByText(/Test Court/)).toBeInTheDocument();
    expect(screen.getByText(/123 Test St/)).toBeInTheDocument();
  });

  test('shows message when no booking data is available', () => {
    useLocation.mockReturnValue({ state: null });

    render(
      <BrowserRouter>
        <ConfirmationPage />
      </BrowserRouter>
    );

    expect(screen.getByText('You have not booked any court yet!')).toBeInTheDocument();
  });

  test('renders return to home button', () => {
    render(
      <BrowserRouter>
        <ConfirmationPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Return to Home')).toBeInTheDocument();
  });
});