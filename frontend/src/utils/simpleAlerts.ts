/**
 * Simple alert utility functions with better styling
 * Provides beautiful, customizable alerts for the application
 * This is a fallback solution until SweetAlert2 import issues are resolved
 */

// Alert types
type AlertType = 'success' | 'error' | 'warning' | 'info';

// Alert configuration
interface AlertConfig {
  title: string;
  message?: string;
  type: AlertType;
  showCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  timer?: number;
}

// Custom alert dialog with styling
const createStyledAlert = (config: AlertConfig): Promise<{ isConfirmed: boolean }> => {
  return new Promise((resolve) => {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.custom-alert-overlay');
    if (existingAlert) {
      existingAlert.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
    overlay.style.backdropFilter = 'blur(4px)';

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700';
    
    // Determine icon and colors based on type
    const typeConfig = {
      success: {
        icon: '✓',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-400',
        iconBg: 'bg-green-500',
        borderColor: 'border-green-200 dark:border-green-800'
      },
      error: {
        icon: '✕',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-400',
        iconBg: 'bg-red-500',
        borderColor: 'border-red-200 dark:border-red-800'
      },
      warning: {
        icon: '!',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        iconBg: 'bg-yellow-500',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      },
      info: {
        icon: 'i',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-400',
        iconBg: 'bg-blue-500',
        borderColor: 'border-blue-200 dark:border-blue-800'
      }
    };

    const currentType = typeConfig[config.type];

    // Modal content
    modal.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="${currentType.iconBg} text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-xl font-bold">
          ${currentType.icon}
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ${config.title}
          </h3>
          ${config.message ? `<p class="text-gray-600 dark:text-gray-400">${config.message}</p>` : ''}
        </div>
      </div>
      <div class="flex gap-3 mt-6 justify-end">
        ${config.showCancelButton ? `
          <button class="custom-alert-cancel px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            ${config.cancelText || 'Cancel'}
          </button>
        ` : ''}
        <button class="custom-alert-confirm px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#B8941F] text-white transition-colors font-medium">
          ${config.confirmText || 'OK'}
        </button>
      </div>
    `;

    // Add border based on type
    modal.classList.add(...currentType.borderColor.split(' '));

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add animation
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);

    // Handle clicks
    const handleConfirm = () => {
      cleanup();
      resolve({ isConfirmed: true });
    };

    const handleCancel = () => {
      cleanup();
      resolve({ isConfirmed: false });
    };

    const cleanup = () => {
      overlay.classList.remove('show');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    };

    // Add event listeners
    modal.querySelector('.custom-alert-confirm')?.addEventListener('click', handleConfirm);
    modal.querySelector('.custom-alert-cancel')?.addEventListener('click', handleCancel);

    // Auto-close if timer is set
    if (config.timer) {
      setTimeout(() => {
        cleanup();
        resolve({ isConfirmed: true });
      }, config.timer);
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cleanup();
        resolve({ isConfirmed: false });
      }
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      .custom-alert-overlay {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .custom-alert-overlay.show {
        opacity: 1;
      }
      .custom-alert-modal {
        transform: scale(0.9) translateY(-20px);
        transition: transform 0.3s ease;
      }
      .custom-alert-overlay.show .custom-alert-modal {
        transform: scale(1) translateY(0);
      }
    `;
    document.head.appendChild(style);
  });
};

// Success alert
export const showSuccessAlert = (title: string, message?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title,
    message,
    type: 'success',
    timer: 3000
  });
};

// Error alert
export const showErrorAlert = (title: string, message?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title,
    message,
    type: 'error'
  });
};

// Warning alert
export const showWarningAlert = (title: string, message?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title,
    message,
    type: 'warning'
  });
};

// Info alert
export const showInfoAlert = (title: string, message?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title,
    message,
    type: 'info'
  });
};

// Confirmation dialog
export const showConfirmDialog = (title: string, message?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title,
    message,
    type: 'warning',
    showCancelButton: true,
    confirmText: 'Yes',
    cancelText: 'No'
  });
};

// Delete confirmation dialog
export const showDeleteConfirmationDialog = (itemType: string, itemName?: string): Promise<{ isConfirmed: boolean }> => {
  const title = `Delete ${itemType}?`;
  const message = itemName 
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;
  
  return createStyledAlert({
    title,
    message,
    type: 'warning',
    showCancelButton: true,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  });
};

// Toast notification
export const showToast = (title: string, type: AlertType = 'success'): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title,
    type,
    timer: 3000
  });
};

// Specialized alerts for common operations

// Expense related alerts
export const showExpenseSuccessAlert = (action: 'created' | 'updated' | 'deleted'): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    created: { title: 'Expense Added Successfully', message: 'The expense has been added to the system.' },
    updated: { title: 'Expense Updated Successfully', message: 'The expense has been updated.' },
    deleted: { title: 'Expense Deleted Successfully', message: 'The expense has been removed from the system.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'success',
    timer: 3000
  });
};

export const showExpenseErrorAlert = (action: 'create' | 'update' | 'delete', error?: string): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    create: { title: 'Failed to Add Expense', message: 'There was an error adding the expense.' },
    update: { title: 'Failed to Update Expense', message: 'There was an error updating the expense.' },
    delete: { title: 'Failed to Delete Expense', message: 'There was an error deleting the expense.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'error',
    message: error || messages[action].message
  });
};

// Payment related alerts
export const showPaymentSuccessAlert = (action: 'created' | 'updated' | 'deleted'): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    created: { title: 'Payment Added Successfully', message: 'The payment has been recorded.' },
    updated: { title: 'Payment Updated Successfully', message: 'The payment has been updated.' },
    deleted: { title: 'Payment Deleted Successfully', message: 'The payment has been removed.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'success',
    timer: 3000
  });
};

