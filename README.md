# Reddit Clone Build with React, Express, Postgresql, Typescript

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Setup .env files in server and client folders using .env.example
4. Run `npm dev` command

# Script

## "start": "ts-node src/server.ts",
## "typeorm": "ts-node ./node_modules/typeorm/cli.js",
## "server": "nodemon --exec ts-node src/server.ts",
## "client": "cd client && npm run dev",
## "dev": "concurrently \"npm run server\" \"npm run client\" -n server,client",
## "seed": "ts-node ./node_modules/typeorm-seeding/dist/cli.js seed"
