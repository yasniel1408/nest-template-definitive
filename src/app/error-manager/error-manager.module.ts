import { Global, Module } from '@nestjs/common';
import { ErrorManagerFilter } from './filters/error-manager.filter';

@Global()
@Module({
  providers: [
    ErrorManagerFilter,
    {
      provide: 'APP_FILTER',
      useClass: ErrorManagerFilter,
    },
  ],
  exports: [ErrorManagerFilter],
})
export class ErrorManagerModule {}
