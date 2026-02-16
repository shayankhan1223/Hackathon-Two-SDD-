import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { ChatMessage } from '@/lib/types';

export function useChat(initialThreadId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.chat.history();
      setMessages(res.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat history');
      console.error('Error loading chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const sendMessage = async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };

      // Optimistically add the user message
      setMessages(prev => [...prev, userMessage]);

      // Send the message to the API
      const res = await api.chat.send(content, threadId);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: res.response,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);

      // Add error message to the chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setThreadId(undefined);
  };

  const createNewThread = () => {
    setMessages([]);
    setThreadId(undefined);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    createNewThread,
    loadHistory,
    threadId,
  };
}
