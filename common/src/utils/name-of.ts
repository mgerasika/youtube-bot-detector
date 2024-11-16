export function nameOf<T>(name: keyof T): string {
    return name as string;
}