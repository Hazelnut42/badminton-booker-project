import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import '@testing-library/jest-dom';

global.fetch = jest.fn();

const mockCourts = [
  {
    _id: '673d219339c2b190254cd51c',
    name: "ClearOne Badminton Centre",
    address: "2368 No 5 Rd Unit 160, Richmond, BC V6X 2T1",
    image: "/images/clearone.jpg"
  },
  {
    _id: '673d219339c2b190254cd519',
    name: "Stage 18 Badminton Centre",
    address: "2351 No 6 Rd #170, Richmond, BC V6V 1P3",
    image: "/images/stage18.jpg"
  }
];

describe('Homepage Component', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test('displays loading state initially', () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    expect(screen.getByText('Loading courts...')).toBeInTheDocument();
  });

  test('displays courts after loading', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourts
    });

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('ClearOne Badminton Centre')).toBeInTheDocument();
      expect(screen.getByText('Stage 18 Badminton Centre')).toBeInTheDocument();
    });
  });

  test('search functionality filters courts correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourts
    });

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('ClearOne Badminton Centre')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search courts...');
    fireEvent.change(searchInput, { target: { value: 'Stage 18' } });

    expect(screen.queryByText('ClearOne Badminton Centre')).not.toBeInTheDocument();
    expect(screen.getByText('Stage 18 Badminton Centre')).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load courts data.')).toBeInTheDocument();
    });
  });
});