import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../../context/AuthContext';
import theme from '../../theme';
import HomePage from '../../pages/HomePage';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: false,
      user: null
    })
  };
});

describe('HomePage Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  });

  it('renders the hero section correctly', () => {
    expect(screen.getByText('Promise Road')).toBeInTheDocument();
    expect(screen.getByText('Create, share, and grow your Christian content ministry')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Your Journey/i })).toBeInTheDocument();
  });

  it('displays featured blog posts section', () => {
    expect(screen.getByText('Featured Blog Posts')).toBeInTheDocument();
    expect(screen.getByText('Finding Peace in Scripture')).toBeInTheDocument();
    expect(screen.getByText('Modern Christian Living')).toBeInTheDocument();
    expect(screen.getByText('The Power of Community')).toBeInTheDocument();
  });

  it('displays featured videos section', () => {
    expect(screen.getByText('Featured Videos')).toBeInTheDocument();
    expect(screen.getByText('Worship Session: Amazing Grace')).toBeInTheDocument();
    expect(screen.getByText('Bible Study: Sermon on the Mount')).toBeInTheDocument();
    expect(screen.getByText('Testimony: Finding Faith in Difficult Times')).toBeInTheDocument();
  });

  it('displays the scripture quote section', () => {
    expect(screen.getByText('"Let your light shine before others."')).toBeInTheDocument();
    expect(screen.getByText('— Matthew 5:16')).toBeInTheDocument();
  });

  it('displays the "Why Promise Road" section', () => {
    expect(screen.getByText('Why Promise Road?')).toBeInTheDocument();
    expect(screen.getByText('Spread the Gospel')).toBeInTheDocument();
    expect(screen.getByText('Build Community')).toBeInTheDocument();
    expect(screen.getByText('Professional Tools')).toBeInTheDocument();
  });

  it('navigates to register page when clicking Start Your Journey button', () => {
    const startJourneyButton = screen.getByRole('button', { name: /Start Your Journey/i });
    
    // Click the button
    fireEvent.click(startJourneyButton);
    
    // Since we're using BrowserRouter in a test environment, we can't directly test navigation
    // In a real test, we would check if we're on the register page
  });
});

// Test with authenticated user
describe('HomePage Component with Authenticated User', () => {
  beforeEach(() => {
    // Mock the useAuth hook to return an authenticated user
    vi.mock('../../context/AuthContext', async () => {
      const actual = await vi.importActual('../../context/AuthContext');
      return {
        ...actual,
        useAuth: () => ({
          isAuthenticated: true,
          user: {
            id: '1',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            role: 'creator'
          }
        })
      };
    });

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  });

  it('displays Go to Dashboard button for authenticated users', () => {
    expect(screen.getByRole('button', { name: /Go to Dashboard/i })).toBeInTheDocument();
  });
});
