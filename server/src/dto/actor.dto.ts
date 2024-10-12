import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export interface IActorDto {
    id: string;

    name: string;
}

@Entity('actor')
export class ActorDto implements IActorDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, type: 'text', unique: true })
    name!: string;

    constructor(id: string) {
        this.id = id;
    }
}
