import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      // Here you would typically send the message to your AI backend
      // and receive a response. For now, we'll just echo the message.
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `You said: ${input}`, sender: 'bot' }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-gray-800 rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">AI Chatbot</h3>
      </div>
      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t border-gray-700 flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-grow mr-2 bg-gray-700 text-white"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default AIChatbot;