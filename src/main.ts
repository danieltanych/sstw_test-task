import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальна валідація
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Видаляє поля, які не описані в DTO
      forbidNonWhitelisted: true, // Повертає помилку при наявності зайвих полів
      transform: true, // Автоматичне перетворення типів
    }),
  );

  // Глобальна аутентифікація
  app.useGlobalGuards(new AuthGuard());

  // Налаштування Swagger
  const config = new DocumentBuilder()
    .setTitle('SSTW Test Task API')
    .setDescription('API документація для тестового завдання')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter Bearer token',
        in: 'header',
      },
      'bearer',
    )
    .addTag('employers', 'Операції з роботодавцями')
    .addTag('jobs', 'Операції з вакансіями')
    .addTag('workers', 'Операції з працівниками')
    .addTag('health', 'Health check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
  console.log(`🔐 Bearer Token: sstw-secret-token-2024-nestjs-api`);
}

void bootstrap();
