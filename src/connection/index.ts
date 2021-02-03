import { getConnectionOptions , createConnection , Connection } from "typeorm";

let connection: Connection

const connectDB = async () => {
    const connectionOptions = await getConnectionOptions();
    connection = await createConnection({
        ...connectionOptions,
        name: 'default'
    });
    return connection;
}

export default connectDB;
// export let myConnection = createConnection();/
