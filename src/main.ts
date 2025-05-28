import { NestFactory } from '@nestjs/core';
import { corsConfig } from './common/configs/cors.config';
import { setupSwagger } from './common/configs/swagger.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  setupSwagger(app);
  app.enableCors(corsConfig);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
