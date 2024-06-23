import { prisma } from '../utils/prisma';
import { hashPassword } from '../utils/hash';
import app, { stopServer } from "../server"

const session: any = require('supertest-session');

let appSession: any = null;
let authSession: any = null;

const getAppSession = () => {
    appSession = session(app);
}

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
}

describe('Authentication Routes', () => {
    beforeEach(() => {
        getAppSession();
    });

    afterEach(async () => {
        await new Promise((resolve: any) => setTimeout(() => resolve(), 500));
    });

    afterAll(() => {
        stopServer();
    })

    describe('POST /api/auth/sign-up', () => {
        it('should create a new user and return user ID', async () => {
            const mockUserData = {
                name: 'testuser',
                password: 'testpassword',
            };

            const mockUserProfile = {
                id: 1,
                email: 'testuser@example.com',
                name: 'testuser',
                avatar: 'avatar-url',
                password: "123",
            };

            jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUserProfile);
            const response = await appSession
                .post('/api/auth/sign-up')
                .send(mockUserData)
                .expect(200);



            expect(response.body).toHaveProperty('id');
            expect(typeof response.body.id).toBe('number');
        });

        it('should return 400 with validation errors for invalid input', async () => {
            const invalidUserData = {
                name: '',
                password: '',
            };

            const response = await appSession
                .post('/api/auth/sign-up')
                .send(invalidUserData)
                .expect(400);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toHaveLength(2); // Assuming signUpSchema validates 'name' and 'password'
        });
    });

    describe('POST /api/auth/login', () => {
        it('should log in user and return user ID', async () => {

            const mockUserProfile = {
                id: 1,
                email: 'testuser@example.com',
                name: 'testuser',
                avatar: 'avatar-url',
                password: await hashPassword("testpassword"),
            };

            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserProfile);

            const mockLoginData = {
                name: 'testuser',
                password: 'testpassword',
            };

            const response = await appSession
                .post('/api/auth/login')
                .send(mockLoginData)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(typeof response.body.id).toBe('number');
        });

        it('should return 400 with "User doesn\'t exist" for non-existing user', async () => {

            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
            const nonExistingUser = {
                name: 'nonexistinguser',
                password: 'testpassword',
            };

            const response = await appSession
                .post('/api/auth/login')
                .send(nonExistingUser)
                .expect(400);

            expect(response.text).toBe("User doesn't exist");
        });

        it('should return 400 with "Invalid password" for incorrect password', async () => {
            const mockUserProfile = {
                id: 1,
                email: 'testuser@example.com',
                name: 'testuser',
                avatar: 'avatar-url',
                password: "123",
            };
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserProfile);

            const incorrectPassword = {
                name: 'testuser',
                password: 'incorrectpassword',
            };

            const response = await appSession
                .post('/api/auth/login')
                .send(incorrectPassword)
                .expect(400);

            expect(response.text).toBe('Invalid password');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should log out the user', async () => {
            await getAuthSession();
            const response = await authSession
                .post('/api/auth/logout')
                .expect(200);

            expect(response.text).toBe('OK');
        });
    });

    describe('GET /api/auth/user', () => {
        it('should return user ID if authenticated', async () => {
            await getAuthSession();
            const response = await authSession
                .get('/api/auth/user')
                .expect(200);

            expect(response.body).toEqual({ userId: 1 });
        });

        it('should return 401 if not authenticated', async () => {
            const response = await appSession
                .get('/api/auth/user')
                .set('Cookie', 'session=invalidsessionid')
                .expect(401);

            expect(response.text).toBe('You must be logged in');
        });
    });

    describe('GET /api/auth/user/profile', () => {
        ;
        it('should return user profile if authenticated', async () => {
            await getAuthSession();
            const mockUserProfile = {
                id: 1,
                email: 'testuser@example.com',
                name: 'testuser',
                avatar: 'avatar-url',
                password: "123",
            };

            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserProfile);

            const response = await authSession
                .get('/api/auth/user/profile')
                .expect(200);

            expect(response.body).toEqual(mockUserProfile);
        });

        it('should return 401 if not authenticated', async () => {
            const response = await appSession
                .get('/api/auth/user/profile')
                .set('Cookie', 'session=invalidsessionid')
                .expect(401);

            expect(response.text).toBe('You must be logged in');
        });
    });

    describe('POST /api/auth/user/profile', () => {

        it('should update user profile if authenticated', async () => {
            await getAuthSession();
            const updatedUserProfile = {
                id: 1,
                email: 'updatedemail@example.com',
                avatar: 'new-avatar-url',
            };

            const mockUserProfile = {
                id: 1,
                email: 'updatedemail@example.com',
                name: 'testuser',
                avatar: 'new-avatar-url',
                password: "123",
            };

            jest.spyOn(prisma.user, 'update').mockResolvedValue(mockUserProfile);

            const response = await authSession
                .post('/api/auth/user/profile')
                .send(updatedUserProfile)
                .expect(200);

            expect(response.body).toMatchObject({ id: 1 });
        });

        it('should return 401 if not authenticated', async () => {
            const response = await appSession
                .post('/api/auth/user/profile')
                .set('Cookie', 'session=invalidsessionid')
                .expect(401);

            expect(response.text).toBe('You must be logged in');
        });
    });
});
