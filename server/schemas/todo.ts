import { z } from 'zod';
import { Status } from '../constants';

export const todoSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    status: z.nativeEnum(Status).optional(),
});
