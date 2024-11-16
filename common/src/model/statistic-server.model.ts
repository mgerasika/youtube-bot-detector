
export interface IStatisticServerTestBody {
}

export interface IUploadStatisticBody {
    channel_id: string;
    channel_url: string;
    comment_count: number;
    published_at?: Date;
    uploaded_at_time?: Date;
    min_published_at?: Date;
    max_published_at?: Date;
    days_tick: number;
    published_at_diff: number;
    frequency: number;
    frequency_tick: number;
}

export interface IStatisticServerTestBody {
}

export interface IFirebaseBody {
    comment_count: number, 
    published_at_diff: number, 
    days_tick: number, 
    frequency:number, 
    frequency_tick:number
}

export const deserealizeFirebaseBody = (numbers: number[]) : IFirebaseBody => {
    const [comment_count, published_at_diff, days_tick, frequency, frequency_tick] = numbers;
    return {
        comment_count, published_at_diff, days_tick, frequency, frequency_tick
    }

}
export const serializeFirebaseBody = ({comment_count, published_at_diff, days_tick, frequency, frequency_tick}: IFirebaseBody): number[] => {
    return [comment_count, published_at_diff, days_tick, frequency, frequency_tick]
}

export interface IFirebaseFile {
    v: 'v1';
    b: number[];
}