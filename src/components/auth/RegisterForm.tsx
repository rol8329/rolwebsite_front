// src/components/auth/RegisterForm.tsx
import React, { useState, useEffect, CSSProperties } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import type { RegisterData } from '../../types/auth-types';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Clear auth context error when component mounts
  useEffect(() => {
    if (error) clearError();
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // First name validation
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Password confirmation validation
    if (!formData.password_confirm.trim()) {
      errors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear local errors for this field
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear password confirmation error if passwords now match
    if (name === 'password' && formData.password_confirm && value === formData.password_confirm) {
      setLocalErrors(prev => ({ ...prev, password_confirm: '' }));
    }
    if (name === 'password_confirm' && value === formData.password) {
      setLocalErrors(prev => ({ ...prev, password_confirm: '' }));
    }
    
    // Clear auth context error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      // If we get here, registration was successful
      onSuccess?.();
    } catch (registerError: unknown) {
      // Handle the error
      let errorMessage = 'Registration failed. Please try again.';
      
      if (registerError instanceof Error) {
        errorMessage = registerError.message;
      } else if (typeof registerError === 'string') {
        errorMessage = registerError;
      }
      
      onError?.(errorMessage);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join us to start your blogging journey</p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Name Fields Row */}
        <div style={styles.nameRow}>
          <div style={styles.formGroup}>
            <label htmlFor="first_name" style={styles.label}>
              First Name
            </label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First name"
                style={{
                  ...styles.input,
                  ...(localErrors.first_name ? styles.inputError : {})
                }}
                disabled={isLoading}
                autoComplete="given-name"
              />
            </div>
            {localErrors.first_name && (
              <span style={styles.errorText}>{localErrors.first_name}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="last_name" style={styles.label}>
              Last Name
            </label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last name"
                style={{
                  ...styles.input,
                  ...(localErrors.last_name ? styles.inputError : {})
                }}
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>
            {localErrors.last_name && (
              <span style={styles.errorText}>{localErrors.last_name}</span>
            )}
          </div>
        </div>

        {/* Username Field */}
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <div style={styles.inputWrapper}>
            <User size={18} style={styles.inputIcon} />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              style={{
                ...styles.input,
                ...(localErrors.username ? styles.inputError : {})
              }}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          {localErrors.username && (
            <span style={styles.errorText}>{localErrors.username}</span>
          )}
        </div>

        {/* Email Field */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email Address
          </label>
          <div style={styles.inputWrapper}>
            <Mail size={18} style={styles.inputIcon} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                ...styles.input,
                ...(localErrors.email ? styles.inputError : {})
              }}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          {localErrors.email && (
            <span style={styles.errorText}>{localErrors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <div style={styles.inputWrapper}>
            <Lock size={18} style={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={{
                ...styles.input,
                ...(localErrors.password ? styles.inputError : {})
              }}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              style={styles.passwordToggle}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {localErrors.password && (
            <span style={styles.errorText}>{localErrors.password}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div style={styles.formGroup}>
          <label htmlFor="password_confirm" style={styles.label}>
            Confirm Password
          </label>
          <div style={styles.inputWrapper}>
            <Lock size={18} style={styles.inputIcon} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="Confirm your password"
              style={{
                ...styles.input,
                ...(localErrors.password_confirm ? styles.inputError : {})
              }}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              style={styles.passwordToggle}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {localErrors.password_confirm && (
            <span style={styles.errorText}>{localErrors.password_confirm}</span>
          )}
        </div>

        {/* Auth Context Error */}
        {error && (
          <div style={styles.authError}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            ...styles.submitButton,
            ...(isLoading ? styles.submitButtonDisabled : {})
          }}
        >
          {isLoading ? (
            <span style={styles.loadingText}>
              <span style={styles.spinner}></span>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Terms */}
        <p style={styles.terms}>
          By creating an account, you agree to our{' '}
          <button type="button" style={styles.linkButton}>
            Terms of Service
          </button>{' '}
          and{' '}
          <button type="button" style={styles.linkButton}>
            Privacy Policy
          </button>
        </p>
      </form>
    </div>
  );
};

// Comprehensive styles
const styles: Record<string, CSSProperties> = {
  container: {
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  nameRow: {
    display: 'flex',
    gap: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#9ca3af',
    zIndex: 1,
    pointerEvents: 'none',
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '4px',
  },
  authError: {
    padding: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#dc2626',
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff40',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  terms: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center',
    margin: '16px 0 0 0',
    lineHeight: '1.5',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
};

export default RegisterForm;