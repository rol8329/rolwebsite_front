// src/components/auth/ChangePasswordForm.tsx
import React, { useState, useEffect, CSSProperties } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import type { ChangePasswordData } from '../../types/auth-types';
import { useAuth } from '@/contexts/AuthContext';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess, onError }) => {
  const { changePassword, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<ChangePasswordData>({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
    color: string;
  }>({
    score: 0,
    message: '',
    color: '#e5e7eb',
  });

  // Clear auth context error when component mounts
  useEffect(() => {
    if (error) clearError();
  }, []);

  // Check password strength
  useEffect(() => {
    if (formData.new_password) {
      const strength = calculatePasswordStrength(formData.new_password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, message: '', color: '#e5e7eb' });
    }
  }, [formData.new_password]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let message = '';
    let color = '#ef4444';

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        message = 'Very Weak';
        color = '#ef4444';
        break;
      case 2:
        message = 'Weak';
        color = '#f97316';
        break;
      case 3:
        message = 'Fair';
        color = '#eab308';
        break;
      case 4:
        message = 'Good';
        color = '#22c55e';
        break;
      case 5:
        message = 'Strong';
        color = '#16a34a';
        break;
    }

    return { score, message, color };
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Current password validation
    if (!formData.current_password.trim()) {
      errors.current_password = 'Current password is required';
    }

    // New password validation
    if (!formData.new_password.trim()) {
      errors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.new_password)) {
      errors.new_password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    } else if (formData.new_password === formData.current_password) {
      errors.new_password = 'New password must be different from current password';
    }

    // Password confirmation validation
    if (!formData.new_password_confirm.trim()) {
      errors.new_password_confirm = 'Please confirm your new password';
    } else if (formData.new_password !== formData.new_password_confirm) {
      errors.new_password_confirm = 'Passwords do not match';
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
    if (name === 'new_password' && formData.new_password_confirm && value === formData.new_password_confirm) {
      setLocalErrors(prev => ({ ...prev, new_password_confirm: '' }));
    }
    if (name === 'new_password_confirm' && value === formData.new_password) {
      setLocalErrors(prev => ({ ...prev, new_password_confirm: '' }));
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
      await changePassword(formData);
      // If we get here, password change was successful
      onSuccess?.();
    } catch (changeError: unknown) {
      // Handle the error
      let errorMessage = 'Password change failed. Please try again.';
      
      if (changeError instanceof Error) {
        errorMessage = changeError.message;
      } else if (typeof changeError === 'string') {
        errorMessage = changeError;
      }
      
      onError?.(errorMessage);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleReset = () => {
    setFormData({
      current_password: '',
      new_password: '',
      new_password_confirm: '',
    });
    setLocalErrors({});
    if (error) clearError();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Change Password</h2>
        <p style={styles.subtitle}>Update your account password for better security</p>
      </div>

      {/* Security Tips */}
      <div style={styles.securityTips}>
        <div style={styles.tipHeader}>
          <Shield size={16} style={styles.tipIcon} />
          <span style={styles.tipTitle}>Password Requirements</span>
        </div>
        <ul style={styles.tipList}>
          <li style={styles.tipItem}>At least 8 characters long</li>
          <li style={styles.tipItem}>Include uppercase and lowercase letters</li>
          <li style={styles.tipItem}>Include at least one number</li>
          <li style={styles.tipItem}>Consider adding special characters</li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Current Password Field */}
        <div style={styles.formGroup}>
          <label htmlFor="current_password" style={styles.label}>
            Current Password
          </label>
          <div style={styles.inputWrapper}>
            <Lock size={18} style={styles.inputIcon} />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              placeholder="Enter your current password"
              style={{
                ...styles.input,
                ...(localErrors.current_password ? styles.inputError : {})
              }}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              style={styles.passwordToggle}
              disabled={isLoading}
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {localErrors.current_password && (
            <span style={styles.errorText}>{localErrors.current_password}</span>
          )}
        </div>

        {/* New Password Field */}
        <div style={styles.formGroup}>
          <label htmlFor="new_password" style={styles.label}>
            New Password
          </label>
          <div style={styles.inputWrapper}>
            <Lock size={18} style={styles.inputIcon} />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="Enter your new password"
              style={{
                ...styles.input,
                ...(localErrors.new_password ? styles.inputError : {})
              }}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              style={styles.passwordToggle}
              disabled={isLoading}
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.new_password && (
            <div style={styles.strengthContainer}>
              <div style={styles.strengthBar}>
                <div 
                  style={{
                    ...styles.strengthFill,
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                />
              </div>
              <span style={{
                ...styles.strengthText,
                color: passwordStrength.color,
              }}>
                {passwordStrength.message}
              </span>
            </div>
          )}
          
          {localErrors.new_password && (
            <span style={styles.errorText}>{localErrors.new_password}</span>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div style={styles.formGroup}>
          <label htmlFor="new_password_confirm" style={styles.label}>
            Confirm New Password
          </label>
          <div style={styles.inputWrapper}>
            <Lock size={18} style={styles.inputIcon} />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="new_password_confirm"
              name="new_password_confirm"
              value={formData.new_password_confirm}
              onChange={handleChange}
              placeholder="Confirm your new password"
              style={{
                ...styles.input,
                ...(localErrors.new_password_confirm ? styles.inputError : {})
              }}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              style={styles.passwordToggle}
              disabled={isLoading}
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {localErrors.new_password_confirm && (
            <span style={styles.errorText}>{localErrors.new_password_confirm}</span>
          )}
        </div>

        {/* Auth Context Error */}
        {error && (
          <div style={styles.authError}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button 
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            style={{
              ...styles.resetButton,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
          >
            Clear Form
          </button>

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
                Changing Password...
              </span>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
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
    marginBottom: '24px',
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
  securityTips: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #e0f2fe',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  tipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  tipIcon: {
    color: '#0ea5e9',
  },
  tipTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0c4a6e',
  },
  tipList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '12px',
    color: '#0369a1',
  },
  tipItem: {
    marginBottom: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
    padding: '12px 44px 12px 44px',
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
  strengthContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  strengthBar: {
    flex: 1,
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    transition: 'all 0.3s ease',
    borderRadius: '2px',
  },
  strengthText: {
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '80px',
    textAlign: 'right',
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
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  resetButton: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    flex: 2,
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
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  buttonDisabled: {
    opacity: 0.5,
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
};

export default ChangePasswordForm;