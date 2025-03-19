import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const swaggerConfig = (app) => {
    const options = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
}