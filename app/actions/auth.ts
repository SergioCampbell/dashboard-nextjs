'use client';

import { SignupFormData, FormState, validateSignupForm } from '@/lib/definitions';
import { User } from '../interface/user.interface';
import userList from '../data/user-data.json';

const USERS_KEY = 'users';
export const USER_KEY = 'user';

function getUsersFromLocalStorage(): SignupFormData[] {
  const usersJson = localStorage.getItem(USERS_KEY);

  if (usersJson) {
    return JSON.parse(usersJson);
  } else {
    if (userList && userList.length > 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(userList));
      return userList.map(user => ({ ...user, password: 'defaultPassword' }));
    }
    return [];
  }
}

function saveUsersToLocalStorage(users: SignupFormData[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signup(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const signupData: Omit<SignupFormData, 'id' | 'role'> = {
    name: formData.get('name')?.toString() ?? '',
    email: formData.get('email')?.toString()?.toLowerCase() ?? '',
    password: formData.get('password')?.toString() ?? '',
  };

  const validationResult = validateSignupForm({
    ...signupData,
    id: 0,
    role: 'user',
  });

  if (validationResult.errors && Object.keys(validationResult.errors).length > 0) {
    return validationResult;
  }

  try {
    const users = await getUsersFromLocalStorage();

    const existingUser = users.find((user) => user.email === signupData.email);
    if (existingUser) {
      return {
        errors: { email: ['An account with this email already exists.'] },
        message: 'Signup failed.',
      };
    }

    const newUser = {
      id: users.length + 1,
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      role: 'user',
    };

    users.push(newUser);
    saveUsersToLocalStorage(users);

    console.log('User created and saved to localStorage:', newUser.email);

    window.location.replace('/auth/login');

    return { message: 'User created successfully! You can now log in.' };
  } catch (error) {
    console.error('Error during signup process:', error);
    return { message: `Failed to create user due to a client error: ${error}` };
  }
}

export async function login(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email')?.toString()?.toLowerCase() ?? '';

  if (!email) {
    return { message: 'Email is required.' };
  }

  const simulatedUser: User = {
    id: Date.now(),
    name: email.split('@')[0],
    email: email,
    role: 'User',
  };

  try {
    const storedUsers = localStorage.getItem(USER_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const existingUserIndex: number = users.findIndex((u: User) => u.email === email);

    if (existingUserIndex === -1) {
      users.push(simulatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(users));
    } else {
      users[existingUserIndex] = { ...users[existingUserIndex], ...simulatedUser };
      localStorage.setItem(USER_KEY, JSON.stringify(users));
    }

    console.log(`Login successful for email: ${email}`);

    return {
      message: `Welcome, ${simulatedUser.name}!`,
      user: simulatedUser,
    };
  } catch (error) {
    console.error('Error during login process (simulated):', error);
    return { message: `Failed to log in due to a client error: ${error}` };
  }
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  window.location.replace('/auth/login');
}