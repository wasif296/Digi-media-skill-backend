import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { ProjectsModule } from './projects/projects.module';
import AuthController from './projects/auth.controllers';
import { ContactController } from './contact.controller'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, 
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"Digi Media Skill" <${config.get('SMTP_USER')}>`,
        },
      }),
    }),
    
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    
    ProjectsModule,
  ],
  controllers: [AuthController, ContactController], 
  providers: [],
})
export class AppModule {}