import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from './utils/prisma';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';

declare module 'express-session' {
    export interface SessionData {
        userId: number;
    }
}

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(
    session({
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
        secret: 'todo list',
        resave: true,
        saveUninitialized: true,
        store: process.env.NODE_ENV === "test" ? undefined : new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, // 2 minutes
            dbRecordIdIsSessionId: true,
        }),
    })
);

app.use('/api/auth', authRoutes);
app.use('/api/todo', todoRoutes);

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

export const stopServer = () => {
    server.close();
}

export default app;

