import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/login-form';
import { UserContext } from '@/components/providers/user-provider';
import { useRouter } from 'next/navigation';

const mockSetUser = jest.fn();
const MockUserProvider = ({ children }: { children: React.ReactNode }) => (
  <UserContext.Provider value={{ user: null, setUser: mockSetUser }}>
    {children}
  </UserContext.Provider>
);

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

const mockLogin = jest.fn();
jest.mock('@/app/actions/auth', () => ({
  login: (...args: any[]) => mockLogin(...args),
  USER_KEY: 'user',
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), replace: jest.fn() });
  });

  it('renders the login form', () => {
    render(
      <MockUserProvider>
        <LoginForm />
      </MockUserProvider>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('calls the login action with form data on submit', async () => {
    const receivedArgs: any[] = [];
    mockLogin.mockImplementation((...args) => {
      receivedArgs.push(args);
      return {};
    });

    render(
      <MockUserProvider>
        <LoginForm />
      </MockUserProvider>
    );
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(receivedArgs.length).toBeGreaterThan(0);
      const formData = receivedArgs[0][1] as FormData;
      expect(formData.get('email')).toBe('test@example.com');
      expect(formData.get('password')).toBe('password123');
    });
  });

  it('updates UserContext and redirects on successful login', async () => {
    mockLogin.mockResolvedValue({ user: { id: 1, email: 'test@example.com', name: 'Test User', role: 'user' }, message: 'Success!' });
    const routerMock = { push: jest.fn(), replace: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(routerMock);

    render(
      <MockUserProvider>
        <LoginForm />
      </MockUserProvider>
    );
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({ id: 1, email: 'test@example.com', name: 'Test User', role: 'user' });
      expect(routerMock.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error message on failed login', async () => {
    mockLogin.mockResolvedValue({ message: 'Invalid credentials' });
    render(
      <MockUserProvider>
        <LoginForm />
      </MockUserProvider>
    );
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(useRouter().push).not.toHaveBeenCalled();
    });
  });
});