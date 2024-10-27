export function getUniqueKeys<T, K extends keyof T>(arr: T[], key: K): T[K][] {
    const uniqueKeys = new Set<T[K]>();
    arr.forEach(item => uniqueKeys.add(item[key]));
    return Array.from(uniqueKeys);
  }