module.exports =  {    
   "name": "default",
   "type": "mysql",
   // "host": process.env.DB_HOST,
   // "port": process.env.DB_PORT,
   // "username": process.env.DB_USER,
   // "password": process.env.DB_PASSWORD,
   // "database": process.env.DB_DATABASE,
   "host": 'localhost',
   "port": 3306,
   "username": 'root',
   "password": '1234',
   "database": 'limsm',
   "synchronize": process.env.NODE_ENV === 'development' ? false : true,
   "logging": process.env.NODE_ENV === 'development' ? false : true,
   "entities": [
      process.env.NODE_ENV === 'development' ? "src/entity/*.*" : "dist/entity/*.*"
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