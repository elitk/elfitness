import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockLoginWithGoogle = jest.fn();
  const mockClearError = jest.fn();
  const push = jest.fn();

  const setup = (authOverrides = {}) => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loginWithGoogle: mockLoginWithGoogle,
      loading: false,
      error: null,
      clearError: mockClearError,
      user: null,
      ...authOverrides,
    });
    (useRouter as jest.Mock).mockReturnValue({ push });
    return render(<LoginForm />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and buttons', () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });



  it('calls login with valid data', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' }));
  });

  it('shows error from useAuth', () => {
    setup({ error: 'Invalid credentials' });
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('redirects to dashboard if user is set', () => {
    setup({ user: { uid: '1', email: 'a@b.com', displayName: 'A', photoURL: '', createdAt: new Date() } });
    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  it('calls loginWithGoogle on Google button click', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });

  it('clears error on input change', () => {
    setup({ error: 'Some error' });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    expect(mockClearError).toHaveBeenCalled();
  });
}); 

