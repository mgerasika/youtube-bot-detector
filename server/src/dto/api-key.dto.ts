import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface IApiKeyDto {
    email: string;

    youtube_key: string;

    expired: Date;
   
}

@Entity('api_key')
export class ApiKeyDto implements IApiKeyDto {
    @PrimaryColumn('text')
    email!: string;

    @Column({ nullable: false, type: 'text'})
    youtube_key!: string;

    @Column({ nullable: true, type: 'date'})
    expired!: Date;

    
    constructor(id: string) {
        this.email = id;
    }
}