export const showPaymentErrorAlert = (action: 'create' | 'update' | 'delete', error?: string): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    create: { title: 'Failed to Add Payment', message: 'There was an error recording the payment.' },
    update: { title: 'Failed to Update Payment', message: 'There was an error updating the payment.' },
    delete: { title: 'Failed to Delete Payment', message: 'There was an error deleting the payment.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'error',
    message: error || messages[action].message
  });
};

// Client related alerts
export const showClientSuccessAlert = (action: 'created' | 'updated' | 'deleted' | 'completed' | 'retrieved'): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    created: { title: 'Client Created Successfully', message: 'The new client has been added to the system.' },
    updated: { title: 'Client Updated Successfully', message: 'The client information has been updated.' },
    deleted: { title: 'Client Deleted Successfully', message: 'The client has been removed from the system.' },
    completed: { title: 'Client Completed Successfully', message: 'The client project has been marked as completed.' },
    retrieved: { title: 'Client Retrieved Successfully', message: 'The client has been retrieved from completed status.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'success',
    timer: 3000
  });
};

export const showClientErrorAlert = (action: 'create' | 'update' | 'delete' | 'complete' | 'retrieve', error?: string): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    create: { title: 'Failed to Create Client', message: 'There was an error creating the client.' },
    update: { title: 'Failed to Update Client', message: 'There was an error updating the client.' },
    delete: { title: 'Failed to Delete Client', message: 'There was an error deleting the client.' },
    complete: { title: 'Failed to Complete Client', message: 'There was an error completing the client.' },
    retrieve: { title: 'Failed to Retrieve Client', message: 'There was an error retrieving the client.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'error',
    message: error || messages[action].message
  });
};

// Work item related alerts
export const showWorkItemSuccessAlert = (action: 'created' | 'updated' | 'deleted'): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    created: { title: 'Work Item Added Successfully', message: 'The work item has been added to the project.' },
    updated: { title: 'Work Item Updated Successfully', message: 'The work item has been updated.' },
    deleted: { title: 'Work Item Deleted Successfully', message: 'The work item has been removed.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'success',
    timer: 3000
  });
};

export const showWorkItemErrorAlert = (action: 'create' | 'update' | 'delete', error?: string): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    create: { title: 'Failed to Add Work Item', message: 'There was an error adding the work item.' },
    update: { title: 'Failed to Update Work Item', message: 'There was an error updating the work item.' },
    delete: { title: 'Failed to Delete Work Item', message: 'There was an error deleting the work item.' },
  };
  
  return createStyledAlert({
    ...messages[action],
    type: 'error',
    message: error || messages[action].message
  });
};

// Discussion related alerts
export const showDiscussionSuccessAlert = (type: 'expenses' | 'payments'): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    expenses: { title: 'Expenses Discussion Completed', message: 'The expenses discussion has been completed with the client.' },
    payments: { title: 'Payments Discussion Completed', message: 'The payments discussion has been completed with the client.' },
  };
  
  return createStyledAlert({
    ...messages[type],
    type: 'success',
    timer: 3000
  });
};

export const showDiscussionErrorAlert = (type: 'expenses' | 'payments', error?: string): Promise<{ isConfirmed: boolean }> => {
  const messages = {
    expenses: { title: 'Failed to Complete Discussion', message: 'There was an error completing the expenses discussion.' },
    payments: { title: 'Failed to Complete Discussion', message: 'There was an error completing the payments discussion.' },
  };
  
  return createStyledAlert({
    ...messages[type],
    type: 'error',
    message: error || messages[type].message
  });
};

// Validation alerts
export const showValidationErrorAlert = (field: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Validation Error',
    message: `Please provide a valid ${field}.`,
    type: 'warning'
  });
};

// Form validation alerts
export const showFormValidationErrorAlert = (missingFields: string[]): Promise<{ isConfirmed: boolean }> => {
  const fieldsText = missingFields.join(', ');
  return createStyledAlert({
    title: 'Missing Required Fields',
    message: `Please fill in the following fields: ${fieldsText}`,
    type: 'warning'
  });
};

export const showRequiredFieldAlert = (fieldName: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Required Field Missing',
    message: `The "${fieldName}" field is required.`,
    type: 'warning'
  });
};

// Progress alerts
export const showProgressSuccessAlert = (): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Progress Updated',
    message: 'The project progress has been updated successfully.',
    type: 'success',
    timer: 2000
  });
};

export const showProgressErrorAlert = (error?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Failed to Update Progress',
    message: error || 'There was an error updating the progress.',
    type: 'error'
  });
};

// Message alerts
export const showMessageSuccessAlert = (): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Message sent successfully',
    type: 'success',
    timer: 2000
  });
};

export const showMessageErrorAlert = (error?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Failed to send message',
    message: error || 'There was an error sending the message.',
    type: 'error'
  });
};

// File upload alerts
export const showFileUploadSuccessAlert = (): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'File uploaded successfully',
    type: 'success',
    timer: 2000
  });
};

export const showFileUploadErrorAlert = (error?: string): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Failed to upload file',
    message: error || 'There was an error uploading the file.',
    type: 'error'
  });
};

// Network error alerts
export const showNetworkErrorAlert = (): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Network Error',
    message: 'Please check your internet connection and try again.',
    type: 'error'
  });
};

// Session expired alert
export const showSessionExpiredAlert = (): Promise<{ isConfirmed: boolean }> => {
  return createStyledAlert({
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    type: 'warning'
  }).then(() => {
    window.location.hash = '#login';
    return { isConfirmed: true };
  });
};
