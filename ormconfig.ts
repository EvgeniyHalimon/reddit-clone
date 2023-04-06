import dotenv from 'dotenv';
dotenv.config()

const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'build'

export default {
   type: process.env.TYPE,
   host: process.env.HOST,
   port: process.env.DATABASE_PORT,
   username: process.env.DBUSER,
   password: process.env.PASSWORD,
   database: process.env.DATABASENAME,
   synchronize: false,
   logging: process.env.NODE_ENV === 'development',
   entitie: [
      rootDir + "/entities/**/*{.ts,.js}"
   ],
   migrations: [
      rootDir + "/migrations/**/*{.ts,.js}"
   ],
   subscribers: [
      rootDir + "/subscribers/**/*{.ts,.js}"
   ],
   seeds: [rootDir + "/seeds/**/*{.ts,.js}"],
   cli: {
      entitiesDir: rootDir + "/entities",
      migrationsDir: rootDir + "/migrations",
      subscribersDir: rootDir + "/subscribers"
   }
}