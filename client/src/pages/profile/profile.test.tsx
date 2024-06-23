
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './index';
import '@testing-library/jest-dom'
import { renderWithClient } from '../../test-util';
import * as api from './api';


jest.mock('./api', () => ({
    getUserProfile: jest.fn().mockResolvedValue({
        data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'avatar1',
        },
    }),
    updateUserProfile: jest.fn().mockResolvedValue({}),
}));

describe('Profile Component', () => {
    test('renders profile information', async () => {
        renderWithClient(<Profile />);
        await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });

    test('allows editing of email and avatar', async () => {
        (api.getUserProfile as jest.Mock).mockResolvedValue({
            data: {
                name: 'John Doe',
                email: 'new.email@example.com',
                avatar: 'avatar1',
            },
        })
        renderWithClient(<Profile />);
        await waitFor(() => expect(screen.getByText('Edit Profile')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Edit Profile'));

        const emailInput = screen.getByPlaceholderText('Email');
        fireEvent.change(emailInput, { target: { value: 'new.email@example.com' } });

        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => expect(screen.getByText(/new.email@example.com/i)).toBeInTheDocument());
    });
});
