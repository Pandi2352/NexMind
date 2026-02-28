import type { Message } from '../../types';
import { MessageRole } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isHuman = message.role === MessageRole.HUMAN;

  return (
    <div className={`flex ${isHuman ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isHuman
            ? 'bg-blue-600 text-white'
            : 'bg-white text-slate-900 border border-slate-200'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>
    </div>
  );
}
