process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
import dotenv from 'dotenv'
import "reflect-metadata";
import express from 'express'
import * as http from 'http';
import * as bodyparser from 'body-parser'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import  cors from 'cors'
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { ProductsRoutes } from './products/products.routes.config';
import { CartsRoutes } from './carts/carts.routes.config';
import debug from 'debug'
import connectDB from './connection/index'
import { getConnection, getConnectionManager, createQueryBuilder } from 'typeorm'
import { userList , productList, testOrderInfo, buypro_1, buypro_2}  from './testData/index'
import { User } from './entity/User'
import { CartProduct } from './entity/CartProduct'
import { Product } from './entity/Product'
import { Carts } from './entity/Carts'
import { OrderInfo } from './entity/OrderInfo';

dotenv.config();

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use( bodyparser.json() );
app.use( cors() );
app.use( expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}))
routes.push( new UsersRoutes(app) );
routes.push( new ProductsRoutes(app) );
routes.push( new CartsRoutes(app) );

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}))
app.get('/', (req: express.Request , res: express.Response) => {
        res.status(200).send('h');
})
app.get('/img/:imgName', (req: express.Request , res: express.Response) => { // 정적 파일 이미지 간단한 라우트
    const imgName = req.params.imgName;
    console.log( imgName );
    res.status(200).sendFile(__dirname+'/img/'+imgName)
    // res.status(200).send(__dirname+'/img/'+imgName)
})

const startConnect = async () => {
    console.log("typeorm mysql start"); 
        const connection = await connectDB()
        // const users = await connection.manager.find(User);
        // const testUser = users[3]
        // const TestOrderInfo = await connection.manager.find(OrderInfo)
        // testUser.orderInfo = [TestOrderInfo[0]]
        //         await connection.manager.save(testUser);
        // const adminSearch = users.map( item => item.name );
        // userList.forEach( async item => {
        //     if(!adminSearch.includes(item.name)){
        //         const cart = new Carts();
        //         await connection.manager.save(cart);
        //         item.carts = cart;
        //         await connection.manager.save(item);
        //     }
        // })
        // const products = await connection.manager.find(Product);
        // const nameSearch = products.map( item => item.name );
        // console.log('asdasdasd : ' , productList)
        // productList.forEach( async item => {
        //     if(!nameSearch.includes(item.name)){
        //         await connection.manager.save(item);
        //     }
        // })
        //
        //     console.log("typeorm mysql end");
                // await connection.manager.save(buypro_1);
                // await connection.manager.save(buypro_2);
                // await connection.manager.save(testOrderInfo);

}
startConnect();


server.listen(port, ()=>{
    debugLog(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig)=> {
        debugLog(`Routes configured from ${route.getName()}`);
    })
})