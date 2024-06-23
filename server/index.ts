import express, { NextFunction, Request, Response } from 'express';
import crypto, { randomUUID } from "node:crypto";
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client'
// import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcrypt";
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

async function hashPassword(password : string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function comparePassword(password: string, hashedPassword:string) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

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

enum Status {
  NEW = "NEW",
  PROGRESS = "PROGRESS",
  DONE = "DONE"
}

type TaskBody = {
  title: string;
  description: string;
  status: Status;
}


const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("require auth");
  if (!req.session.userId) {
    return res.status(401).send('You must be logged in');
  }
  next();
};

apiRouter.get("/user", requireAuth, (req: Request, res: Response) => {
  if (req.session.userId) {
    res.json({
      userId: req.session.userId
    })
  } else {
    res.sendStatus(401);
  }
});

apiRouter.post("/logout", (req: Request, res: Response) => {
  req.session.regenerate(() => {
    res.sendStatus(200);
  });
});

apiRouter.post('/sign-up', async (req: Request, res: Response) => {
  try {
    const { name, password }: SignUpBody = req.body;
    const user = await prisma.user.create({
      data: {
        name: name,
        password: await hashPassword(password),
        // password,
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

apiRouter.get("/todo-list", requireAuth, async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.todo.findMany(({
      where: {
        userId: req.session.userId
      }
    }))
    res.json(tasks);
  } catch (err) {
    res.sendStatus(500);
    res.send("Something went wrong")
  }
});

apiRouter.post("/todo", requireAuth, async (req: Request, res: Response) => {
  console.log("create todo api");
  const { title, description, status = Status.NEW }: TaskBody = req.body;
  try {
    if (req.session.userId && title && description) {
      const task = await prisma.todo.create({
        data: {
          title,
          description,
          status: `${status}`,
          userId: req.session.userId
        }
      });
      res.json(task)
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    res.sendStatus(500);
    res.send("Something went wrong")
  }
});

interface IParam {
  id: number
}

apiRouter.put("/todo/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params as unknown as IParam;
  // console.log("create todo api"); 
  const { title, description, status }: TaskBody = req.body;
  try {
    if (req.session.userId && title && description) {
      const task = await prisma.todo.update({
        where: {
          id : Number(id),
          userId: req.session.userId
        },
        data: {
          title, description, status: `${status}`
        }
      });
      res.json(task)
    } else {
      res.sendStatus(400);
    }
  } catch (err : any) {
    res.status(500);
    res.send(err?.message || "Something went wrong")
  }
});

apiRouter.put("/todo/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params as unknown as IParam;
  try {
    if (req.session.userId) {
      await prisma.todo.delete({
        where: {
          id,
          userId: req.session.userId
        }
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
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
      if (await comparePassword(password, user.password)) {
        req.session.regenerate(() => {
          req.session.userId = user?.id
          res.json({
            id: user?.id
          });
        });
      } else {
        res.status(400);
        res.send("Invalid password");
      }

    } else {
      res.status(400);
      res.send("User doesn't exist");
    }

  } catch (err) {
    console.log(err);
    res.status(500);
    res.send("Something went wrong");
  }
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})