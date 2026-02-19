import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dns from 'dns';
import express from 'express';

async function bootstrap() {
  dns.setServers(['8.8.8.8', '8.8.4.4']);

  const app = await NestFactory.create(AppModule);

  // Increase payload size limits for file uploads (for Hostinger or VPS)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: [
      'https://digi-media-skill.vercel.app/',
      'https://digimediaskills.com',
      'http://localhost:5173',
      'https://digi-media-skill-backend.onrender.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
    ],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 API is live and accepting requests from Digi Media Frontend`);

  // Global error handler to log all errors to the terminal
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}
void bootstrap();
