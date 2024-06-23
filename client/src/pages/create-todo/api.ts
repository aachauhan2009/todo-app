import axios from 'axios';

export const createTodo = async (data: { title: string; description: string }) => {
    return axios.post('/api/todo', data);
};
