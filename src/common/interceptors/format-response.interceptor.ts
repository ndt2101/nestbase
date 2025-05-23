import { CallHandler, ExecutionContext, Injectable, NestInterceptor  } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(value => {
        value = (value) ? value : []
        return { 
            statusCode: context.switchToHttp().getResponse().statusCode,
            data: value
        };
      }));
  }
}