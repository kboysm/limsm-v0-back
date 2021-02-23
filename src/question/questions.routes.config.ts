import { CommonRoutesConfig } from '../common/common.routes.config';
import { Question } from "../entity/Questions";
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
                    const questionList = await  getConnection().getRepository(Question).find();
                    res.status(200).send(questionList)
                } catch(e) {
                    res.status(200).send(e)
                }
            })
        this.app.route('/question/:productId/:userId')
        .post( async (req: express.Request, res: express.Response) => {
            const productId = req.params.productId
            const product = await  getConnection().getRepository(Product)
                .createQueryBuilder("product")
                .where("product.id = :id", { id: productId }).getOne();
            const userId = req.params.userId
            const content = req.body.content
            const createdAt = new Date()
            const title = product.name +'$lsm$'+ new String(createdAt) +'$lsm$'+ userId +'$lsm$'
            // console.log( content );
            try{   
                fs.writeFile(`./src/fileStorage/${title}.txt` , content ,( err ) => {
                    if(err) throw new Error('fileError')
                    console.log(title+' created!')
                })
                res.status(200).send('asdasd')
                
            } catch(e) {
                res.status(200).send(e)
            }
        })
            return this.app;
    }
}