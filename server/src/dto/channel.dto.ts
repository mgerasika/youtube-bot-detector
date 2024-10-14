import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface IChannelDto {
    id: string;

    publishedAt: string;

    videoCount: number;

    viewCount: number;

    subscriberCount: number;
}

@Entity('chanel')
export class ChannelDto implements IChannelDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'date'})
    publishedAt!: string;

    @Column({ nullable: false, type: 'numeric'})
    videoCount!: number;

    @Column({ nullable: false, type: 'numeric'})
    viewCount!: number;

    @Column({ nullable: false, type: 'numeric'})
    subscriberCount!: number;

    constructor(id: string) {
        this.id = id;
    }
}
