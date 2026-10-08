export const validateRegisterForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[0-9]{10}$/.test(formData.phone)) {
    errors.phone = 'Phone number must be 10 digits';
  }
  
  if (!formData.village?.trim()) {
    errors.village = 'Village is required';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};