import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import CourtDetails from '../pages/CourtDetails';
import '@testing-library/jest-dom';

// Mock router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

// Mock Google Maps
const mockMap = jest.fn();
const mockMarker = jest.fn();
window.google = {
  maps: {
    Map: mockMap,
    Marker: mockMarker
  }
};

describe('CourtDetails', () => {
  const mockCourt = {
    _id: '123',
    name: 'Test Court',
    address: '123 Test St',
    image: '/test-image.jpg',
    coordinates: {
      lat: 49.2827,
      lng: -123.1207
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: '123' });
    useNavigate.mockReturnValue(jest.fn());

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourt)
      })
    );
  });

  test('renders court details', async () => {
    render(
      <BrowserRouter>
        <CourtDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockCourt.name)).toBeInTheDocument();
      expect(screen.getByText(mockCourt.address)).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', mockCourt.image);
    });
  });

  test('initializes Google Map', async () => {
    render(
      <BrowserRouter>
        <CourtDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockMap).toHaveBeenCalled();
      expect(mockMarker).toHaveBeenCalled();
    });
  });

  test('handles error when fetching court details', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false
      })
    );

    render(
      <BrowserRouter>
        <CourtDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Unable to load court details/)).toBeInTheDocument();
    });
  });

  test('shows loading state', () => {
    render(
      <BrowserRouter>
        <CourtDetails />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});