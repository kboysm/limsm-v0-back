import { connect } from "net";
import { getConnectionOptions , createConnection , Connection, Repository,getManager } from "typeorm";
import {User} from '../entity/User'
let connection: Connection

const connectDB = async () => {
    const connectionOptions = await getConnectionOptions();
    connection = await createConnection({
        ...connectionOptions,
        name: 'default'
    });
    return connection;
}

export const getUser = ():Repository<User> => connection.getRepository(User);

export default connectDB;
// export let myConnection = createConnection();/
