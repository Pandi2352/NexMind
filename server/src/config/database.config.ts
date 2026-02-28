import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseConfig: MongooseModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>(
      'MONGODB_URI',
      'mongodb://localhost:27017/ailearning',
    ),
  }),
  inject: [ConfigService],
};
