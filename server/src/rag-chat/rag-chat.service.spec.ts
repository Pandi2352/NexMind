import { Test, TestingModule } from '@nestjs/testing';
import { RagChatService } from './rag-chat.service';

describe('RagChatService', () => {
  let service: RagChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RagChatService],
    }).compile();

    service = module.get<RagChatService>(RagChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
