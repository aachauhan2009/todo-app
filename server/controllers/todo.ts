import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { Status } from '../constants';
import { todoSchema } from '../schemas/todo';
import z from "zod";
import { formatZodError } from '../utils/format-zod-error';

type TaskBody = {
    title: string;
    description: string;
    status: Status;
};

interface IParam {
    id: number;
}

export const getTodoList = async (req: Request, res: Response) => {
    const { status, search = "" }: { status: Status, search: string } = req.query as any;
    try {
        const tasks = await prisma.todo.findMany({
            where: {
                userId: req.session.userId, status: status || undefined,
                OR: [
                    {
                        title: {
                            contains: search
                        }
                    }, {
                        description: {
                            contains: search
                        }
                    }]

            },
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
};

export const createTodo = async (req: Request, res: Response) => {
    try {
        const { title, description, status = Status.NEW } = todoSchema.parse(req.body);
        if (req.session.userId && title && description) {
            const task = await prisma.todo.create({
                data: {
                    title,
                    description,
                    status: `${status}`,
                    userId: req.session.userId,
                },
            });
            res.json(task);
        } else {
            res.sendStatus(400);
        }
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).send(formatZodError(err));
        } else {
            res.status(500).send("Something went wrong");
        }
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IParam;
    try {
        const { title, description, status } = todoSchema.parse(req.body);
        if (req.session.userId && title && description) {
            const task = await prisma.todo.update({
                where: { id: Number(id), userId: req.session.userId },
                data: { title, description, status: `${status}` },
            });
            res.json(task);
        } else {
            res.sendStatus(400);
        }
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).send(formatZodError(err));
        } else {
            res.status(500).send(err.message || "Something went wrong");
        }
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IParam;
    try {
        if (req.session.userId) {
            await prisma.todo.delete({
                where: { id: Number(id), userId: req.session.userId },
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
};
