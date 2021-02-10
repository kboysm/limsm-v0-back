import {Entity, PrimaryGeneratedColumn, Column , OneToOne,  CreateDateColumn , UpdateDateColumn, JoinColumn, ManyToOne} from "typeorm";
import {Product} from './Product'
import {User} from './User'
// 원격지 mysql의 버전이 5.5.6 , CreateDateColumn 사용불가

@Entity("cartproduct")
export class CartProduct {

    @PrimaryGeneratedColumn()
    cartId: number; // pk

    @OneToOne( type => Product)
    @JoinColumn()
    product:Product;

    @Column()
    purchaseQuantity: number;

    @ManyToOne(type => User , user => user.carts)
    user: User;
}
