import {Entity, PrimaryGeneratedColumn, Column ,OneToMany, OneToOne,  CreateDateColumn , UpdateDateColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { productList } from "../testData";
import {CartProduct} from './CartProduct'
import {User} from './User'
// 원격지 mysql의 버전이 5.5.6 , CreateDateColumn 사용불가

@Entity("carts")
export class Carts {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @OneToOne(type => User , user => user.carts)
    user: User;

    @OneToMany( type => CartProduct , cp => cp.cart, { onDelete: 'CASCADE' })
    cartProduct:CartProduct[];
}
