import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SummarizerController } from './summarizer.controller.js';
import { SummarizerService } from './summarizer.service.js';
import { LangchainModule } from '../langchain/langchain.module.js';
import { Summary, SummarySchema } from './schemas/summary.schema.js';

@Module({
  imports: [
    LangchainModule,
    MongooseModule.forFeature([
      { name: Summary.name, schema: SummarySchema },
    ]),
  ],
  controllers: [SummarizerController],
  providers: [SummarizerService],
})
export class SummarizerModule {}
