import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);

  console.log(`✅ Backend running on http://localhost:${port}`);
  console.log(`📋 CORS enabled for ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start backend:', err);
  process.exit(1);
});
