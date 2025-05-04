import {
  CallHandler,
  ExecutionContext,
  HttpException,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, tap } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw error;
        }
        // console.log(error);
        const errRes = {
          error: error.message,
          stack: error.stack,
          statusCode: 500,
        };
        throw new InternalServerErrorException(errRes);
      }),
    );
  }
}
