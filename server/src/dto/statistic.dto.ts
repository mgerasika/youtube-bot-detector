import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface IStatisticDto {

   
}

@Entity('statistic')
export class StatisticDto implements IStatisticDto {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    author_id!: string;

    @Column({ nullable: false, type: 'numeric'})
    total_comment_count!:number;

    @Column({ nullable: false, type: 'date'})
    last_modified!: Date;
}

export interface IStatisticPerChannelDto {

   
}

@Entity('statistic_per_channel')
export class StatisticPerChannelDto implements IStatisticPerChannelDto {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    channel_id!: string;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    author_id!: string;

    @Column({ nullable: false, type: 'numeric'})
    comment_count!:number;

    @Column({ nullable: false, type: 'date'})
    first_video_published_at!: Date;

    @Column({ nullable: false, type: 'date'})
    last_video_published_at!: Date;
}
