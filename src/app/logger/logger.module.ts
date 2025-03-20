import { Global, Logger, Module, Provider } from '@nestjs/common';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from './interceptors/request-logger.interceptor';

const loggerProvider: Provider = {
  provide: Logger,
  useFactory: (configService: ConfigService) => {
    const level = configService.getOrThrow<LogLevel>('LOGGER_LEVEL', 'log');
    const logger = new Logger();
    logger.localInstance.setLogLevels?.([level]);
    return logger;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [
    loggerProvider,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
  exports: [loggerProvider],
})
export class LoggerModule {}
