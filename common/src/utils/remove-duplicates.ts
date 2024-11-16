export function removeDuplicatesByKey<T, K extends keyof T>(array: T[], key: K): T[] {
    const uniqueKeys = new Set<T[K]>();
    return array.filter(item => {
      if (uniqueKeys.has(item[key])) {
        return false;
      } else {
        uniqueKeys.add(item[key]);
        return true;
      }
    });
  }
  