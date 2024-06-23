import { NextFunction, Request, Response } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(401).send('You must be logged in');
    }
    next();
};
