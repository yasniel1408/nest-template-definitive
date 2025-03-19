import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';

@Module({
imports: [
    AxiosHttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
        headers: {
            'Content-Type': 'application/json',
        },
        responseType: 'json',
    }),
    ],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}