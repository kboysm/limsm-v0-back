import {Entity , BaseEntity, PrimaryGeneratedColumn, Column , CreateDateColumn , UpdateDateColumn} from "typeorm";

@Entity()
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    name: string; // 상품명

    @Column()
    description: string; // 상품 설명

    @Column()
    quantity: number; // 제품 수량
    
    @Column()
    grade: number; // 평점 총점
    
    @Column()
    salesQuantity: number; // 판매수량
    
    @Column()
    price: number; // 결제금액

    @CreateDateColumn({ name : 'created_at'})
    createdAt: Date; //상품 등록일
    
    @UpdateDateColumn({ name : 'updated_at'})
    updatedAt: Date; // 상품 업데이트 날짜
}
