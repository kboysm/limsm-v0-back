import {Entity, PrimaryGeneratedColumn, Column , CreateDateColumn , UpdateDateColumn} from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    name: string; // 이름

    @Column()
    age: number; // 나이

    @Column()
    address: string; // 주소
    
    @CreateDateColumn({ name : 'created_at'})
    createdAt: Date; //가입 날짜
    
    @UpdateDateColumn({ name : 'updated_at'})
    updatedAt: Date; // 사용자 정보 수정 날짜 - 가장 최근만 표시하기로 결정
    
    @Column()
    password: string; // 사용자 비밀번호

    @Column()
    email: string; // 사용자 비밀번호



}
