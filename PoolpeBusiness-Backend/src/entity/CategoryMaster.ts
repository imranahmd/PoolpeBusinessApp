import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm"

@Entity()
export class CategoryMaster {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}


