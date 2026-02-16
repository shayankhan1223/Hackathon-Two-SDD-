'use client';

import { useEffect, useState } from 'react';
import { X, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatPanel from '@/components/chat/ChatPanel';

interface AIChatSlideInProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatSlideIn({ isOpen, onClose }: AIChatSlideInProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/30 z-20 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="AI Assistant"
        className={cn(
          'fixed z-30 bg-white dark:bg-gray-900 shadow-xl flex flex-col transition-transform duration-300',
          isMobile
            ? 'inset-x-0 bottom-0 h-[85vh] rounded-t-2xl'
            : 'right-0 top-0 h-full w-96 border-l border-gray-200 dark:border-gray-700',
          isOpen
            ? 'translate-x-0 translate-y-0'
            : isMobile
              ? 'translate-y-full'
              : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close AI panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          <ChatPanel mode="embedded" />
        </div>

        {/* Mobile drag handle */}
        {isMobile && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}
      </div>
    </>
  );
}
