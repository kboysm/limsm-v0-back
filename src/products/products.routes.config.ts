import { CommonRoutesConfig } from '../common/common.routes.config';
import { Product } from "../entity/Product";
// import { myConnection } from '../connection/index'
import * as express from 'express'
import {getConnection, getRepository, getConnectionManager , createConnection , getManager } from 'typeorm'

export class ProductsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application ) {
        super( app , 'ProductsRoutes' );
    }
    configureRoutes() {
        this.app.route('/products')
            .get( async (req: express.Request, res: express.Response) => {
                try{   
                        const productList = await  getConnection().getRepository(Product).find();
                        res.status(200).send(productList)//DB 생성 후 유저 추가 로직
                } catch(e) {
                    res.status(200).send(e)//DB 생성 후 유저 추가 로직
                }
            })
            return this.app;
    }
}