'use client';

import { Bot, User } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isStreaming?: boolean;
}

export function ChatMessage({ content, role, timestamp, isStreaming = false }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl p-4',
          role === 'user'
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
        )}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        <div
          className={cn(
            'mt-2 text-xs',
            role === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {formatDate(timestamp)}
        </div>

        {isStreaming && role === 'assistant' && (
          <div className="flex space-x-1 mt-2">
            <div className="h-1 w-1 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="h-1 w-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-1 w-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
}
