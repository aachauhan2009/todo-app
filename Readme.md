# Set up

## Setup and Run Server

yarn setup:server
yarn server

or

npm run setup:server
npm run server

or

cd server
yarn
yarn migrate
yarn start

or


cd server
npm i
npm run migrate
npm run start

## Setup and Run Client

yarn setup:client
yarn client

or

npm run setup:client
npm run client

or

cd client
yarn
yarn dev


or

cd client
npm i
npm run dev



## Database

SQLite db is used to no need to run any other db.


## Test coverage

### Server

cd server
npm run test

----------------------|---------|----------|---------|---------|--------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
----------------------|---------|----------|---------|---------|--------------------
All files             |   94.21 |     75.4 |     100 |   93.42 |                    
 server               |     100 |       75 |     100 |     100 |                    
  constants.ts        |     100 |      100 |     100 |     100 |                    
  server.ts           |     100 |       50 |     100 |     100 | 26                 
 server/controllers   |   90.47 |       75 |     100 |    88.5 |                    
  auth.ts             |   87.71 |    70.58 |     100 |    85.1 | 28,52-55,70,88,104 
  todo.ts             |   93.75 |    81.81 |     100 |    92.5 | 57,79,99           
 server/middleware    |     100 |      100 |     100 |     100 |                    
  auth.ts             |     100 |      100 |     100 |     100 |                    
 server/routes        |     100 |      100 |     100 |     100 |                    
  auth.ts             |     100 |      100 |     100 |     100 |                    
  todo.ts             |     100 |      100 |     100 |     100 |                    
 server/schemas       |     100 |      100 |     100 |     100 |                    
  auth.ts             |     100 |      100 |     100 |     100 |                    
  todo.ts             |     100 |      100 |     100 |     100 |                    
 server/utils         |     100 |      100 |     100 |     100 |                    
  format-zod-error.ts |     100 |      100 |     100 |     100 |                    
  hash.ts             |     100 |      100 |     100 |     100 |                    
----------------------|---------|----------|---------|---------|--------------------


### Client

cd client
npm run test

-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------|---------|----------|---------|---------|-------------------
All files              |   90.16 |    81.81 |    86.2 |   90.75 |                   
 src                   |     100 |      100 |     100 |     100 |                   
  constants.ts         |       0 |        0 |       0 |       0 |                   
  test-util.tsx        |     100 |      100 |     100 |     100 |                   
  toast.ts             |     100 |      100 |     100 |     100 |                   
 src/components/button |     100 |      100 |     100 |     100 |                   
  index.tsx            |     100 |      100 |     100 |     100 |                   
 src/components/input  |     100 |        0 |     100 |     100 |                   
  index.tsx            |     100 |        0 |     100 |     100 | 9                 
 src/pages/create-todo |   91.66 |      100 |     100 |   91.66 |                   
  api.ts               |     100 |      100 |     100 |     100 |                   
  index.tsx            |      90 |      100 |     100 |      90 | 27                
 src/pages/login       |     100 |    83.33 |     100 |     100 |                   
  index.tsx            |     100 |    83.33 |     100 |     100 | 62                
 src/pages/profile     |   86.95 |    71.42 |      80 |   86.95 |                   
  avatars.ts           |     100 |      100 |     100 |     100 |                   
  edit.tsx             |      80 |       50 |      75 |      80 | 55-76             
  index.tsx            |     100 |     87.5 |     100 |     100 | 25                
 src/pages/sign-up     |     100 |       90 |     100 |     100 |                   
  index.tsx            |     100 |       90 |     100 |     100 | 74                
 src/pages/todo-list   |   84.61 |    83.33 |   77.77 |   85.71 |                   
  api.ts               |   42.85 |      100 |       0 |      50 | 6-7,11            
  constants.ts         |     100 |      100 |     100 |     100 |                   
  index.tsx            |   89.65 |       75 |   86.66 |   89.28 | 38,48,62          
  search-input.tsx     |     100 |      100 |     100 |     100 |                   
  status-tab.tsx       |      75 |      100 |   66.66 |      75 | 16                
  todo-item.tsx        |     100 |      100 |     100 |     100 |                   
-----------------------|---------|----------|---------|---------|-------------------