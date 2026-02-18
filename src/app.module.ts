import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProjectsModule } from './projects/projects.module';
import AuthController from './projects/auth.controllers';
import { ContactController } from './contact.controller';
import { CloudinaryProvider } from './cloudinary';
import { validate } from './env.validation';
import 'dotenv/config';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
          connectionTimeout: 5000,
          socketTimeout: 5000,
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

    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),

    ProjectsModule,
  ],
  controllers: [AuthController, ContactController, ProfileController],
  providers: [CloudinaryProvider, ProfileService],
})
export class AppModule {}
