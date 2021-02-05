import { CommonRoutesConfig } from '../common/common.routes.config';
import { User } from "../entity/User";
// import { myConnection } from '../connection/index'
import * as express from 'express'
import {getConnection, getRepository, getConnectionManager , createConnection , getManager } from 'typeorm'
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
                                await getConnection().createQueryBuilder().insert().into(User).values(
                                    newUser
                                ).execute().then( r=> {
                                    res.status(200).send('signUp')
                                }).catch(e => {
                                    res.status(200).send( 'signUpFail' ) //DB 생성 후 유저 추가 로직
                                });
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
                        const user_ = await getManager().createQueryBuilder(User, "user").where("user.email = :email", { email }).getOne()
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
            .get( (req: express.Request, res: express.Response) => {
                console.log('get 진입')
                res.status(200).send(`GET requested for id${req.params.userId}`);
            })
            // .post( (req: express.Request, res: express.Response) => {
            //     res.status(200).send(`Post requested for id ${req.params}`);
            // })
            // .put( (req: express.Request, res: express.Response) => {
            //     res.status(200).send(`PUT requested for id ${req.params.userId}`);
            // })
            // .patch( (req: express.Request, res: express.Response) => {
            //     res.status(200).send(`PATCH requested for id ${req.params.userId}`);
            // })
            .delete( (req: express.Request, res: express.Response) => {
                res.status(200).send(`DELETE requested for id ${req.params.userId}`);
            })

            return this.app;
    }
}