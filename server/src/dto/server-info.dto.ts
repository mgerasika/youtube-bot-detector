import { IMemoryInfo } from '@common/model/memory-info.interface';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, } from 'typeorm';

export interface IServerInfoDto {
    id: string;
    name: string;
    ip:string;
    memory_info:IMemoryInfo;
    updated_at_time?: Date;
}

@Entity('server_info')
export class ServerInfoDto implements IServerInfoDto {
    @PrimaryColumn({ type: 'varchar', length: 255,  primaryKeyConstraintName:"pk_server_info_id" })
    id!: string;
    
    @Column({ nullable: true, type: 'text'})
    name!: string;

    @Column({ nullable: true, type: 'text'})
    ip!: string;

    @Column({ nullable: true, type: 'jsonb'})
    memory_info!: IMemoryInfo;

    @Column({ nullable: true, type: 'timestamptz'})
    updated_at_time?: Date;
   
}
