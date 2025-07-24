'use client';
import React from 'react';
import { LoaderCircle } from 'lucide-react';

function ChatBox({ conversation = [], coachingOption, enableFeedbackNotes = false }) {
  return (
    <div className="h-[60vh] bg-white border rounded-4xl flex flex-col p-4">
      <div className="flex-1 overflow-y-auto scrollbar-hide mb-4 space-y-4 px-2">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.speaker === 'ai'
                  ? 'bg-[#0084FF] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span
                className={`text-xs ${
                  message.speaker === 'ai' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      {!conversation.length && (
        <div className="flex justify-center items-center h-full text-gray-400">
          No conversation yet.
        </div>
      )}
    </div>
  );
}

export default ChatBox;
