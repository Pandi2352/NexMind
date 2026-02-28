import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import { LangchainModule } from '../langchain/langchain.module.js';
import {
  HealthConsultation,
  HealthConsultationSchema,
} from './schemas/health-consultation.schema.js';

@Module({
  imports: [
    LangchainModule,
    MongooseModule.forFeature([
      { name: HealthConsultation.name, schema: HealthConsultationSchema },
    ]),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
