import {Entity , BaseEntity,ManyToOne, PrimaryGeneratedColumn, Column ,OneToMany, CreateDateColumn , UpdateDateColumn} from "typeorm";
import { Product } from './Product'
import { Carts } from './Carts'
@Entity("cartproduct")
export class CartProduct extends Product {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    purchaseQuantity: number;

    @ManyToOne(type => Carts , cart => cart.id)
    cart: Carts;
}
