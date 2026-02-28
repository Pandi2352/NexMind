import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TranslatorController } from './translator.controller.js';
import { TranslatorService } from './translator.service.js';
import { LangchainModule } from '../langchain/langchain.module.js';
import {
  Translation,
  TranslationSchema,
} from './schemas/translation.schema.js';

@Module({
  imports: [
    LangchainModule,
    MongooseModule.forFeature([
      { name: Translation.name, schema: TranslationSchema },
    ]),
  ],
  controllers: [TranslatorController],
  providers: [TranslatorService],
})
export class TranslatorModule {}
