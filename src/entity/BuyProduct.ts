import {Entity , BaseEntity,ManyToOne, PrimaryGeneratedColumn, Column ,JoinColumn, CreateDateColumn , UpdateDateColumn} from "typeorm";
import { Product } from './Product'
import { OrderInfo } from './OrderInfo'
@Entity("buyproduct")
export class BuyProduct extends Product {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    purchaseQuantity: number;

    @ManyToOne(type => OrderInfo , orderProduct => orderProduct.id  )
    @JoinColumn()
    orderInfo: OrderInfo;
}
