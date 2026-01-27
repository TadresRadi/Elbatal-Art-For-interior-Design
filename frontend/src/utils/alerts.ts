import Swal from 'sweetalert2';

// Type definitions for SweetAlert2
interface SweetAlertOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  background?: string;
  customClass?: {
    popup?: string;
    title?: string;
    content?: string;
    confirmButton?: string;
    cancelButton?: string;
  };
  buttonsStyling?: boolean;
  showClass?: {
    popup?: string;
    backdrop?: string;
    icon?: string;
  };
  hideClass?: {
    popup?: string;
    backdrop?: string;
    icon?: string;
  };
  timer?: number;
  timerProgressBar?: boolean;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
  didOpen?: (popup: any) => void;
  didClose?: () => void;
  willClose?: () => void;
  toast?: boolean;
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  reverseButtons?: boolean;
}

interface SweetAlertResult {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: any;
}

/**
 * Alert utility functions using SweetAlert2
 * Provides beautiful, customizable alerts for the application
 */

// Default configuration for all alerts
const defaultConfig: SweetAlertOptions = {
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '#D4AF37',
  cancelButtonColor: '#6B7280',
  background: '#ffffff',
  customClass: {
    popup: 'luxury-alert-popup',
    title: 'luxury-alert-title',
    content: 'luxury-alert-content',
    confirmButton: 'luxury-alert-confirm-button',
    cancelButton: 'luxury-alert-cancel-button',
  },
  buttonsStyling: true,
  showClass: {
    popup: 'swal2-show',
    backdrop: 'swal2-backdrop-show',
    icon: 'swal2-icon-show',
  },
  hideClass: {
    popup: 'swal2-hide',
    backdrop: 'swal2-backdrop-hide',
    icon: 'swal2-icon-hide',
  },
};

/**
 * Success alert with custom styling
 */
export const showSuccessAlert = (
  title: string,
  text?: string,
  options?: Partial<SweetAlertOptions>
): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    ...options,
  });
};

/**
 * Error alert with custom styling
 */
export const showErrorAlert = (
  title: string,
  text?: string,
  options?: Partial<SweetAlertOptions>
): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    text,
    ...options,
  });
};

/**
 * Warning alert with custom styling
 */
export const showWarningAlert = (
  title: string,
  text?: string,
  options?: Partial<SweetAlertOptions>
): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text,
    ...options,
  });
};

/**
 * Info alert with custom styling
 */
export const showInfoAlert = (
  title: string,
  text?: string,
  options?: Partial<SweetAlertOptions>
): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    text,
    ...options,
  });
};

/**
 * Confirmation dialog with custom styling
 */
export const showConfirmDialog = (
  title: string,
  text?: string,
  options?: Partial<SweetAlertOptions>
): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#D4AF37',
    cancelButtonColor: '#EF4444',
    reverseButtons: true,
    ...options,
  });
};

/**
 * Loading alert with custom styling
 */
export const showLoadingAlert = (
  title: string,
  text?: string,
  options?: Partial<SweetAlertOptions>
): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...defaultConfig,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    ...options,
  });
};

/**
 * Toast notification (small, non-blocking)
 */
export const showToast = (
  title: string,
  icon: 'success' | 'error' | 'warning' | 'info' = 'success',
  position: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end' = 'top-end',
  options?: Partial<SweetAlertOptions>
): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...defaultConfig,
    title,
    icon,
    toast: true,
    position,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    ...options,
  });
};

/**
 * Specialized alerts for common operations
 */

// Expense related alerts
export const showExpenseSuccessAlert = (action: 'created' | 'updated' | 'deleted'): Promise<SweetAlertResult> => {
  const messages = {
    created: { title: 'Expense Added Successfully', text: 'The expense has been added to the system.' },
    updated: { title: 'Expense Updated Successfully', text: 'The expense has been updated.' },
    deleted: { title: 'Expense Deleted Successfully', text: 'The expense has been removed from the system.' },
  };
  
  return showSuccessAlert(messages[action].title, messages[action].text);
};

