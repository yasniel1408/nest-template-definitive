import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { ErrorResponse } from '../types/ErrorResponse';

@Catch()
export class ErrorManagerFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorManagerFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'Internal server error';
    const errorType = exception.errorType || 'UnhandledError';

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      errorType,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(JSON.stringify(errorResponse));

    response.status(status).send(errorResponse);
  }
}