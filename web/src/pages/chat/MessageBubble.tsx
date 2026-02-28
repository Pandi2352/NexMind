import type { Message } from '../../types';
import { MessageRole } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isHuman = message.role === MessageRole.HUMAN;

  return (
    <div className={`flex w-full ${isHuman ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] text-sm ${isHuman ? 'items-end' : 'items-start'}`}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
          {isHuman ? 'You' : 'AI'}
        </span>
        <div
          className={`px-5 py-4 w-full shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]  ${
            isHuman
              ? 'border-2 border-slate-900 bg-slate-900 text-white'
              : 'border-2 border-slate-900 bg-white text-slate-900'
          }`}
        >
          <p className={`whitespace-pre-wrap leading-relaxed ${isHuman ? 'font-medium' : 'font-normal'}`}>
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
