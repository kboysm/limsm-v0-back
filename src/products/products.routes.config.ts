import { CommonRoutesConfig } from '../common/common.routes.config';
import { Product } from "../entity/Product";
import { BuyProduct } from "../entity/BuyProduct";
import { OrderInfo } from "../entity/OrderInfo";
import { User } from "../entity/User";
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
        this.app.route('/product/buy/:userId/:productId') // 바로구매
        .post( async (req: express.Request, res: express.Response) => {
            try{   
                const userId = req.params.userId;
                const productId = req.params.productId;
                const { userInfo , deliveryInfo , deliveryPrice } = req.body
                const user = await getConnection().getRepository(User).createQueryBuilder("user")
                .leftJoinAndSelect("user.orderInfo", "orderinfo")
                .where("user.id = :id", { id: userId }).getOne();
                //     // console.log([...user.orderInfo , {test:'test'}])
                const product = await  getConnection().getRepository(Product)
                .createQueryBuilder("product")
                .where("product.id = :id", { id: productId }).getOne();
                    product.quantity--;
                    product.salesQuantity++;
                await getConnection().manager.save(product);
                const buyProduct = new BuyProduct();
                    buyProduct.imgUrl = product.imgUrl;
                    buyProduct.name = product.name;
                    buyProduct.description = product.description;
                    buyProduct.quantity = product.quantity;
                    buyProduct.grade = product.grade;
                    buyProduct.salesQuantity = product.salesQuantity;
                    buyProduct.price = product.price;
                    buyProduct.purchaseQuantity = 1
                    buyProduct.createdAt = new Date()
                    buyProduct.updatedAt = new Date()
                await getConnection().manager.save(buyProduct);
                const orderInfo = new OrderInfo();
                    orderInfo.destination = deliveryInfo.destination;
                    orderInfo.name = deliveryInfo.name;
                    orderInfo.tel = deliveryInfo.tel;
                    orderInfo.createdAt = new Date();
                    orderInfo.updatedAt = new Date();
                    orderInfo.payment = buyProduct.price + deliveryPrice;
                    orderInfo.buyProduct = [buyProduct];
                    await getConnection().manager.save(orderInfo);
                user.orderInfo = [...user.orderInfo , orderInfo ];
                await getConnection().manager.save(user);
                res.status(200).send({result: true , msg:'성공'})//DB 생성 후 유저 추가 로직
            } catch(e) {
                res.status(200).send({result: false , msg:e})//DB 생성 후 유저 추가 로직
            }
        })
            return this.app;
    }
}