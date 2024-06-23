import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { signUpSchema, loginSchema } from '../schemas/auth';
import z from "zod"

export interface SignUpBody {
    name: string;
    password: string;
}

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, password } = signUpSchema.parse(req.body);
        const user = await prisma.user.create({
            data: {
                name,
                password: await hashPassword(password),
            },
        });
        res.json({ id: user?.id });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json(err.errors);
        } else {
            res.status(500).send("Sign up failed");
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { name, password } = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { name } });

        if (user?.id) {
            if (await comparePassword(password, user.password)) {
                req.session.regenerate(() => {
                    req.session.userId = user?.id;
                    console.log("session regenerated", req.session.userId)
                    res.json({ id: user?.id });
                });
            } else {
                res.status(400).send("Invalid password");
            }
        } else {
            res.status(400).send("User doesn't exist");
        }
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json(err.errors);
        } else {
            res.status(500).send("Login Failed");
        }
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.regenerate(() => {
        res.sendStatus(200);
    });
};

export const getUser = (req: Request, res: Response) => {
    if (req.session.userId) {
        res.json({ userId: req.session.userId });
    } else {
        res.sendStatus(401);
    }
};


export const getUserProfile = async (req: Request, res: Response) => {
    if (req.session.userId) {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId }, select: {
                id: true,
                email: true,
                name: true,
                avatar: true,

            }
        });
        res.json(user);
    } else {
        res.sendStatus(401);
    }
};

export const saveUserProfile = async (req: Request, res: Response) => {
    console.log(req.session.userId, "req.session.userId");
    if (req.session.userId) {
        const { email, avatar } = req.body;
        const user = await prisma.user.update({
            where: { id: req.session.userId }, data: {
                email,
                avatar,
            }
        });
        res.json({ id: user?.id });
    } else {
        res.sendStatus(401);
    }
};
