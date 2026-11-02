import React from 'react';
import { Bot, User as UserIcon } from 'lucide-react';

export interface MessageItem {
  id?: string;
  sender: 'user' | 'bot';
  text: string;
  role?: string;
  timestamp?: string;
  sources?: any[];
}

interface ChatMessageProps {
  message: MessageItem;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Format simple markdown bold and lists cleanly
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Handle bold tags **text**
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <div key={idx} className={line.startsWith('- ') ? 'pl-2 text-slate-700 font-normal' : ''}>
          {formattedParts}
        </div>
      );
    });
  };

  return (
    <div className={`flex items-start space-x-2.5 my-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
        isUser ? 'bg-cyan-600 text-white' : 'bg-teal-600 text-white'
      }`}>
        {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
        isUser
          ? 'bg-teal-600 text-white font-medium rounded-tr-none'
          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
      }`}>
        {renderFormattedText(message.text)}

        {message.timestamp && (
          <div className={`text-[10px] mt-1.5 ${isUser ? 'text-teal-100 text-right' : 'text-slate-400 text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};
