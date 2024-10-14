import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface IVideoDto {
    id: string;

    publishedAt: string;

    authorId: string;

    title: string;
   
}

@Entity('video')
export class VideoDto implements IVideoDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'date'})
    publishedAt!: string;

    @Column({ nullable: false, type: 'text'})
    authorId!: string;

    @Column({ nullable: false, type: 'text'})
    title!: string;

    constructor(id: string) {
        this.id = id;
    }
}
