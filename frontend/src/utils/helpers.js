/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    requested: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    accepted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    picked_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status display text
 */
export const getStatusText = (status) => {
  const texts = {
    requested: 'Requested',
    accepted: 'Accepted',
    picked_up: 'Picked Up',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
  };
  return texts[status] || status;
};

/**
 * Validate form fields
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\d{10}$/;
  return re.test(phone);
};
