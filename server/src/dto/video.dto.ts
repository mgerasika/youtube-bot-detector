import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, ManyToOne, JoinColumn, Index, } from 'typeorm';
import { CommentDto, } from './comment.dto';
import { ChannelDto, } from './channel.dto';

export interface IVideoDto {
    id: string;

    published_at: Date;
    published_at_time?: Date;

    channel_id: string;

    title: string;
   
}

@Entity('video')
export class VideoDto implements IVideoDto {
    @PrimaryColumn({ type: 'varchar', length: 255, primaryKeyConstraintName:"pk_video_id" })
    id!: string;

    @Column({ nullable: false, type: 'date'})
    published_at!: Date;

    @Column({ nullable: true, type: 'timestamptz'})
    published_at_time?: Date;

    @Column({ type: 'varchar', length: 255 })
    channel_id!: string;

    @Column({ nullable: false, type: 'text'})
    @Index()
    title!: string;

    // Specify the foreign key column name for the relationship
    @ManyToOne(() => ChannelDto, (channel) => channel.videosDto, { nullable: false })
    @JoinColumn({ name: 'channel_id', foreignKeyConstraintName: 'fk_channel_id_constrain' }) // Specify the column name
    channelDto?: ChannelDto ;
    
    // One Video can have many Comments
    @OneToMany(() => CommentDto, (comment) => comment.videoDto)
    commentsDto?: CommentDto[];
    

    constructor(id: string) {
        this.id = id;
    }
}
