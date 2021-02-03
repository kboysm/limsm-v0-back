// import path from 'path';

module.exports =  {
   "type": "mysql",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USER,
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_DATABASE,
   "synchronize": process.env.NODE_ENV === 'development' ? true : false,
   "logging": process.env.NODE_ENV === 'development' ? false : true,
   "entities": [
      process.env.NODE_ENV === 'development' ? "src/entity/**/*.*" : "dist/entity/**/*.js"
      // path.resolve(__dirname, '**/*.entity{.ts,.js}'),
   ],
   "migrations": [
      "dist/migration/**/*.js"
   ],
   "subscribers": [
      "dist/subscriber/**/*.js"
   ],
   "cli": {
      "entitiesDir":process.env.NODE_ENV === 'development' ?  "src/entity" : "dist/entity",
      "migrationsDir":process.env.NODE_ENV === 'development' ?  "src/migration" : "dist/migration",
      "subscribersDir":process.env.NODE_ENV === 'development' ?  "src/subscriber" : "dist/subscriber"
   },
}