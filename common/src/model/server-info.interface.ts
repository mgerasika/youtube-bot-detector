import { IMemoryInfo } from "./memory-info.interface";

export interface IServerInfo {
    serverName: string;
    memory: IMemoryInfo;
    ipV4: string;
}