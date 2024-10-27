import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ChannelDto } from './channel.dto';
import { VideoDto } from './video.dto';

export interface ICommentDto {
    id: string;
    published_at: Date;
    published_at_time?: Date;
    author_id: string;
    video_id: string;
    text: string;
   
}

@Entity('comment')
export class CommentDto implements ICommentDto {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id!: string;

    @Column({ nullable: false, type: 'date'})
    published_at!: Date;

    @Column({ nullable: true, type: 'timestamptz'})
    published_at_time?: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Index()
    author_id!: string;

    @Column({ nullable: false, type: 'text'})
    text!: string;

    @Column({ type: 'varchar', length: 255 })
    @Index()
    video_id!: string;

    // Specify the foreign key column name for the relationship
    @ManyToOne(() => VideoDto, (video) => video.commentsDto, { nullable: false })
    @JoinColumn({ name: 'video_id', foreignKeyConstraintName: 'fk_video_id_constrain' }) // Specify the column name
    videoDto: VideoDto | undefined;

    // Specify the foreign key column name for the relationship
    // @ManyToOne(() => ChannelDto, (channel) => channel.commentsDto, { nullable: false })
    // @JoinColumn({ name: 'author_id' ,foreignKeyConstraintName: 'fk_author_id_constrain'}) // Specify the column name
    // authorDto: ChannelDto | undefined;

    constructor(id: string) {
        this.id = id;
    }
}
