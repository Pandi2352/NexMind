import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptOptimizerController } from './prompt-optimizer.controller.js';
import { PromptOptimizerService } from './prompt-optimizer.service.js';
import { LangchainModule } from '../langchain/langchain.module.js';
import {
  PromptOptimization,
  PromptOptimizationSchema,
} from './schemas/prompt-optimization.schema.js';

@Module({
  imports: [
    LangchainModule,
    MongooseModule.forFeature([
      { name: PromptOptimization.name, schema: PromptOptimizationSchema },
    ]),
  ],
  controllers: [PromptOptimizerController],
  providers: [PromptOptimizerService],
})
export class PromptOptimizerModule {}
