import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface ICommentDto {
    id: string;

    published_at: Date;

    author_id: string;

    video_id: string;

    text: string;
   
}

@Entity('comment')
export class CommentDto implements ICommentDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'date'})
    published_at!: Date;

    @Column({ nullable: false, type: 'text'})
    author_id!: string;

    @Column({ nullable: false, type: 'text'})
    text!: string;

    @Column({ nullable: false, type: 'text'})
    video_id!: string;

    constructor(id: string) {
        this.id = id;
    }
}
