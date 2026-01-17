'use client';

import React, { CSSProperties } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'ghost' | 'gradient';
  colorScheme?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'warning';
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fontSize?: string;
  padding?: string;
  customStyles?: CSSProperties;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const colorSchemes: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  primary: {
    bg: '#4567CC',
    text: '#ffffff',
    border: '#4567CC',
    hover: '#3a52a0'
  },
  secondary: {
    bg: '#140840',
    text: '#ffffff',
    border: '#140840',
    hover: '#0d0228'
  },
  accent: {
    bg: '#C441B9',
    text: '#ffffff',
    border: '#C441B9',
    hover: '#9d3491'
  },
  success: {
    bg: '#10b981',
    text: '#ffffff',
    border: '#10b981',
    hover: '#059669'
  },
  danger: {
    bg: '#ef4444',
    text: '#ffffff',
    border: '#ef4444',
    hover: '#dc2626'
  },
  warning: {
    bg: '#f59e0b',
    text: '#ffffff',
    border: '#f59e0b',
    hover: '#d97706'
  }
};

const sizeStyles: Record<string, { padding: string; fontSize: string }> = {
  sm: { padding: '6px 12px', fontSize: '0.875rem' },
  md: { padding: '10px 16px', fontSize: '1rem' },
  lg: { padding: '12px 24px', fontSize: '1.125rem' },
  xl: { padding: '16px 32px', fontSize: '1.25rem' }
};

const borderRadiusStyles: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px'
};

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'solid',
  colorScheme = 'primary',
  fullWidth = false,
  rounded = 'md',
  fontSize,
  padding,
  customStyles = {},
  type = 'button'
}: ButtonProps) {
  const colors = colorSchemes[colorScheme];
  const sizeStyle = sizeStyles[size];
  const borderRadius = borderRadiusStyles[rounded];

  let baseStyles: CSSProperties = {
    padding: padding || sizeStyle.padding,
    fontSize: fontSize || sizeStyle.fontSize,
    fontWeight: 500,
    border: '2px solid transparent',
    borderRadius,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...customStyles
  };

  if (variant === 'solid') {
    baseStyles = {
      ...baseStyles,
      backgroundColor: colors.bg,
      color: colors.text,
      border: `2px solid ${colors.bg}`,
      fontSize: '2rem'
    };
  } else if (variant === 'outline') {
    baseStyles = {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: colors.text,
      border: `3px solid ${colors.text}`,
      fontSize: '2rem'
    };
  } else if (variant === 'ghost') {
    baseStyles = {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: colors.bg,
      border: '2px solid transparent'
    };
  } else if (variant === 'gradient') {
    baseStyles = {
      ...baseStyles,
      background: `linear-gradient(135deg, ${colors.bg}, ${colors.hover})`,
      color: colors.text,
      border: `2px solid transparent`
    };
  }

  const hoverStyles = {
    backgroundColor: variant === 'solid' || variant === 'gradient' ? colors.hover : 'transparent',
    borderColor: variant !== 'ghost' ? colors.hover : 'transparent',
    color: variant === 'outline' || variant === 'ghost' ? colors.hover : colors.text,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign((e.target as HTMLElement).style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign((e.target as HTMLElement).style, {
            backgroundColor: baseStyles.backgroundColor,
            borderColor: baseStyles.borderColor,
            color: baseStyles.color,
            transform: 'translateY(0)',
            boxShadow: 'none'
          });
        }
      }}
    >
      {loading && (
        <span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
      )}
      {children}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
