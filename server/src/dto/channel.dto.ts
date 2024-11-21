import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, } from 'typeorm';
import { CommentDto, } from './comment.dto';
import { VideoDto, } from './video.dto';

export interface IChannelDto {
    id: string;

    published_at: Date;

    video_count: number;

    view_count: number;

    subscriber_count: number;

    title: string;

    author_url: string;

    is_scannable?:boolean;

    is_deleted?:boolean;
}

@Entity('channel')
export class ChannelDto implements IChannelDto {
    @PrimaryColumn({ type: 'varchar', length: 255,  primaryKeyConstraintName:"pk_channel_id"  })
    id!: string;

    @Column({ nullable: false, type: 'text'})
    title!: string;

    @Column({ nullable: false, type: 'text'})
    author_url!: string;

    @Column({ nullable: false, type: 'date'})
    published_at!: Date;

    @Column({ nullable: false, type: 'numeric'})
    video_count!: number;

    @Column({ nullable: true, type: 'boolean'})
    is_scannable!: boolean;

    @Column({ nullable: true, type: 'boolean'})
    is_deleted!: boolean;

    @Column({ nullable: false, type: 'numeric'})
    view_count!: number;

    @Column({ nullable: false, type: 'numeric'})
    subscriber_count!: number;

    // One Channel can have many Videos
    @OneToMany(() => VideoDto, (video) => video.channelDto)
    videosDto?: VideoDto[] ;

    // One Channel can have many Comments
    @OneToMany(() => CommentDto, (comment) => comment.authorDto)
    commentsDto?: CommentDto[] ;

    constructor(id: string) {
        this.id = id;
    }
}
