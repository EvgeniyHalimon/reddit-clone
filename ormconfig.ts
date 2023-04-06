import dotenv from 'dotenv';
dotenv.config()

export = {
   type: process.env.TYPE,
   host: process.env.HOST,
   port: process.env.DATABASE_PORT,
   username: process.env.DBUSER,
   password: process.env.PASSWORD,
   database: process.env.DATABASENAME,
   synchronize: false,
   logging: true,
   entitie: [
      "src/entities/**/*.ts"
   ],
   migrations: [
      "src/migrations/**/*.ts"
   ],
   subscribers: [
      "src/subscribers/**/*.ts"
   ],
   seeds: ["src/seeds/**/*{.ts,.js}"],
   cli: {
      entitiesDir: "src/entities",
      migrationsDir: "src/migrations",
      subscribersDir: "src/subscribers"
   }
}