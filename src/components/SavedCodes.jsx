import React, { useState, useEffect } from 'react';
import { X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const SavedCodes = ({ onClose, onLoad }) => {
  const [savedCodes, setSavedCodes] = useState([]);
  const [expandedCode, setExpandedCode] = useState(null);

  useEffect(() => {
    const codes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    setSavedCodes(codes);
  }, []);

  const handleDelete = (id) => {
    const updatedCodes = savedCodes.filter(code => code.id !== id);
    setSavedCodes(updatedCodes);
    localStorage.setItem('savedCodes', JSON.stringify(updatedCodes));
  };

  const handleRename = (id, newName) => {
    const updatedCodes = savedCodes.map(code => 
      code.id === id ? { ...code, name: newName } : code
    );
    setSavedCodes(updatedCodes);
    localStorage.setItem('savedCodes', JSON.stringify(updatedCodes));
  };

  const toggleExpand = (id) => {
    setExpandedCode(expandedCode === id ? null : id);
  };

  const generatePreviewCode = (html, css, js) => {
    return `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-y-4 right-4 bg-gray-800 w-[700px] shadow-lg z-50 flex flex-col rounded-lg">
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Saved Codes</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {savedCodes.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">No saved codes yet.</p>
        ) : (
          <ul className="space-y-4">
            {savedCodes.map((code) => (
              <li key={code.id} className="p-4 rounded-lg bg-gray-700 shadow">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={code.name}
                    onChange={(e) => handleRename(code.id, e.target.value)}
                    className="text-lg font-semibold mr-2 px-2 py-1 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLoad(code)}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-1 rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      onClick={() => toggleExpand(code.id)}
                      className="p-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      {expandedCode === code.id ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </div>
                {expandedCode === code.id && (
                  <div className="mt-2">
                    <iframe
                      srcDoc={generatePreviewCode(code.html, code.css, code.js)}
                      title={`Preview of ${code.name}`}
                      className="w-full h-48 rounded border border-gray-600"
                      sandbox="allow-scripts"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedCodes;