import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

export class ResponseMappingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      //   tap((res) => console.log('response before edit', res)),
      map((res) => ({
        success: true,
        time: new Date(),
        data: res.data || [],
        message: res.message || '',
      })),
      //   tap((res) => console.log('response after edit', res)),
    );
  }
}
