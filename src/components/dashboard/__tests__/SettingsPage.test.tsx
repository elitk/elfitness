import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsProvider } from '@/context/SettingsContext';
import SettingsPage from '../SettingsPage';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const SettingsPageWithProvider = () => (
  <SettingsProvider>
    <SettingsPage />
  </SettingsProvider>
);

describe('SettingsPage', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue('light');
    mockLocalStorage.setItem.mockClear();
  });

  it('renders all main sections', () => {
    render(<SettingsPageWithProvider />);
    
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
    expect(screen.getByText('Data Management')).toBeInTheDocument();
  });

  it('renders dark mode toggle with correct initial state', () => {
    render(<SettingsPageWithProvider />);
    
    const darkModeSwitch = screen.getByRole('switch', { name: /toggle dark mode/i });
    expect(darkModeSwitch).toBeInTheDocument();
    expect(darkModeSwitch).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles dark mode when switch is clicked', () => {
    render(<SettingsPageWithProvider />);
    
    const darkModeSwitch = screen.getByRole('switch', { name: /toggle dark mode/i });
    
    fireEvent.click(darkModeSwitch);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme-pref', 'dark');
  });

  it('displays correct icon for current theme', () => {
    render(<SettingsPageWithProvider />);
    
    // Should show Sun icon for light theme
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders notification settings', () => {
    render(<SettingsPageWithProvider />);
    
    expect(screen.getByText('Workout Reminders')).toBeInTheDocument();
    expect(screen.getByText('Progress Updates')).toBeInTheDocument();
  });

  it('renders account management buttons', () => {
    render(<SettingsPageWithProvider />);
    
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /manage subscription/i })).toBeInTheDocument();
  });

  it('renders privacy and security options', () => {
    render(<SettingsPageWithProvider />);
    
    expect(screen.getByRole('button', { name: /privacy settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /data export/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete account/i })).toBeInTheDocument();
  });

  it('renders data management options', () => {
    render(<SettingsPageWithProvider />);
    
    expect(screen.getByText('Units')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export my data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /import workout data/i })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SettingsPageWithProvider />);
    
    const darkModeSwitch = screen.getByRole('switch', { name: /toggle dark mode/i });
    expect(darkModeSwitch).toHaveAttribute('role', 'switch');
    expect(darkModeSwitch).toHaveAttribute('aria-checked');
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Settings');
  });
}); 