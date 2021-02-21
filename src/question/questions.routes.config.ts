import { CommonRoutesConfig } from '../common/common.routes.config';
import { Carts } from "../entity/Carts";
import { CartProduct } from "../entity/CartProduct";
import { BuyProduct } from "../entity/BuyProduct";
import { OrderInfo } from "../entity/OrderInfo";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
let fs = require('fs');
// import { myConnection } from '../connection/index'
import * as express from 'express'
import {getConnection, getRepository, getConnectionManager  , getManager } from 'typeorm'

export class QuestionsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application ) {
        super( app , 'QuestionsRoutes' );
    }
    configureRoutes() {
        this.app.route('/questions')
            .get( async (req: express.Request, res: express.Response) => {
                try{   
                    
                } catch(e) {

                }
            })
        this.app.route('/question/:productId/:userId')
        .post( async (req: express.Request, res: express.Response) => {
            const productId = req.params.productId
            const userId = req.params.userId
            const content = req.body.content
            // console.log( content );
            fs.writeFile('./src/fileStorage/asdasd.txt' , content ,( err ) => {
                console.log('sssss')
            })
            res.status(200).send('asdasd')
            try{   
                
            } catch(e) {

            }
        })
            return this.app;
    }
}