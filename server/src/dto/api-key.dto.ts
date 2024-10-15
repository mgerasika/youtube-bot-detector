import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface IApiKeyDto {
    email: string;

    youtube_key: string;

   
}

@Entity('api_key')
export class ApiKeyDto implements IApiKeyDto {
    @PrimaryColumn('text')
    email!: string;

    @Column({ nullable: false, type: 'text'})
    youtube_key!: string;

    
    constructor(id: string) {
        this.email = id;
    }
}
