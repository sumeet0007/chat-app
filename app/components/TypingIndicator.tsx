'use client';

import { useEffect, useState } from 'react';
import { socketManager } from '../lib/socketManager';

interface TypingIndicatorProps {
  friendId: string;
  friendEmail: string;
}

export default function TypingIndicator({ friendId, friendEmail }: TypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    socketManager.on('typing', (data) => {
      if (data.from === friendId) {
        setIsTyping(true);
        
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
        
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        
        setTypingTimeout(timeout);
      }
    });

    return () => {
      socketManager.off('typing');
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [friendId, typingTimeout]);

  if (!isTyping) return null;

  return (
    <div className="px-4 py-2 text-sm text-[#dcddde]">
      <span className="inline-flex items-center">
        <span className="mr-2">{friendEmail.split('@')[0]}</span>
        <span className="flex space-x-1">
          <span className="w-1 h-1 bg-[#dcddde] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-1 bg-[#dcddde] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-1 bg-[#dcddde] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </span>
        <span className="ml-2">is typing...</span>
      </span>
    </div>
  );
}