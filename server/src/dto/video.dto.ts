import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface IVideoDto {
    id: string;

    published_at: Date;

    channel_id: string;

    title: string;
   
}

@Entity('video')
export class VideoDto implements IVideoDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'date'})
    published_at!: Date;

    @Column({ nullable: false, type: 'text'})
    channel_id!: string;

    @Column({ nullable: false, type: 'text'})
    title!: string;

    constructor(id: string) {
        this.id = id;
    }
}
