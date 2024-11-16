import { ILogger } from "./create-logger.utils";
import { IMemoryInfo } from "../model/memory-info.interface";

export function getMemoryInfo() : IMemoryInfo {
  const memoryUsage = process.memoryUsage();
  return {
      RSS: +`${(memoryUsage.rss / 1024 / 1024).toFixed(2)}`,
      heapTotal: +`${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}`,
      heapUsed: +`${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}`,
      external: +`${(memoryUsage.external / 1024 / 1024).toFixed(2)}`
  };
}

export function logMemoryUsage(logger: ILogger) {
  const memoryUsageJson = getMemoryInfo();
  logger.log(JSON.stringify(memoryUsageJson, null, 2));
}
