import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface IChannelDto {
    id: string;

    published_at: Date;

    video_count: number;

    viewCount: number;

    subscriber_count: number;

    title: string;

    custom_url: string;
}

@Entity('channel')
export class ChannelDto implements IChannelDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'text'})
    title!: string;

    @Column({ nullable: false, type: 'text'})
    custom_url!: string;

    @Column({ nullable: false, type: 'date'})
    published_at!: Date;

    @Column({ nullable: false, type: 'numeric'})
    video_count!: number;

    @Column({ nullable: false, type: 'numeric'})
    viewCount!: number;

    @Column({ nullable: false, type: 'numeric'})
    subscriber_count!: number;

    constructor(id: string) {
        this.id = id;
    }
}
