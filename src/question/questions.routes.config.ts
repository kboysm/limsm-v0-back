import { CommonRoutesConfig } from '../common/common.routes.config';
import { Question } from "../entity/Questions";
import { CartProduct } from "../entity/CartProduct";
import { BuyProduct } from "../entity/BuyProduct";
import { OrderInfo } from "../entity/OrderInfo";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
import moment from 'moment'
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
                    const questionList = await  getConnection().getRepository(Question).find({ relations: ["user"] });
                    res.status(200).send(questionList)
                } catch(e) {
                    res.status(200).send(e)
                }
            })
            this.app.route('/question/:questionId')
            .get( async (req: express.Request, res: express.Response) => {
                try{
                    const questionId = req.params.questionId
                    const questionArticle = await  getConnection().getRepository(Question).createQueryBuilder("question").where("question.id = :id", { id: questionId }).getOne();
                    const path_ = process.env.NODE_ENV === 'development' ? 'src' : 'dist'
                    // console.log(questionArticle.contentName)
                    fs.readFile(`./${path_}/fileStorage/${questionArticle.contentName}.txt`,'utf8',(err,data) => {
                        if(err) {
                            res.status(500).send(err)
                        }
                        res.status(200).send(data)
                    });
                } catch(e) {
                    res.status(500).send(e)
                }
            })
            this.app.route('/question/user/:userId')
            .get( async (req: express.Request, res: express.Response) => {
                try{
                    const userId = req.params.userId
                    const user = await getConnection().getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.Question", "orderinfo").where("user.id = :id", { id: userId }).getOne();
                    const result = []
                    const path_ = process.env.NODE_ENV === 'development' ? 'src' : 'dist'
                    // console.log(questionArticle.contentName)
                    for( let i=0 ; i<user.Question.length ; i++) {
                       const data = fs.readFileSync(`./${path_}/fileStorage/${user.Question[i].contentName}.txt`,'utf8');
                       result.push(data);
                    }
                            // res.status(500).send(err)
                        res.status(200).send(result)
                } catch(e) {
                    res.status(500).send(e)
                }
            })
        this.app.route('/question/:productId/:userId')
        .post( async (req: express.Request, res: express.Response) => {
            const productId = req.params.productId
            const product = await  getConnection().getRepository(Product)
                .createQueryBuilder("product")
                .where("product.id = :id", { id: productId }).getOne();
            const userId = req.params.userId
            const user = await getConnection().getRepository(User).createQueryBuilder("user").where("user.id = :id", { id: userId }).getOne();
            const content = req.body.content
            const createdAt = new Date();
            const title = product.name.replace(/ /gi, '') +'_lsm_'+ moment(createdAt).format('YYMMDD_hhmmss') +'_lsm_'+ userId +'_lsm_'
            try{   
                const question = new Question();
                question.contentName = title
                question.createdAt = createdAt
                question.updatedAt = createdAt
                question.user = user
                
                fs.writeFile(`./src/fileStorage/${title}.txt` , content ,async ( err ) => {
                    if(err) {
                        console.log(err)
                        throw new Error('fileError')
                    }
                    console.log(title+' created!')
                    await getConnection().manager.save(question);
                })
                res.status(200).send('asdasd')
                
            } catch(e) {
                res.status(200).send(e)
            }
        })
            return this.app;
    }
}