import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users";
import { CategoryMaster } from "./CategoryMaster";

// Amount, Category, Remark, Date ----- User based

@Entity()
export class Expense {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, user => user.id)
    @JoinColumn({name:'user_id'})
    user: Users;

    @Column('decimal', { precision: 6, scale: 2,default: 0.0 })  
    amount: number

    @ManyToOne(() => CategoryMaster, category => category.id)
    @JoinColumn({name:'category_id'})
    category: CategoryMaster
   
    @Column({nullable: true})
    remarks: string

    @Column({ type: "timestamp",  default: () => "CURRENT_TIMESTAMP(6)" })
    date: Date;

}


