import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';

// Middleware to cache responses
export const memoryCache = (durationInSecconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = '__express__' + (req.originalUrl || req.url);
    const cachedBody = cache.get(key);

    if (cachedBody) {
      return res.send(cachedBody);
    } else {
      // Override res.send to cache the response
      const originalSend = res.send.bind(res);
      (res as any).send = (body: any) => {
        cache.put(key, body, durationInSecconds * 1000);
        originalSend(body);
      };
      next();
    }
  };
};


