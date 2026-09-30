const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

export const validateRegister = (data = {}) => {
  const errors = {};
  const { name, email, phone, password, confirmPassword } = data;

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters long.';
  }

  // Email validation
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  // Phone validation (optional, but validated if provided)
  if (phone && typeof phone === 'string' && phone.trim() !== '') {
    const cleanPhone = phone.replace(/[\s\-]/g, '');
    if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number.';
    }
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  // Confirm password validation
  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (data = {}) => {
  const errors = {};
  const { email, password } = data;

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPassword = (data = {}) => {
  const errors = {};
  const { email } = data;

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateResetPassword = (data = {}) => {
  const errors = {};
  const { password, confirmPassword } = data;

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProfileUpdate = (data = {}) => {
  const errors = {};
  const { name, phone } = data;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    errors.name = 'Full name must be at least 2 characters long.';
  }

  if (phone !== undefined && phone !== null && phone.trim() !== '') {
    const cleanPhone = phone.replace(/[\s\-]/g, '');
    if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