export const showExpenseErrorAlert = (action: 'create' | 'update' | 'delete', error?: string): Promise<SweetAlertResult> => {
  const messages = {
    create: { title: 'Failed to Add Expense', text: 'There was an error adding the expense.' },
    update: { title: 'Failed to Update Expense', text: 'There was an error updating the expense.' },
    delete: { title: 'Failed to Delete Expense', text: 'There was an error deleting the expense.' },
  };
  
  return showErrorAlert(messages[action].title, error || messages[action].text);
};

// Payment related alerts
export const showPaymentSuccessAlert = (action: 'created' | 'updated' | 'deleted'): Promise<SweetAlertResult> => {
  const messages = {
    created: { title: 'Payment Added Successfully', text: 'The payment has been recorded.' },
    updated: { title: 'Payment Updated Successfully', text: 'The payment has been updated.' },
    deleted: { title: 'Payment Deleted Successfully', text: 'The payment has been removed.' },
  };
  
  return showSuccessAlert(messages[action].title, messages[action].text);
};

export const showPaymentErrorAlert = (action: 'create' | 'update' | 'delete', error?: string): Promise<SweetAlertResult> => {
  const messages = {
    create: { title: 'Failed to Add Payment', text: 'There was an error recording the payment.' },
    update: { title: 'Failed to Update Payment', text: 'There was an error updating the payment.' },
    delete: { title: 'Failed to Delete Payment', text: 'There was an error deleting the payment.' },
  };
  
  return showErrorAlert(messages[action].title, error || messages[action].text);
};

// Client related alerts
export const showClientSuccessAlert = (action: 'created' | 'updated' | 'deleted' | 'completed' | 'retrieved'): Promise<SweetAlertResult> => {
  const messages = {
    created: { title: 'Client Created Successfully', text: 'The new client has been added to the system.' },
    updated: { title: 'Client Updated Successfully', text: 'The client information has been updated.' },
    deleted: { title: 'Client Deleted Successfully', text: 'The client has been removed from the system.' },
    completed: { title: 'Client Completed Successfully', text: 'The client project has been marked as completed.' },
    retrieved: { title: 'Client Retrieved Successfully', text: 'The client has been retrieved from completed status.' },
  };
  
  return showSuccessAlert(messages[action].title, messages[action].text);
};

export const showClientErrorAlert = (action: 'create' | 'update' | 'delete' | 'complete' | 'retrieve', error?: string): Promise<SweetAlertResult> => {
  const messages = {
    create: { title: 'Failed to Create Client', text: 'There was an error creating the client.' },
    update: { title: 'Failed to Update Client', text: 'There was an error updating the client.' },
    delete: { title: 'Failed to Delete Client', text: 'There was an error deleting the client.' },
    complete: { title: 'Failed to Complete Client', text: 'There was an error completing the client.' },
    retrieve: { title: 'Failed to Retrieve Client', text: 'There was an error retrieving the client.' },
  };
  
  return showErrorAlert(messages[action].title, error || messages[action].text);
};

// Work item related alerts
export const showWorkItemSuccessAlert = (action: 'created' | 'updated' | 'deleted'): Promise<SweetAlertResult> => {
  const messages = {
    created: { title: 'Work Item Added Successfully', text: 'The work item has been added to the project.' },
    updated: { title: 'Work Item Updated Successfully', text: 'The work item has been updated.' },
    deleted: { title: 'Work Item Deleted Successfully', text: 'The work item has been removed.' },
  };
  
  return showSuccessAlert(messages[action].title, messages[action].text);
};

