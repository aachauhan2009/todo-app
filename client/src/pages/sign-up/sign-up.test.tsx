import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { renderWithClient } from '../../test-util';
import SignUp from './index';

jest.mock('axios');
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));

describe('sign up Component', () => {

    beforeEach(() => {

    })

    test('renders sign up form', () => {
        renderWithClient(<SignUp />);
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    test('submits sign up form successfully', async () => {
        const mockResponse = { data: 'Success' };
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        renderWithClient(<SignUp />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Sign Up'));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/auth/sign-up', { name: 'testuser', password: 'password123' }));
        await waitFor(() => expect(screen.getByText('Sign Up')).toBeInTheDocument());
    });

    test('shows error message on sign up failure', async () => {
        const mockError = {
            response: {
                data: 'User Already Exists',
            },
        };
        (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

        renderWithClient(<SignUp />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Sign Up'));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/auth/sign-up', { name: 'user', password: 'password123' }));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('User Already Exists'));
    });

    test('displays validation errors', async () => {
        renderWithClient(<SignUp />);

        fireEvent.click(screen.getByText('Sign Up'));

        await waitFor(() => {
            expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
            expect(screen.getByText(/Confirm password is required/i)).toBeInTheDocument();
        });
    });

    test('displays password mismatch validation errors', async () => {
        renderWithClient(<SignUp />);
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password1234' } });

        fireEvent.click(screen.getByText('Sign Up'));

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });
    });
});
