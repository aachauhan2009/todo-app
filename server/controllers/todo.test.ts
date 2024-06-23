import app, { stopServer } from '../server'; // Assuming app is your Express app instance
import { prisma } from '../utils/prisma';
import { Status } from '../constants';

const session: any = require('supertest-session');

let appSession: any = null;
let authSession: any = null;

const getAppSession = () => {
    appSession = session(app);
};

const getAuthSession = async () => {
    const mockUserProfile = {
        id: 1,
        email: 'testuser@example.com',
        name: 'testuser',
        avatar: 'avatar-url',
        password: "$2b$10$PRbrojnRMeiwxa0vq1M/D.lTBNGShsK0OEFTSlmW5qPSBR3R3kmfa", // hash value of 123
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUserProfile);
    await appSession.post("/api/auth/login").send({ name: 'test', password: '123' })
    authSession = appSession;
};

describe('Todo Routes', () => {
    beforeEach(() => {
        getAppSession();
    });

    afterEach(async () => {
        await new Promise((resolve: any) => setTimeout(() => resolve(), 500));
    });

    afterAll(() => {
        stopServer();
    })

    describe('GET /api/todo', () => {
        it('should return a list of todos', async () => {
            await getAuthSession();
            const mockTodos = [
                { id: 1, title: 'Test Todo', description: 'Test Description', status: Status.NEW, userId: 1 },
            ];

            jest.spyOn(prisma.todo, 'findMany').mockResolvedValue(mockTodos);

            const response = await authSession
                .get('/api/todo/list')
                .expect(200);

            expect(response.body).toEqual(mockTodos);
        });

        it('should return 500 if something goes wrong', async () => {
            await getAuthSession();
            jest.spyOn(prisma.todo, 'findMany').mockRejectedValue(new Error('Something went wrong'));

            const response = await authSession
                .get('/api/todo/list')
                .expect(500);

            expect(response.text).toBe('Something went wrong');
        });
    });

    describe('POST /api/todo', () => {
        it('should create a new todo and return it', async () => {
            await getAuthSession();
            const newTodo = { title: 'New Todo', description: 'New Description', status: Status.NEW };
            const createdTodo = { id: 1, ...newTodo, userId: 1 };

            jest.spyOn(prisma.todo, 'create').mockResolvedValue(createdTodo);

            const response = await authSession
                .post('/api/todo')
                .send(newTodo)
                .expect(200);

            expect(response.body).toEqual(createdTodo);
        });

        it('should return 400 with validation errors for invalid input', async () => {
            await getAuthSession();
            const invalidTodo = { title: '', description: '', status: '' };

            const response = await authSession
                .post('/api/todo')
                .send(invalidTodo)
                .expect(400);

            expect(response.text).toEqual("Title is required 🔥 Description is required 🔥 Invalid enum value. Expected 'NEW' | 'PROGRESS' | 'DONE', received ''");
        });

        it('should return 500 if something goes wrong', async () => {
            await getAuthSession();
            jest.spyOn(prisma.todo, 'create').mockRejectedValue(new Error('Something went wrong'));

            const response = await authSession
                .post('/api/todo')
                .send({ title: 'Valid title', description: 'Valid description' })
                .expect(500);

            expect(response.text).toBe('Something went wrong');
        });
    });

    describe('PUT /api/todo/:id', () => {
        it('should update a todo and return it', async () => {
            await getAuthSession();
            const updatedTodo = { title: 'Updated Todo', description: 'Updated Description', status: Status.NEW };
            const updatedTodoResponse = { id: 1, ...updatedTodo, userId: 1 };

            jest.spyOn(prisma.todo, 'update').mockResolvedValue(updatedTodoResponse);

            const response = await authSession
                .put('/api/todo/1')
                .send(updatedTodo)
                .expect(200);

            expect(response.body).toEqual(updatedTodoResponse);
        });

        it('should return 400 with validation errors for invalid input', async () => {
            await getAuthSession();
            const invalidTodo = { title: '', description: '', status: '' };

            const response = await authSession
                .put('/api/todo/1')
                .send(invalidTodo)
                .expect(400);

            expect(response.text).toEqual("Title is required 🔥 Description is required 🔥 Invalid enum value. Expected 'NEW' | 'PROGRESS' | 'DONE', received ''");
        });

        it('should return 500 if something goes wrong', async () => {
            await getAuthSession();
            jest.spyOn(prisma.todo, 'update').mockRejectedValue(new Error('Something went wrong'));

            const response = await authSession
                .put('/api/todo/1')
                .send({ title: 'Valid title', description: 'Valid description' })
                .expect(500);

            expect(response.text).toBe('Something went wrong');
        });
    });

    describe('DELETE /api/todo/:id', () => {

        it('should delete a todo and return 200', async () => {
            const updatedTodo = { id: 1, userId: 1, title: 'Updated Todo', description: 'Updated Description', status: Status.NEW };
            await getAuthSession();
            jest.spyOn(prisma.todo, 'delete').mockResolvedValue(updatedTodo);

            const response = await authSession
                .delete('/api/todo/1')
                .expect(200);

            expect(response.text).toBe('OK');
        });

        it('should return 500 if something goes wrong', async () => {
            await getAuthSession();
            jest.spyOn(prisma.todo, 'delete').mockRejectedValue(new Error('Something went wrong'));

            const response = await authSession
                .delete('/api/todo/1')
                .expect(500);

            expect(response.text).toBe('Something went wrong');
        });
    });
});
