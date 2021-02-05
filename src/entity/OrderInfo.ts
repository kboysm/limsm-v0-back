import {Entity , BaseEntity, PrimaryGeneratedColumn, Column , CreateDateColumn , UpdateDateColumn} from "typeorm";

@Entity("orderinfo")
export class OrderInfo {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    destination: string; // 배송지

    @Column()
    name: string; // 이름

    @Column()
    tel: string; // 연락처
    
    @Column()
    createdAt: Date; //구입 일자
    
    @Column()
    updatedAt: Date; // 주문 정보 변경 일자
    
    @Column()
    payment: number; // 결제금액


}
