import { NestFactory } from '@nestjs/core';
import { corsConfig } from './common/configs/cors.config';
import { setupSwagger } from './common/configs/swagger.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  setupSwagger(app);
  app.enableCors(corsConfig);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
