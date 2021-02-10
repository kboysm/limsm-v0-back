import { getConnectionOptions , createConnection , Connection, Repository,getManager } from "typeorm";
import {User} from '../entity/User'
import {Product} from '../entity/Product'
import {CartProduct} from '../entity/CartProduct'
import {OrderInfo} from '../entity/OrderInfo'
import {Carts} from '../entity/Carts'
let connection: Connection
const connectDB = async () => {
    const connectionOptions = await getConnectionOptions();
    console.log(connectionOptions);
    connection = await createConnection({
        ...connectionOptions,
        entities:[User,Product,OrderInfo,Carts,CartProduct],
    });
    return connection;
}

export default connectDB;

// export let myConnection = createConnection();/
