import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Console = ({ show, onClose }) => {
  const [logs, setLogs] = useState([]);
  const consoleRef = useRef(null);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      setLogs((prevLogs) => [...prevLogs, { type: 'log', content: args.join(' ') }]);
      originalConsoleLog.apply(console, args);
    };

    console.error = (...args) => {
      setLogs((prevLogs) => [...prevLogs, { type: 'error', content: args.join(' ') }]);
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      setLogs((prevLogs) => [...prevLogs, { type: 'warn', content: args.join(' ') }]);
      originalConsoleWarn.apply(console, args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const clearConsole = () => {
    setLogs([]);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#1e1e1e] text-white transition-all duration-300 ease-in-out ${
        show ? 'h-64' : 'h-0'
      } overflow-hidden`}
    >
      <div className="flex justify-between items-center p-2 bg-[#2d2d2d] border-b border-gray-700">
        <h3 className="text-sm font-semibold">Console</h3>
        <div>
          <button
            onClick={clearConsole}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded mr-2"
          >
            Clear
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={consoleRef} className="h-[calc(100%-32px)] overflow-y-auto p-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`mb-1 ${
              log.type === 'error'
                ? 'text-red-400'
                : log.type === 'warn'
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}
          >
            {log.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Console;