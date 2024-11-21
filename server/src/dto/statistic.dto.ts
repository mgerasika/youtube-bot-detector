import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne, } from 'typeorm';
import { ChannelDto, } from './channel.dto';

export interface IStatisticDto {
    channel_id: string;
    channel_url: string;
    comment_count: number;
    published_at?: Date;
    min_published_at?: Date;
    max_published_at?: Date;
    days_tick: number;
    published_at_diff: number;
    uploaded_at_time?: Date;
    frequency: number;
    frequency_tick: number;
    hash?:string;
}

@Entity('statistic')
export class StatisticDto implements IStatisticDto {
    @PrimaryColumn({ type: 'varchar', length: 255,  primaryKeyConstraintName:"pk_statistic_channel_id" })
    channel_id!: string;

    @OneToOne(() => ChannelDto)
    @JoinColumn({ name: 'channel_id' })
    channel!: ChannelDto;

    @Column({ type: 'varchar', length: 255 })
    channel_url!: string;

    @Column({ type: 'int' })
    comment_count!: number;

    @Column({ type: 'text', nullable: true })
    hash!: string  

    @Column({ type: 'timestamptz', nullable: true })
    uploaded_at_time!: Date

    @Column({ type: 'date', nullable: true })
    published_at!: Date;

    @Column({ type: 'date', nullable: true })
    min_published_at!: Date;

    @Column({ type: 'date', nullable: true })
    max_published_at!: Date;

    @Column({ type: 'int' })
    days_tick!: number;

    @Column({ type: 'int' })
    published_at_diff!: number;

    @Column({ type: 'float' })
    frequency!: number;

    @Column({ type: 'float' })
    frequency_tick!: number;

    constructor(id: string) {
        this.channel_id = id;
    }
}
