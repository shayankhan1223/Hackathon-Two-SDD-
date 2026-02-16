'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import ChatPanel from '@/components/chat/ChatPanel';

export default function ChatPage() {
  const [taskChangeTrigger, setTaskChangeTrigger] = useState(0);

  const handleTaskChange = () => {
    // Trigger a refresh of related components by updating a counter
    setTaskChangeTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Chat Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Talk to our AI to manage your tasks naturally
        </p>
      </div>

      <Card className="h-[calc(100vh-200px)] flex">
        <ChatPanel key={taskChangeTrigger} onTaskChange={handleTaskChange} />
      </Card>
    </div>
  );
}
