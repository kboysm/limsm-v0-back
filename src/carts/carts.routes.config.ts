import { CommonRoutesConfig } from '../common/common.routes.config';
import { Carts } from "../entity/Carts";
import { CartProduct } from "../entity/CartProduct";
import { BuyProduct } from "../entity/BuyProduct";
import { OrderInfo } from "../entity/OrderInfo";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
// import { myConnection } from '../connection/index'
import * as express from 'express'
import {getConnection, getRepository, getConnectionManager  , getManager } from 'typeorm'

const saveCartItem = async( updateProduct: CartProduct) => {
    // if( updateProduct.purchaseQuantity === 0 ) {
    //     const test = await getConnection()
    //         .createQueryBuilder()
    //         .delete()
    //         .from(CartProduct)
    //         .where("cartproduct.id = :id", { id: updateProduct.id })
    //         .execute();
    // }
    // else{
    const cart = await getConnection()
                    .getRepository(CartProduct)
                    .createQueryBuilder("cartproduct")
                    .where("cartproduct.id = :id", { id: updateProduct.id })
                    .getOne();
    
    cart.purchaseQuantity = updateProduct.purchaseQuantity;
    await getConnection().manager.save(cart);
        // }
    
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
                const result = await getConnection().manager.save(cart);
                        // const cart = await  getConnection().getRepository(Carts).find();
                    res.status(200).send( result ) //DB 생성 후 유저 추가 로직
                }
                catch( e ) {
                    res.status(500).send( `장바구니 추가 실패 `) //DB 생성 후 유저 추가 로직
                }
            })
        this.app.route('/carts/save/:cartId')
        .post( async (req: express.Request, res: express.Response) => {
            console.log(req.body);

            try{
                // if( req.body !== []) {
                //     req.body.forEach( item => {
                //         saveCartItem(item);
                //     })
                // }
                const cart = await getConnection()
                        .getRepository(Carts)
                        .createQueryBuilder("carts")
                        .leftJoinAndSelect("carts.cartProduct", "cartproduct")
                        .where("carts.id = :id", { id: req.params.cartId })
                        .getOne();
                        await getConnection().manager.save(cart);
                const bodyIdList = req.body.map( item => item.id );
                const cartIdList = cart.cartProduct.map( item => item.id );
                if(bodyIdList.length === cartIdList.length) { // ok
                    req.body.forEach( item => {
                                saveCartItem(item);
                    })
                }
                else if (bodyIdList.length < cartIdList.length){ // ok
                    bodyIdList.forEach( el => {
                        if(cartIdList.includes(el)) {
                            cartIdList.splice(cartIdList.indexOf(el) ,1);
                        }
                        console.log(cartIdList);
                    })
                    cartIdList.forEach( async el => {
                        await getConnection()
                            .createQueryBuilder()
                            .delete()
                            .from(CartProduct)
                            .where("cartproduct.id = :id", { id: el })
                            .execute();
                    })
                }
                else if (bodyIdList === []) {
                    cartIdList.forEach( async el => {
                        await getConnection()
                            .createQueryBuilder()
                            .delete()
                            .from(CartProduct)
                            .where("cartproduct.id = :id", { id: el })
                            .execute();
                    })
                }
                        // const cart = await  getConnection().getRepository(Carts).find();
                        
                    res.status(200).send( cart ) //DB 생성 후 유저 추가 로직
            }
            catch( e ) {
                res.status(500).send( `장바구니 저장 실패 `) //DB 생성 후 유저 추가 로직
            }
        })
        this.app.route('/carts/delete/:cartId')
        .post( async (req: express.Request, res: express.Response) => {
            try{
                console.log(req.body);
                const { id } = req.body;
                const resultMsg = await getConnection()
                .createQueryBuilder()
                .delete()
                .from(CartProduct)
                .where("cartproduct.id = :id", { id })
                .execute();
                res.status(200).send( resultMsg );
            }catch(e) {
                res.status(500).send( e );
            }
        })
        this.app.route('/carts/buy/:cartId/:userId')
        .post( async (req: express.Request, res: express.Response) => {
            const cartId = req.params.cartId
            const userId = req.params.userId
            const { deliveryInfo , deliveryPrice } = req.body
            let totalPrice = deliveryPrice
            try{
            let buyProductList: Array<BuyProduct> = []
            const user = await getConnection().getRepository(User).createQueryBuilder("user")
                .leftJoinAndSelect("user.orderInfo", "orderinfo")
                .where("user.id = :id", { id: userId }).getOne();
            const cart = await getConnection()
                        .getRepository(Carts)
                        .createQueryBuilder("carts")
                        .leftJoinAndSelect("carts.cartProduct", "cartproduct")
                        .where("carts.id = :id", { id: cartId })
                        .getOne();
            const orderInfo = new OrderInfo();
            cart.cartProduct.forEach( async item => {
                    try{
                        const buyProductClone = new BuyProduct();
                        buyProductClone.imgUrl = item.imgUrl
                        buyProductClone.name = item.name
                        buyProductClone.description = item.description
                        buyProductClone.quantity = item.quantity
                        buyProductClone.grade = item.grade
                        buyProductClone.salesQuantity = item.salesQuantity
                        buyProductClone.price = item.price
                        totalPrice += item.price
                        buyProductClone.createdAt = new Date()
                        buyProductClone.updatedAt = new Date()
                        buyProductClone.purchaseQuantity = item.purchaseQuantity
                        buyProductList.push(buyProductClone);
                        orderInfo.buyProduct = [...orderInfo.buyProduct , buyProductClone];
                        await getConnection().manager.save(buyProductClone);
                    } catch(e) {

                    }
                    // await getConnection()
                    // .createQueryBuilder()
                    // .delete()
                    // .from(CartProduct)
                    // .where("cartproduct.id = :id", { id:item.id })
                    // .execute();
            })
            // const testData = buyProductList.map( async item => {
            //     return await getConnection().manager.save(item);
            // })
            // let buyProductList2 = []
            // Promise.all(testData).then( v => {
            //     buyProductList2.push(v)
            // })
            console.log(buyProductList)

            orderInfo.destination = deliveryInfo.destination;
            orderInfo.name = deliveryInfo.name;
            orderInfo.tel = deliveryInfo.tel;
            orderInfo.createdAt = new Date();
            orderInfo.updatedAt = new Date();
            orderInfo.payment = totalPrice;
            orderInfo.buyProduct = [...buyProductList];
                    await getConnection().manager.save(orderInfo);


            user.orderInfo = [...user.orderInfo , orderInfo ];
            await getConnection().manager.save(user);
            console.log(totalPrice , deliveryInfo , deliveryPrice)
            res.status(200).send({ result: true , msg:'성공' })
        }
        catch(e) {
            res.status(200).send({ result: false , msg:e })
        }
        })
            return this.app;
    }
}