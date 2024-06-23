import { screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from './index';
import { fetchTodos, updateTodoStatus, deleteTodo } from './api';
import { renderWithClient } from '../../test-util';
import { Status } from '../../constants';

jest.mock('./api');

describe('TodoList Page', () => {
    const todos = [
        { id: 1, title: 'Test Todo 1', description: 'Description 1', status: Status.NEW },
        { id: 2, title: 'Test Todo 2', description: 'Description 2', status: Status.PROGRESS },
    ];

    beforeEach(() => {
        (fetchTodos as jest.Mock).mockResolvedValue(todos);
        (updateTodoStatus as jest.Mock).mockResolvedValue({});
        (deleteTodo as jest.Mock).mockResolvedValue({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders todo list and allows updating and deleting todos', async () => {
        renderWithClient(<TodoList />);
        await waitFor(() => expect(screen.getByText('Test Todo 1')).toBeInTheDocument());
        expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
        fireEvent.click(screen.getAllByText('Complete')[0]);
        await waitFor(() => expect(updateTodoStatus).toHaveBeenCalled());
        fireEvent.click(screen.getAllByText('Delete')[0]);
        await waitFor(() => expect(deleteTodo).toHaveBeenCalled());
    });

    test('searches todos based on input', async () => {
        renderWithClient(<TodoList />);
        await waitFor(() => expect(screen.getByText('Test Todo 1')).toBeInTheDocument());
        (fetchTodos as jest.Mock).mockResolvedValue(todos.filter(todo => todo.title.includes('Test Todo 2')));
        fireEvent.change(screen.getByPlaceholderText('Search Todo'), { target: { value: 'Test Todo 2' } });
        await waitFor(() => expect(screen.queryByText('Test Todo 1')).not.toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Test Todo 2')).toBeInTheDocument());
    });

    test('displays error message on API failure', async () => {
        (fetchTodos as jest.Mock).mockRejectedValue(new Error('Failed to fetch todos'));
        renderWithClient(<TodoList />);
        await waitFor(() => expect(screen.queryByText('No Todo found')).toBeInTheDocument());
    });
});
