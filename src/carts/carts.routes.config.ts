import { CommonRoutesConfig } from '../common/common.routes.config';
import { Carts } from "../entity/Carts";
import { CartProduct } from "../entity/CartProduct";
import { Product } from "../entity/Product";
// import { myConnection } from '../connection/index'
import * as express from 'express'
import {getConnection, getRepository, getConnectionManager  , getManager } from 'typeorm'

const saveCartItem = async( updateProduct: CartProduct) => {
    if( updateProduct.purchaseQuantity === 0 ) {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(CartProduct)
            .where("carts.id = :id", { id: updateProduct.id })
            .execute();
    }
    else{

    const cart = await getConnection()
                    .getRepository(CartProduct)
                    .createQueryBuilder("cartproduct")
                    .where("cartproduct.id = :id", { id: updateProduct.id })
                    .getOne();
    
    cart.purchaseQuantity = updateProduct.purchaseQuantity;
    await getConnection().manager.save(cart);
        }
    
}

export class CartsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application ) {
        super( app , 'CartsRoutes' );
    }
    configureRoutes() {
        this.app.route('/carts/:cartId')
            .get( async (req: express.Request, res: express.Response) => {
                const cartId = req.params.cartId;
                try{   
                    const cart = await getConnection()
                        .getRepository(Carts)
                        .createQueryBuilder("carts")
                        .leftJoinAndSelect("carts.cartProduct", "cartproduct")
                        .where("carts.id = :id", { id: cartId })
                        .getOne();
                        res.status(200).send([cart])//DB 생성 후 유저 추가 로직
                } catch(e) {
                    res.status(200).send(e)//DB 생성 후 유저 추가 로직
                }
            })
            .post( async (req: express.Request, res: express.Response) => {
                const { id , imgUrl , name , description , quantity , grade , salesQuantity , price } = req.body
                try{

                const cart = await getConnection()
                        .getRepository(Carts)
                        .createQueryBuilder("carts")
                        .leftJoinAndSelect("carts.cartProduct", "cartproduct")
                        .where("carts.id = :id", { id: req.params.cartId })
                        .getOne();
                const cartP = new CartProduct();
                cartP.imgUrl = imgUrl
                cartP.name = name
                cartP.description = description
                cartP.quantity = quantity
                cartP.grade = grade
                cartP.salesQuantity = salesQuantity
                cartP.price = price
                cartP.createdAt = new Date();
                cartP.updatedAt = new Date();
                cartP.purchaseQuantity = 1;
                await getConnection().manager.save(cartP);
                if(!cart.cartProduct){
                    cart.cartProduct = [cartP];
                }else {
                    cart.cartProduct.push(cartP);
                }
                await getConnection().manager.save(cart);
                        // const cart = await  getConnection().getRepository(Carts).find();
                    res.status(200).send( `장바구니 추가 `) //DB 생성 후 유저 추가 로직
                }
                catch( e ) {
                    res.status(500).send( `장바구니 추가 실패 `) //DB 생성 후 유저 추가 로직
                }
            })
        this.app.route('/carts/save/:cartId')
        .post( async (req: express.Request, res: express.Response) => {
            console.log(req.body);
            try{
            if( req.body !== []) {
                req.body.forEach( item => {
                    saveCartItem(item);
                })
            }
            const cart = await getConnection()
                    .getRepository(Carts)
                    .createQueryBuilder("carts")
                    .leftJoinAndSelect("carts.cartProduct", "cartproduct")
                    .where("carts.id = :id", { id: req.params.cartId })
                    .getOne();
                    await getConnection().manager.save(cart);
                    // const cart = await  getConnection().getRepository(Carts).find();
                res.status(200).send( cart ) //DB 생성 후 유저 추가 로직
            }
            catch( e ) {
                res.status(500).send( `장바구니 저장 실패 `) //DB 생성 후 유저 추가 로직
            }
        })
            return this.app;
    }
}