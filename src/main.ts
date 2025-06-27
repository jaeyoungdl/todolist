import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정
  app.enableCors({
    origin: '*', // 개발 중에는 모든 origin 허용
    credentials: true,
  });
  
  // Validation pipe 설정
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // API prefix 설정
  app.setGlobalPrefix('api');
  
  await app.listen(3001);
  console.log('🚀 Todo Backend API Server is running on http://localhost:3001');
}

bootstrap(); 