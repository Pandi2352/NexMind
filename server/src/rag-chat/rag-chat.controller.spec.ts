import { Test, TestingModule } from '@nestjs/testing';
import { RagChatController } from './rag-chat.controller';

describe('RagChatController', () => {
  let controller: RagChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RagChatController],
    }).compile();

    controller = module.get<RagChatController>(RagChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
