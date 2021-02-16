import {Entity, PrimaryGeneratedColumn, Column , OneToOne ,JoinColumn , UpdateDateColumn, OneToMany} from "typeorm";
import { Carts } from './Carts'
import {OrderInfo} from './OrderInfo'
import {Product} from './Product'
// 원격지 mysql의 버전이 5.5.6 , CreateDateColumn 사용불가

type viewRecentProduct_type = [number,number,number,number];

@Entity("user")
export class User {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    name: string; // 이름

    @Column()
    age: number; // 나이

    @Column()
    address: string; // 주소
    
    @Column()
    tel: string; // 전번

    @Column()
    createdAt: Date; //가입 날짜
    
    @Column()
    updatedAt: Date; // 사용자 정보 수정 날짜 - 가장 최근만 표시하기로 결정
    
    @Column()
    password: string; // 사용자 비밀번호

    @Column()
    email: string; // 사용자 비밀번호

    @OneToOne ( type => Carts , cart => cart.id)
    @JoinColumn()
    carts:Carts;

    @OneToMany(type => OrderInfo, orderinfo => orderinfo.user)
    orderInfo: OrderInfo[];

    @Column({default:''}) // typeorm에서 mysql은 array 타입을 사용할 수 없음 
    viewRecentProduct: string; // 최근 본 상품 어레이대신 스트링으로
}
