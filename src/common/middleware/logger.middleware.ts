import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class loggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log(
    //   `${Date.now()} request method is ${req.method}, url is ${req.originalUrl}`,
    // );
    return next();
  }
}
