import {Entity, PrimaryGeneratedColumn, Column , ManyToOne ,JoinColumn , UpdateDateColumn, OneToMany} from "typeorm";
import {User} from './User'

@Entity("question")
export class Question {

    @PrimaryGeneratedColumn()
    id: number; // pk

    @Column()
    contentName: string; // 이름

    @Column()
    createdAt: Date; //가입 날짜
    
    @Column()
    updatedAt: Date; // 사용자 정보 수정 날짜 - 가장 최근만 표시하기로 결정
    
    // user onetomany , question manytoone으로 연결 product까지는 연결 안해도 될거같음
    @ManyToOne(type => User , user => user.id  )
    @JoinColumn()
    user: User;
}
