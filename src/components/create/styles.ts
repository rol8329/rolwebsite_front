
// Shared styles at the end (could be moved to a separate file)
export const styles = {
    container: {
      padding: '24px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      minHeight: '100px'
    },
    buttonGroup: {
      display: 'flex',
      flexWrap  : 'wrap' as const,
      gap: '12px',
      marginBottom: '24px'
    },
    activeButton: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#2563eb',
      color: 'white'
    },
    inactiveButton: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#e5e7eb',
      color: '#374151'
    },
    submitButton: {
      padding: '8px 24px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '24px'
    },
    disabledButton: {
      padding: '8px 24px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'not-allowed',
      fontSize: '16px',
      marginTop: '24px',
      opacity: 0.5
    },
    successMessage: {
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#dcfce7',
      color: '#166534',
      borderRadius: '4px'
    },
    errorMessage: {
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '4px'
    },
    previewImage: {
      maxWidth: '100%',
      height: 'auto',
      maxHeight: '240px',
      borderRadius: '4px'
    }
  };