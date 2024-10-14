import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface ICommentDto {
    id: string;

    publishedAt: string;

    authorId: string;

    videoId: string;
   
}

@Entity('comment')
export class CommentDto implements ICommentDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'date'})
    publishedAt!: string;

    @Column({ nullable: false, type: 'text'})
    authorId!: string;

    @Column({ nullable: false, type: 'text'})
    videoId!: string;

    constructor(id: string) {
        this.id = id;
    }
}
