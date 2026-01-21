import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { ProjectsModule } from './projects/projects.module';
import AuthController from './projects/auth.controllers';
import { ContactController } from './contact.controller'; 
import 'dotenv/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

   MailerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get<string>('SMTP_USER'),
        pass: configService.get<string>('SMTP_PASS'),
      },
    },
    defaults: {
      from: `"Digi Media Skill" <${configService.get<string>('SMTP_USER')}>`,
    },
  }),
}),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),

    ProjectsModule,
  ],
  controllers: [AuthController, ContactController],
})
export class AppModule {}
