export interface ICollection<T> {
    total_count:number;
    page:number;
    items: T[];
}