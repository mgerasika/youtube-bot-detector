export function getUniqueKeys<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.reduce((uniqueKeys, item) => {
    if (!uniqueKeys.includes(item[key])) {
      uniqueKeys.push(item[key]);
    }
    return uniqueKeys;
  }, [] as T[K][]);
}
