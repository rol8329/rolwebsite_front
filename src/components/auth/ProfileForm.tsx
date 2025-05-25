// src/components/auth/ProfileForm.tsx
import React, { useState, useEffect, CSSProperties } from 'react';
import { User, Mail, Save } from 'lucide-react';
import type { UpdateProfileData } from '../../types/auth-types';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess, onError }) => {
  const { user, updateProfile, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileData>({
    username: '',
    first_name: '',
    last_name: '',
  });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  // Clear auth context error when component mounts
  useEffect(() => {
    if (error) clearError();
  }, []);

  // Check if form has changes
  useEffect(() => {
    if (user) {
      const changed = 
        formData.username !== user.username ||
        formData.first_name !== user.first_name ||
        formData.last_name !== user.last_name;
      setHasChanges(changed);
    }
  }, [formData, user]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Username validation
    if (!formData.username?.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // First name validation
    if (!formData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }

    // Last name validation
    if (!formData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
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
    
    // Clear auth context error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      onError?.('No changes to save');
      return;
    }

    try {
      await updateProfile(formData);
      // If we get here, update was successful
      onSuccess?.();
    } catch (updateError: unknown) {
      // Handle the error
      let errorMessage = 'Profile update failed. Please try again.';
      
      if (updateError instanceof Error) {
        errorMessage = updateError.message;
      } else if (typeof updateError === 'string') {
        errorMessage = updateError;
      }
      
      onError?.(errorMessage);
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
      setLocalErrors({});
      if (error) clearError();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Edit Profile</h2>
        <p style={styles.subtitle}>Update your personal information</p>
      </div>

      {/* Current User Info Display */}
      <div style={styles.currentInfo}>
        <div style={styles.userCard}>
          <div style={styles.userAvatar}>
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div style={styles.userDetails}>
            <p style={styles.userName}>
              {user?.first_name} {user?.last_name}
            </p>
            <p style={styles.userEmail}>{user?.email}</p>
            <p style={styles.userRole}>Role: {user?.role}</p>
          </div>
        </div>
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
                value={formData.first_name || ''}
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
                value={formData.last_name || ''}
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
              value={formData.username || ''}
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

        {/* Email Field (Read-only) */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email Address
          </label>
          <div style={styles.inputWrapper}>
            <Mail size={18} style={styles.inputIcon} />
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              placeholder="Email address"
              style={styles.inputReadonly}
              disabled={true}
              readOnly
            />
          </div>
          <p style={styles.helperText}>
            Email cannot be changed. Contact support if you need to update your email.
          </p>
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
            disabled={isLoading || !hasChanges}
            style={{
              ...styles.resetButton,
              ...(isLoading || !hasChanges ? styles.buttonDisabled : {})
            }}
          >
            Reset Changes
          </button>

          <button 
            type="submit" 
            disabled={isLoading || !hasChanges}
            style={{
              ...styles.submitButton,
              ...(isLoading || !hasChanges ? styles.submitButtonDisabled : {})
            }}
          >
            {isLoading ? (
              <span style={styles.loadingText}>
                <span style={styles.spinner}></span>
                Updating...
              </span>
            ) : (
              <span style={styles.buttonContent}>
                <Save size={16} />
                Save Changes
              </span>
            )}
          </button>
        </div>

        {!hasChanges && !isLoading && (
          <p style={styles.noChangesText}>
            Make changes to your profile information to enable saving.
          </p>
        )}
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
  currentInfo: {
    marginBottom: '24px',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  userEmail: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 4px 0',
  },
  userRole: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
    textTransform: 'capitalize',
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
  inputReadonly: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box',
    cursor: 'not-allowed',
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
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '4px',
  },
  helperText: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
    fontStyle: 'italic',
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
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  noChangesText: {
    fontSize: '12px',
    color: '#9ca3af',
    textAlign: 'center',
    margin: '8px 0 0 0',
    fontStyle: 'italic',
  },
};

export default ProfileForm;