import { Module } from '@nestjs/common';
import { AppService } from './health/app.service';
import { ConfigModule } from './envs/config.module';
import { AppController } from './health/app.controller';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
