import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AiProviderModule } from './ai-provider/ai-provider.module';
import { ChatModule } from './chat/chat.module';
import { TranslatorModule } from './translator/translator.module';
import { AgentConfigModule } from './agent-config/agent-config.module';
import { SummarizerModule } from './summarizer/summarizer.module';
import { PromptOptimizerModule } from './prompt-optimizer/prompt-optimizer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync(databaseConfig),
    AiProviderModule,
    ChatModule,
    TranslatorModule,
    SummarizerModule,
    PromptOptimizerModule,
    AgentConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
