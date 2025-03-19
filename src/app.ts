import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app/app.module";
import { ConfigService } from "@nestjs/config";

export const App = async() => {
    const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    return {app, configService};
}