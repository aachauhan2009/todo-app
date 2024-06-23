import { screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Login from './index';
import { renderWithClient } from '../../test-util';
import CreateTodo from './index';

jest.mock('axios');
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));


describe('Create ToDo Component', () => {
    test('renders create todo form', () => {
        renderWithClient(<CreateTodo />);

        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        expect(screen.getByText('Create Todo')).toBeInTheDocument();
    });

    test('submits login form successfully', async () => {
        const mockResponse = { data: { id: 1 } };
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        renderWithClient(<CreateTodo />);

        fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'test title 1' } });
        fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'test description 1' } });

        fireEvent.click(screen.getByText('Create Todo'));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/todo', { title: 'test title 1', description: 'test description 1' }));
        await waitFor(() => expect(screen.getByText('Create Todo')).toBeInTheDocument()); // to ensure the component re-renders after login
    });

    test('shows error message on login failure', async () => {
        const mockError = {
            response: {
                data: 'Create Todo failed',
            },
        };
        (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

        renderWithClient(<CreateTodo />);

        fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'test title 2' } });
        fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'test description 2' } });

        fireEvent.click(screen.getByText('Create Todo'));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/todo', { title: 'test title 2', description: 'test description 2' }));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error creating todo'));
    });

    test('displays validation errors', async () => {
        renderWithClient(<CreateTodo />);

        fireEvent.click(screen.getByText('Create Todo'));

        await waitFor(() => {
            expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
        });
    });
});
