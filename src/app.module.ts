import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnvs } from './configs/env.validation';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      envFilePath: ['.env'],
      cache: true,
      isGlobal: true,
      validate: validateEnvs,
    }),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
