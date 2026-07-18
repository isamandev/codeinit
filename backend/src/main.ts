import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // All routes live under /api/v1, except /health which is hit directly
  // by the Docker healthcheck as an infra probe, not a client API call.
  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger UI is served outside the /api/v1 versioned route tree, at /api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CodeInit API')
    .setDescription('REST API documentation for the CodeInit backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);

  console.log(`✅ Backend running on http://localhost:${port}`);
  console.log(`📋 CORS enabled for ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start backend:', err);
  process.exit(1);
});
