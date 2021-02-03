import { connect } from "net";
import { getConnectionOptions , createConnection , Connection, Repository,getManager } from "typeorm";
import {User} from '../entity/User'
let connection: Connection

const connectDB = async () => {
    const connectionOptions = await getConnectionOptions();
    connection = await createConnection({
        "type": "mysql",
        "host": process.env.DB_HOST,
        "port": 3306,
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_DATABASE,
        "synchronize": false,
        "logging": true,
        "entities": [
            process.env.NODE_ENV === 'development' ? "src/entity/**/*.*" : "dist/entity/**/*.*"
        ],
        "migrations": [
            "dist/migration/**/*.js"
        ],
        name: 'default'
    });
    return connection;
}

export const getUser = ():Repository<User> => connection.getRepository(User);

export default connectDB;
// export let myConnection = createConnection();/
