import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, Trash, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const ConsolePanel = ({ onClose, isMobile }) => {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const originalConsole = window.console;
    const methods = ['log', 'info', 'warn', 'error'];

    methods.forEach(method => {
      window.console[method] = (...args) => {
        setLogs(prevLogs => [...prevLogs, { type: method, content: args.join(' ') }]);
        originalConsole[method](...args);
      };
    });

    return () => {
      methods.forEach(method => {
        window.console[method] = originalConsole[method];
      });
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(input);
        console.log(result);
      } catch (error) {
        console.error(error.message);
      }
      setInput('');
    }
  };

  const clearLogs = () => setLogs([]);

  const downloadLogs = () => {
    const content = logs.map(log => `[${log.type}] ${log.content}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
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
    <div className={`fixed ${isMobile ? 'inset-0' : 'inset-x-0 bottom-0 h-64'} bg-gray-900 text-white shadow-lg z-50 flex flex-col`}>
      <div className="flex justify-between items-center p-2 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Console</h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={clearLogs} title="Clear console">
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={downloadLogs} title="Download logs">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title="Close console">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow p-2" ref={scrollAreaRef}>
        {logs.map((log, index) => (
          <div key={index} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : ''}`}>
            {log.content}
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center p-2 border-t border-gray-700">
        <ChevronRight className="h-4 w-4 mr-2" />
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter JavaScript code..."
          className="flex-grow bg-gray-800 border-gray-700 text-white"
        />
      </form>
    </div>
  );
};

export default ConsolePanel;