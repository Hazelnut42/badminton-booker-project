import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

describe('Login Component', () => {
  const mockSetIsLoggedIn = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockedUsedNavigate.mockClear();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login setIsLoggedIn={mockSetIsLoggedIn} setUser={mockSetUser} />
      </BrowserRouter>
    );
    
    // 使用更具体的选择器
    expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    render(
      <BrowserRouter>
        <Login setIsLoggedIn={mockSetIsLoggedIn} setUser={mockSetUser} />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter both username and password')).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token', user: mockUser }),
      })
    );

    render(
      <BrowserRouter>
        <Login setIsLoggedIn={mockSetIsLoggedIn} setUser={mockSetUser} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/profile');
    });
  });
});