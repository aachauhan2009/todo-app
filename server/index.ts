import express, { NextFunction, Request, Response } from 'express';
import crypto, { randomUUID } from "node:crypto";
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client'
// import cookieParser from "cookie-parser";
import session from "express-session";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
const prisma = new PrismaClient()

declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}

const app = express()
const port = 3000

app.use(bodyParser.json())
// app.use(cookieParser());

const apiRouter = express.Router();

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'todo list',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

export interface SignUpBody {
  name: string;
  password: string;
  email: string;
}

type TaskBody = {
  title:       string;
  description: string;
}


const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("require auth");
  if (!req.session.userId) {
    return res.status(401).send('You must be logged in');
  }
  next();
};

apiRouter.post('/sign-up', async (req: Request, res: Response) => {
  try {
    const { name, password, email }: SignUpBody = req.body;
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        // password: crypto.hash("sha256",password).toString(),
        password,
      }
    });
    res.json({
      id: user?.id
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

apiRouter.get("/todo-list", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.todo.findMany(({
      where: {
        userId: req.session.userId
      }
    }))
    res.json(tasks);
  } catch(err) {
    res.sendStatus(500);
    res.send("Something went wrong")
  }
});

apiRouter.post("/todo", async (req: Request, res: Response) => {
  console.log("create todo api"); 
  const { title, description }: TaskBody = req.body;
  try {
    if(req.session.userId && title && description) {
      const task = await prisma.todo.create({
        data: {
          title,
          description,
          userId: req.session.userId
        }
      });
      res.json(task)
    } else {
      res.sendStatus(400);
    }
  } catch(err) {
    res.sendStatus(500);
    res.send("Something went wrong")
  }
});

apiRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { name, password }: SignUpBody = req.body;
    const user = await prisma.user.findUnique({
      where: {
        name
      },
    });

    if (user?.id) {
      if (user?.password === password) {
        req.session.regenerate(() => {
          req.session.userId = user?.id
          res.json({
            id: user?.id
          });
        });

      } else {
        res.sendStatus(400);
        res.send("Invalid password");
      }

    } else {
      res.sendStatus(400);
      res.send("User doesn't exist");
    }

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    res.send("Something went wrong");
  }
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})