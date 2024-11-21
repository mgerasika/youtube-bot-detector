import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, } from 'typeorm';

export interface IApiKeyDto {
    email: string;

    youtube_key: string;

    expired?: Date;

    status: string;
   
}

@Entity('api_key')
export class ApiKeyDto implements IApiKeyDto {
    @Column({ nullable: false, type: 'text'})
    email!: string;
    
    @PrimaryColumn({type:'text', name: 'youtube_key', nullable: false, primaryKeyConstraintName:"pk_youtube_key_id"})
    youtube_key!: string;

    @Column({ nullable: true, type: 'text'})
    status!: string;

    @Column({ nullable: true, type: 'timestamptz'})
    expired!: Date;

    
    constructor(id: string) {
        this.email = id;
    }
}
