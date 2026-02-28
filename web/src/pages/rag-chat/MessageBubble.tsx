import type { Message } from '../../types';
import { MessageRole } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isHuman = message.role === MessageRole.HUMAN;

  return (
    <div className={`flex gap-3 ${isHuman ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isHuman
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            : 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white'
        }`}
      >
        {isHuman ? 'U' : 'AI'}
      </div>
      <div className={`max-w-[75%] ${isHuman ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isHuman
              ? 'rounded-tr-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
              : 'rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-sm'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
