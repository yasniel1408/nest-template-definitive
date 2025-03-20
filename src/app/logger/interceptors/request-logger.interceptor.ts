import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.configService.get('NODE_ENV') !== 'dev') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const now = Date.now();

    this.logger.log('🚀----------START---------🚀', `[${request.method}] -> `  + request.url);
    this.logger.log({
      Body: request.body,
      'QueryParams': request.query
    }, 'REQUEST');
    return next.handle().pipe(
      tap((response) => {
        this.logger.log({
          'Status': context.switchToHttp().getResponse().statusCode,
          'ResponseBody': response
        }, 'RESPONSE');
      }),
      finalize(() => {
        this.logger.log('✅--------------END-------------✅', ` TIME: ${Date.now() - now}ms`,);
      }),
    );
  }
}