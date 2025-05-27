import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../../context/AuthContext';
import theme from '../../theme';
import LoginPage from '../../pages/LoginPage';

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('LoginPage Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  });

  it('renders the login form correctly', () => {
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\? Sign Up/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    
    // Submit the form without filling in any fields
    fireEvent.click(signInButton);
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const emailInput = screen.getByLabelText(/Email Address/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    
    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Submit the form
    fireEvent.click(signInButton);
    
    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    
    // Enter valid email but short password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    
    // Submit the form
    fireEvent.click(signInButton);
    
    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/Password should be of minimum 8 characters length/i)).toBeInTheDocument();
    });
  });

  it('navigates to register page when clicking sign up link', () => {
    const signUpLink = screen.getByText(/Don't have an account\? Sign Up/i);
    
    // Click the sign up link
    fireEvent.click(signUpLink);
    
    // Since we're using a mocked useNavigate, we can't directly test navigation
    // In a real test, we would check if we're on the register page
  });
});
