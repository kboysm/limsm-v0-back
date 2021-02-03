import { getConnectionOptions , createConnection , Connection, Repository,getManager } from "typeorm";
import {User} from '../entity/User'
let connection: Connection
const connectDB = async () => {
    const connectionOptions = await getConnectionOptions();
    console.log(connectionOptions);
    connection = await createConnection({
        ...connectionOptions,
        entities:[User],
        name: 'default'
    });
    return connection;
}

export default connectDB;

// export let myConnection = createConnection();/
