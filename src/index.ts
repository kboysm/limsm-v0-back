import "reflect-metadata";
import express from 'express'
import * as http from 'http';
import * as bodyparser from 'body-parser'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import  cors from 'cors'
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import debug from 'debug'
import { myConnection } from './connection/index'
// import   mysqlConnection  from './db'
import { Users } from "./entity/User";
import  testUserList  from './testData/index'

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: Number = 3000;
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
    res.status(200).send('Server Up');
})

myConnection.then( async connection => {
    console.log("typeorm mysql start");
    const users = await connection.manager.find(Users);
    const adminSearch = users.map( item => item.name );
    testUserList.forEach( async item => {
        if(!adminSearch.includes(item.name)){
            await connection.manager.save(item);
        }
    })
    console.log("typeorm mysql end");

}).catch(error => console.log(error));

server.listen(port, ()=>{
    debugLog(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig)=> {
        debugLog(`Routes configured from ${route.getName()}`);
    })
})

// createConnection().then( async connection => {

//     console.log("typeorm mysql start");
//     const users = await connection.manager.find(Users);
//     const adminSearch = users.map( item => item.name );
//     testUserList.forEach( async item => {
//         if(!adminSearch.includes(item.name)){
//             await connection.manager.save(item);
//         }
//     })
//     console.log("typeorm mysql end");

// }).catch(error => console.log(error));
