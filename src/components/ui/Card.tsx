'use client';

import React from 'react';
import { CardProps } from '@/lib/types';

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  onClick,
}) => {
  const baseClasses = 'bg-surface border border-surface-light rounded-lg p-6 transition-all duration-200';
  const clickableClasses = onClick ? 'cursor-pointer hover:bg-surface-light hover:border-primary/20' : '';
  
  const classes = `${baseClasses} ${clickableClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card; 