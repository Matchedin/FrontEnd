'use client';

import React, { CSSProperties } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'flushed';
  colorScheme?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'warning';
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fullWidth?: boolean;
  customStyles?: CSSProperties;
  rows?: number;
  maxLength?: number;
}

const colorSchemes: Record<string, { border: string; focus: string; text: string }> = {
  primary: { border: '#4567CC', focus: '#4567CC', text: '#4567CC' },
  secondary: { border: '#140840', focus: '#140840', text: '#140840' },
  accent: { border: '#C441B9', focus: '#C441B9', text: '#C441B9' },
  success: { border: '#10b981', focus: '#10b981', text: '#10b981' },
  danger: { border: '#ef4444', focus: '#ef4444', text: '#ef4444' },
  warning: { border: '#f59e0b', focus: '#f59e0b', text: '#f59e0b' }
};

const sizeStyles: Record<string, { padding: string; fontSize: string }> = {
  sm: { padding: '6px 12px', fontSize: '0.875rem' },
  md: { padding: '10px 16px', fontSize: '1rem' },
  lg: { padding: '12px 20px', fontSize: '1.125rem' }
};

const borderRadiusStyles: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px'
};

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'outlined',
  colorScheme = 'primary',
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  rounded = 'md',
  fullWidth = false,
  customStyles = {},
  rows = 4,
  maxLength
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const colors = colorSchemes[colorScheme];
  const sizeStyle = sizeStyles[size];
  const borderRadius = borderRadiusStyles[rounded];
  const hasValue = value && value.toString().length > 0;
  const isFloating = isFocused || hasValue;

  // Add floating label styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatUp {
        from {
          transform: translateY(0) scale(1);
          opacity: 0.7;
        }
        to {
          transform: translateY(-24px) scale(0.85);
          opacity: 1;
        }
      }

      @keyframes floatDown {
        from {
          transform: translateY(-24px) scale(0.85);
          opacity: 1;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 0.7;
        }
      }

      .floating-label {
        animation: floatUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .floating-label-down {
        animation: floatDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const containerStyles: CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    position: 'relative',
    height: 'auto',
    paddingBottom: '4px'
  };

  const labelStyles: CSSProperties = {
    fontSize: isFloating ? '0.75rem' : '0.95rem',
    fontWeight: isFloating ? 600 : 500,
    color: error ? '#ef4444' : (isFloating ? colors.focus : 'rgba(32, 32, 32, 0.6)'),
    position: 'absolute',
    top: isFloating ? '-6px' : (icon && iconPosition === 'left' ? '14px' : '14px'),
    left: icon && iconPosition === 'left' ? '40px' : '16px',
    background: isFloating ? 'var(--background)' : 'transparent',
    padding: isFloating ? '0 4px' : '0',
    pointerEvents: 'none',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transformOrigin: 'left top',
    zIndex: isFloating ? 10 : 5
  };

  const inputContainerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    width: '100%',
    paddingTop: '8px',
    overflow: 'visible'
  };

  const inputStyles: CSSProperties = {
    padding: icon ? (iconPosition === 'left' ? `${sizeStyle.padding.split(' ')[0]} ${sizeStyle.padding.split(' ')[1]} ${sizeStyle.padding.split(' ')[0]} 40px` : `${sizeStyle.padding.split(' ')[0]} 40px ${sizeStyle.padding.split(' ')[0]} ${sizeStyle.padding.split(' ')[1]}`) : sizeStyle.padding,
    fontSize: sizeStyle.fontSize,
    borderRadius,
    border: variant === 'outlined' ? `2px solid ${error ? '#ef4444' : '#d1d5db'}` : 'none',
    borderBottom: variant === 'flushed' ? `2px solid ${error ? '#ef4444' : '#d1d5db'}` : 'none',
    backgroundColor: variant === 'filled' ? '#f3f4f6' : 'transparent',
    width: '100%',
    outline: 'none',
    transition: 'all 0.3s ease',
    color: 'var(--foreground)',
    ...customStyles
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const sharedProps = {
    placeholder: placeholder || '',
    value,
    onChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled,
    required,
    maxLength,
    style: {
      ...inputStyles,
      borderColor: isFocused ? colors.focus : (error ? '#ef4444' : inputStyles.borderColor),
      boxShadow: isFocused ? `0 0 0 3px ${colors.focus}20` : 'none'
    }
  };

  return (
    <div style={containerStyles}>
      <div style={inputContainerStyles}>
        {label && (
          <label style={labelStyles}>
            {label} {required && '*'}
          </label>
        )}
        
        {icon && iconPosition === 'left' && (
          <span style={{ position: 'absolute', left: '12px', display: 'flex', alignItems: 'center', color: colors.focus, zIndex: 2 }}>
            {icon}
          </span>
        )}
        
        {type === 'textarea' ? (
          <textarea {...sharedProps} rows={rows} style={{ ...sharedProps.style, resize: 'vertical' }} />
        ) : (
          <input {...sharedProps} type={type} />
        )}
        
        {icon && iconPosition === 'right' && (
          <span style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', color: colors.focus }}>
            {icon}
          </span>
        )}
      </div>

      {error && <span style={{ fontSize: '0.875rem', color: '#ef4444', marginTop: '4px' }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>{helperText}</span>}
    </div>
  );
}
