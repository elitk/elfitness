import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsModal from '../SettingsModal';
import { SettingsProvider } from '@/context/SettingsContext';

function renderWithProvider(ui: React.ReactElement) {
  return render(<SettingsProvider>{ui}</SettingsProvider>);
}

describe('SettingsModal', () => {
  it('renders and opens modal', () => {
    renderWithProvider(<SettingsModal />);
    const trigger = screen.getByRole('button', { name: /settings/i });
    expect(trigger).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('heading', { name: /settings/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /appearance/i, level: 2 })).toBeInTheDocument();
  });

  it('toggles dark mode switch', () => {
    renderWithProvider(<SettingsModal />);
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    const checkbox = screen.getByLabelText(/toggle dark mode/i);
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('selects theme via segmented control', () => {
    renderWithProvider(<SettingsModal />);
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    const darkBtn = screen.getByRole('button', { name: /dark/i });
    const lightBtn = screen.getByRole('button', { name: /light/i });
    const systemBtn = screen.getByRole('button', { name: /system/i });
    fireEvent.click(darkBtn);
    expect(darkBtn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(lightBtn);
    expect(lightBtn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(systemBtn);
    expect(systemBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('is accessible via keyboard', () => {
    renderWithProvider(<SettingsModal />);
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    const closeBtn = screen.getByLabelText(/close settings/i);
    closeBtn.focus();
    expect(closeBtn).toHaveFocus();
  });
}); 