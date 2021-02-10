import { CommonRoutesConfig } from '../common/common.routes.config';
import { Carts } from "../entity/Carts";
import { CartProduct } from "../entity/CartProduct";
import { Product } from "../entity/Product";
// import { myConnection } from '../connection/index'
import * as express from 'express'
import {getConnection, getRepository, getConnectionManager  , getManager } from 'typeorm'

export class CartsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application ) {
        super( app , 'CartsRoutes' );
    }
    configureRoutes() {
        this.app.route('/carts/:cartId')
            .get( async (req: express.Request, res: express.Response) => {
                const cartId = req.params.cartId;
                const productId = req.params.productId;
                console.log(cartId , productId)
                try{   
                    const cart = await getConnection()
                        .getRepository(Carts)
                        .createQueryBuilder("carts")
                        .leftJoinAndSelect("carts.cartProduct", "cartproduct")
                        .where("carts.id = :id", { id: cartId })
                        .getOne();
                //     const p1 = await getConnection()
                //     .getRepository(Product)
                //     .createQueryBuilder("product")
                //     .where("product.id = :id", { id: productId })
                //     .getOne();
                // const cartP = new CartProduct();
                // cartP.imgUrl = p1.imgUrl
                // cartP.name = p1.name
                // cartP.description = p1.description
                // cartP.quantity = p1.quantity
                // cartP.grade = p1.grade
                // cartP.salesQuantity = p1.salesQuantity
                // cartP.price = p1.price
                // cartP.createdAt = new Date();
                // cartP.updatedAt = new Date();
                // cartP.purchaseQuantity = 1;
                // await getConnection().manager.save(cartP);
                // cart.cartProduct = [cartP];
                // await getConnection().manager.save(cart);
                        // const cart = await  getConnection().getRepository(Carts).find();
                        res.status(200).send([cart])//DB 생성 후 유저 추가 로직
                } catch(e) {
                    res.status(200).send(e)//DB 생성 후 유저 추가 로직
                }
            })
            .post( (req: express.Request, res: express.Response) => {
                res.status(200).send( `List Of Users `) //DB 생성 후 유저 추가 로직
            })

            return this.app;
    }
}