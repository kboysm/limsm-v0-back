import { ClientRequest } from "http";
import {Entity , BaseEntity,ManyToOne, PrimaryGeneratedColumn, Column ,OneToMany, JoinColumn , UpdateDateColumn} from "typeorm";
import {User} from './User'
import {Product} from './Product'

@Entity("productreview")
export class ProductReview {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    imgUrl: string; // 이미지

    @Column()
    title: string;

    @ManyToOne(type => User, user => user.id)
    user: User;
    
    @ManyToOne(type => Product, product => product.id)
    product: Product;

    @Column()
    content: string;

    @Column()
    createAt: Date;

    @Column()
    updatedAt: Date;


}
