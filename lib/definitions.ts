import { User } from "@/app/interface/user.interface";

export interface SignupFormData {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface FormState {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
  user?: User;
}

export function validateSignupForm(data: SignupFormData): FormState {
  const errors: FormState['errors'] = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = ['Name must be at least 2 characters long.'];
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = ['Please enter a valid email.'];
  }

  const passwordErrors: string[] = [];
  const password = data.password ? data.password.trim() : '';

  if (password.length < 8) {
    passwordErrors.push('Be at least 8 characters long');
  }
  if (!/[a-zA-Z]/.test(password)) {
    passwordErrors.push('Contain at least one letter.');
  }
  if (!/[0-9]/.test(password)) {
    passwordErrors.push('Contain at least one number.');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    passwordErrors.push('Contain at least one special character.');
  }

  if (passwordErrors.length > 0) {
    errors.password = passwordErrors;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {};
}