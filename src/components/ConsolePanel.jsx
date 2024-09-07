import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Download, Trash } from 'lucide-react';

const ConsolePanel = ({ onClose, isMobile }) => {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      setLogs(prevLogs => [...prevLogs, { type: 'log', content: args.join(' ') }]);
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      setLogs(prevLogs => [...prevLogs, { type: 'error', content: args.join(' ') }]);
      originalConsoleError(...args);
    };

    console.warn = (...args) => {
      setLogs(prevLogs => [...prevLogs, { type: 'warn', content: args.join(' ') }]);
      originalConsoleWarn(...args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const executeCode = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(input);
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
    setInput('');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const logContent = logs.map(log => `[${log.type}] ${log.content}`).join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'console_logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'inset-y-4 right-4 w-96'} bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Console</h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={clearLogs}>
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={downloadLogs}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div key={index} className={`${log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-green-400'}`}>
              {log.content}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && executeCode()}
          placeholder="Enter JavaScript code..."
          className="flex-grow mr-2 bg-gray-700 text-white"
        />
        <Button onClick={executeCode}>Run</Button>
      </div>
    </div>
  );
};

export default ConsolePanel;