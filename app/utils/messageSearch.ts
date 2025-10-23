import { Message } from '../types';
import { createElement, Fragment } from 'react';

export interface SearchResult {
  messageId: string;
  content: string;
  timestamp: Date;
  matchStart: number;
  matchEnd: number;
}

export function searchMessages(messages: Message[], query: string): SearchResult[] {
  if (!messages?.length || !query?.trim()) {
    return [];
  }

  const results: SearchResult[] = [];
  const searchTerm = query.trim().toLowerCase();

  for (const message of messages) {
    if (!message?.text || !message?._id || !message?.timestamp) {
      continue;
    }

    try {
      const content = message.text.toLowerCase();
      let index = content.indexOf(searchTerm);
      
      while (index !== -1) {
        const timestamp = new Date(message.timestamp);
        
        if (isNaN(timestamp.getTime())) {
          continue;
        }

        results.push({
          messageId: message._id,
          content: message.text,
          timestamp,
          matchStart: index,
          matchEnd: index + searchTerm.length,
        });
        
        index = content.indexOf(searchTerm, index + 1);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      continue;
    }
  }

  return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function highlightSearchMatch(text: string, matchStart: number, matchEnd: number): JSX.Element {
  if (typeof text !== 'string' || 
      typeof matchStart !== 'number' || 
      typeof matchEnd !== 'number' ||
      matchStart < 0 ||
      matchEnd > text.length ||
      matchStart >= matchEnd) {
    return createElement('span', null, text);
  }

  return createElement(
    Fragment,
    null,
    text.slice(0, matchStart),
    createElement(
      'span',
      { className: 'bg-yellow-500 bg-opacity-50' },
      text.slice(matchStart, matchEnd)
    ),
    text.slice(matchEnd)
  );
}