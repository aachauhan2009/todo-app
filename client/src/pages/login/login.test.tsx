import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Login from './index';
import { renderWithClient } from '../../test-util';

jest.mock('axios');
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));


describe('Login Component', () => {
    test('renders login form', () => {
        renderWithClient(<Login />);

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    test('submits login form successfully', async () => {
        const mockResponse = { data: 'Success' };
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        renderWithClient(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/auth/login', { name: 'testuser', password: 'password123' }));
        await waitFor(() => expect(screen.getByText('Login')).toBeInTheDocument()); // to ensure the component re-renders after login
    });

    test('shows error message on login failure', async () => {
        const mockError = {
            response: {
                data: 'Login Failed',
            },
        };
        (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

        renderWithClient(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/auth/login', { name: 'testuser', password: 'wrongpassword' }));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Login Failed'));
    });

    test('displays validation errors', async () => {
        renderWithClient(<Login />);

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
        });
    });
});
