import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiProviderController } from './ai-provider.controller';
import { AiProviderService } from './ai-provider.service';
import { AiProvider, AiProviderSchema } from './schemas/ai-provider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiProvider.name, schema: AiProviderSchema },
    ]),
  ],
  controllers: [AiProviderController],
  providers: [AiProviderService],
  exports: [AiProviderService],
})
export class AiProviderModule {}