export const showWorkItemErrorAlert = (action: 'create' | 'update' | 'delete', error?: string): Promise<SweetAlertResult> => {
  const messages = {
    create: { title: 'Failed to Add Work Item', text: 'There was an error adding the work item.' },
    update: { title: 'Failed to Update Work Item', text: 'There was an error updating the work item.' },
    delete: { title: 'Failed to Delete Work Item', text: 'There was an error deleting the work item.' },
  };
  
  return showErrorAlert(messages[action].title, error || messages[action].text);
};

// Discussion related alerts
export const showDiscussionSuccessAlert = (type: 'expenses' | 'payments'): Promise<SweetAlertResult> => {
  const messages = {
    expenses: { title: 'Expenses Discussion Completed', text: 'The expenses discussion has been completed with the client.' },
    payments: { title: 'Payments Discussion Completed', text: 'The payments discussion has been completed with the client.' },
  };
  
  return showSuccessAlert(messages[type].title, messages[type].text);
};

export const showDiscussionErrorAlert = (type: 'expenses' | 'payments', error?: string): Promise<SweetAlertResult> => {
  const messages = {
    expenses: { title: 'Failed to Complete Discussion', text: 'There was an error completing the expenses discussion.' },
    payments: { title: 'Failed to Complete Discussion', text: 'There was an error completing the payments discussion.' },
  };
  
  return showErrorAlert(messages[type].title, error || messages[type].text);
};

// Validation alerts
export const showValidationErrorAlert = (field: string): Promise<SweetAlertResult> => {
  return showWarningAlert('Validation Error', `Please provide a valid ${field}.`);
};

// Confirmation dialogs
export const showDeleteConfirmationDialog = (itemType: string, itemName?: string): Promise<SweetAlertResult> => {
  const title = `Delete ${itemType}?`;
  const text = itemName 
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;
  
  return showConfirmDialog(title, text);
};

export const showCompleteConfirmationDialog = (itemType: string): Promise<SweetAlertResult> => {
  const title = `Complete ${itemType}?`;
  const text = `Are you sure you want to mark this ${itemType} as completed?`;
  
  return showConfirmDialog(title, text);
};

// Progress alerts
export const showProgressSuccessAlert = (): Promise<SweetAlertResult> => {
  return showSuccessAlert('Progress Updated', 'The project progress has been updated successfully.');
};

export const showProgressErrorAlert = (error?: string): Promise<SweetAlertResult> => {
  return showErrorAlert('Failed to Update Progress', error || 'There was an error updating the progress.');
};

// Message alerts
export const showMessageSuccessAlert = (): Promise<SweetAlertResult> => {
  return showToast('Message sent successfully', 'success');
};

export const showMessageErrorAlert = (error?: string): Promise<SweetAlertResult> => {
  return showToast('Failed to send message', 'error');
};

// File upload alerts
export const showFileUploadSuccessAlert = (): Promise<SweetAlertResult> => {
  return showToast('File uploaded successfully', 'success');
};

export const showFileUploadErrorAlert = (error?: string): Promise<SweetAlertResult> => {
  return showToast('Failed to upload file', 'error');
};

// Form validation alerts
export const showFormValidationErrorAlert = (missingFields: string[]): Promise<SweetAlertResult> => {
  const fieldsText = missingFields.join(', ');
  return showWarningAlert('Missing Required Fields', `Please fill in the following fields: ${fieldsText}`);
};

export const showRequiredFieldAlert = (fieldName: string): Promise<SweetAlertResult> => {
  return showWarningAlert('Required Field Missing', `The "${fieldName}" field is required.`);
};

// Network error alerts
export const showNetworkErrorAlert = (): Promise<SweetAlertResult> => {
  return showErrorAlert('Network Error', 'Please check your internet connection and try again.');
};

// Session expired alert
export const showSessionExpiredAlert = (): Promise<SweetAlertResult> => {
  return showWarningAlert('Session Expired', 'Your session has expired. Please log in again.', {
    didClose: () => {
      window.location.hash = '#login';
    },
  });
};

// Export SweetAlert for direct usage if needed
export { Swal };
