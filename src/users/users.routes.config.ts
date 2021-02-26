import { CommonRoutesConfig } from '../common/common.routes.config';
import { User } from "../entity/User";
import { Product } from "../entity/Product";
import { OrderInfo } from "../entity/OrderInfo";
import { BuyProduct } from "../entity/BuyProduct";
import { Carts } from "../entity/Carts";
// import { myConnection } from '../connection/index'
import * as express from 'express'
import {getConnection, getRepository, getConnectionManager  , getManager } from 'typeorm'
import crypto from 'crypto'
import secretKey from '../secretKey/index'
import jwt from 'jsonwebtoken'

const vertifyToken = (t) => {
    return new Promise((resolve, reject) => {
        if(!t) resolve({msg:'guest'})
        if(t.length < 10 ) resolve({msg:'guest'})
        jwt.verify(t , secretKey.jwtKey, (err , v) => {
            if(err) reject(err)
            resolve(v)
        })
    })
}

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application ) {
        super( app , 'UsersRoutes' );
    }
    configureRoutes() {
        this.app.route('/users')
            .get( async (req: express.Request, res: express.Response) => {
                try{   
                        const userList = await  getConnection().getRepository(User).find();
                        res.status(200).send(userList)//DB 생성 후 유저 추가 로직
                } catch(e) {
                    res.status(200).send(e)//DB 생성 후 유저 추가 로직
                }
            })
            .post( (req: express.Request, res: express.Response) => {
                res.status(200).send( `List Of Users `) //DB 생성 후 유저 추가 로직
            })
        this.app.route('/signUp')
            .post( async(req: express.Request, res: express.Response) => {
                const { email , password , name } = req.body
                if( email && password && name ) {
                    const newUser = new User();
                        newUser.email= email
                        newUser.password= crypto.createHmac('sha256',secretKey.cryptoKey).update(password).digest('hex')
                        newUser.name= name
                        newUser.age= 0
                        newUser.address= ''
                        newUser.createdAt = new Date()
                        newUser.updatedAt = new Date()

                            const user = await getConnection().getRepository(User).createQueryBuilder("user").where("user.email = :email", { email: newUser.email }).getOne();
                            if(user){
                                res.status(200).send('idExists')
                            }else {
                                const cart = new Carts();
                                await getConnection().manager.save(cart);
                                newUser.carts = cart;
                                await getConnection().createQueryBuilder().insert().into(User).values(
                                    newUser
                                ).execute().then(async r=> {
                                    res.status(200).send('signUp')
                                }).catch( e => {
                                    res.status(200).send( 'signUpFail' ) //DB 생성 후 유저 추가 로직
                                });
                                
                        //         await connection.manager.save(item);
                            }
                            // res.status(200).send(user)
                }
                // res.status(200).send( `List Of Users `) //DB 생성 후 유저 추가 로직
            })
        
        this.app.route('/signIn')
        .post( async(req: express.Request, res: express.Response) => {
            const { email , password  } = req.body
            console.log( email , password );
            try{
                if( email && password ) {
                        const cryptoPassword = crypto.createHmac('sha256',secretKey.cryptoKey).update(password).digest('hex')
                        const user_ = await getManager().createQueryBuilder(User, "user").leftJoinAndSelect("user.carts", "carts").where("user.email = :email", { email }).getOne()
                        if(!user_) {
                            res.status(200).send({ msg: 'doNotExist' , token: '' }) 
                            return
                        }
                        if(user_.password === cryptoPassword){
                            const r = jwt.sign({id: user_.id ,email: user_.email , name:user_.name} , secretKey.jwtKey);
                            if(!r) {
                                res.status(200).send({ msg: 'signInFail' , token: '' }) //DB 생성 후 유저 추가 로직
                                return
                            }
                            res.status(200).send({ msg: 'signIn' , token: r, user_})
                        }
                        else {
                            res.status(200).send({ msg: 'passwordsDoNotMatch' , token: '' })
                        }
                }else {
                    res.status(200).send({ msg: 'emailAndPasswordDoNotEnter' , token: '' }) 
                }
            } catch(e) {
                res.status(200).send({ msg: e , token: '' })
            }
        })
        this.app.route('/user/:userId')
            .all( (req: express.Request, res: express.Response, next: express.NextFunction) => {//미들웨어 유저 인증 용도
                const token: string = req.headers['authorization']
                
                if(token) {
                    vertifyToken(token)
                    .then( r => {
                        if(r['id'] == req.params.userId) next();
                    })
                    
                }else{
                    res.status(200).send('본인이 아닙니다.');
                }
            })
            .get( async (req: express.Request, res: express.Response) => {
                const userId = req.params.userId
                let myPageData = {
                    user: undefined,
                    viewProductList: [],
                    orderInfo:undefined
                };
                const user = await getConnection().getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.orderInfo", "orderinfo").where("user.id = :id", { id: userId }).getOne();
                console.log(user)
                const productList = await  getConnection().getRepository(Product).find();
                // const orderInfo = await  getConnection().getRepository(OrderInfo).find({ relations: ["buyproduct"] });
               
                if(user.orderInfo.length>0){

                    const orderInfoNumber = user.orderInfo.reduce(( pre,cur )=> {
                        return pre.id > cur.id ? pre : cur;
                    })
                    const orderInfo =  await getConnection()
                .getRepository(OrderInfo)
                .createQueryBuilder("orderinfo")
                .leftJoinAndSelect("orderinfo.buyProduct", "buyproduct")
                .where("orderinfo.id = :id", { id: orderInfoNumber.id })
                .getOne();
                
                myPageData.orderInfo = orderInfo
            }
                
                
                myPageData.user = user
                productList.forEach( item => {
                    let idx = "" + item.id
                    if(user.viewRecentProduct.includes(idx)) {
                        myPageData.viewProductList.push(item)
                    }
                })
                console.log(myPageData)
                res.status(200).send(myPageData);
            })
            .post( async (req: express.Request, res: express.Response) => {
                const user = req.body;
                const cryptoPassword = crypto.createHmac('sha256',secretKey.cryptoKey).update(user.password).digest('hex')
                const updatedUser = await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({ 
                    password: cryptoPassword, 
                    address: user.address,
                    name: user.name,
                    tel: user.tel
                })
                .where("id = :id", { id: user.id })
                .execute();
                console.log(updatedUser)
                res.status(200).send(updatedUser);
            })
            .delete( (req: express.Request, res: express.Response) => {
                res.status(200).send(`DELETE requested for id ${req.params.userId}`);
            })

        this.app.route('/user/:userId/:productId')
            .get( async (req: express.Request, res: express.Response) => {
                const userId = req.params.userId
                const productId = req.params.productId
                try{   
                    if( !userId || !productId) {
                        throw new Error('Server Error');
                    }
                    // testFunc() {
                    //     let test1 = '1234'
                    //     let testInput = 2
                    //     let result = ''
                    
                    //     if(!test1.includes(''+testInput)) {
                    //       result += (testInput + test1.substring(1))
                    //       console.log(result);
                    //     }
                    //     else if (test1.includes(''+testInput)) {
                    //       const idx = test1.indexOf(''+testInput)
                    //       result = ''+testInput;
                    //       for(let i=0 ; i<4 ; i++) {
                    //         if(idx === i) continue
                    //         result += test1[i];
                    //       }
                    //       console.log(result);
                    //     }
                    //   }
                    const user = await getConnection().getRepository(User).createQueryBuilder("user").where("user.id = :id", { id: userId }).getOne();
                    if( user.viewRecentProduct.length < 4 && !user.viewRecentProduct.includes('' + productId)){
                        user.viewRecentProduct += req.params.productId
                        console.log(user.viewRecentProduct , productId)
                    }
                    else if ( user.viewRecentProduct.length < 4 && user.viewRecentProduct.includes('' + productId) ) {
                        const idx = user.viewRecentProduct.indexOf(''+productId)
                        let result = '' + productId;
                            for(let i=0 ; i < user.viewRecentProduct.length ; i++) {
                                if(idx === i) continue;
                                result += user.viewRecentProduct[i];
                            }
                            user.viewRecentProduct = result;
                        //       console.log(result);
                    }
                    else if ( user.viewRecentProduct.length === 4 ) {
                        if (user.viewRecentProduct.includes(''+productId)) {
                            const idx = user.viewRecentProduct.indexOf(''+productId)
                            let result = ''
                            result = ''+productId;
                            for(let i=0 ; i<4 ; i++) {
                                if(idx === i) continue
                                result += user.viewRecentProduct[i];
                            }
                            user.viewRecentProduct = result;
                        }
                        else {
                            let cloneResult = ''+productId
                            for(let i=0 ; i<4 ; i++) {
                                if(0 === i) continue
                                cloneResult += user.viewRecentProduct[i];
                            }
                            user.viewRecentProduct = cloneResult;
                        }
                    }
                        await getConnection().manager.save(user);
                        console.log(user.viewRecentProduct)
                        res.status(200).send(user);//DB 생성 후 유저 추가 로직
                } catch(e) {
                    res.status(200).send(e)//DB 생성 후 유저 추가 로직
                }
        })
            return this.app;
    }
}