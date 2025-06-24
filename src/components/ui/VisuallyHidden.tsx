import React from 'react';

/**
 * VisuallyHidden component for accessibility (screen readers only).
 */
const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

export default VisuallyHidden; 