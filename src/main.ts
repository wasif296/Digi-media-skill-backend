import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'https://digi-media-skill.vercel.app/'
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 API is live and accepting requests from Digi Media Frontend`);
}
bootstrap();