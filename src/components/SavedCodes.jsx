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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
      <div className="w-full h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Saved Codes</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        {savedCodes.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">No saved codes yet.</p>
        ) : (
          <ul className="space-y-6">
            {savedCodes.map((code) => (
              <li key={code.id} className="p-6 rounded-lg bg-gray-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={code.name}
                    onChange={(e) => handleRename(code.id, e.target.value)}
                    className="text-xl font-semibold mr-2 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onLoad(code)}
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-2 rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                    <button
                      onClick={() => toggleExpand(code.id)}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      {expandedCode === code.id ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                    </button>
                  </div>
                </div>
                {expandedCode === code.id && (
                  <div className="mt-4">
                    <iframe
                      srcDoc={generatePreviewCode(code.html, code.css, code.js)}
                      title={`Preview of ${code.name}`}
                      className="w-full h-96 rounded border border-gray-600"
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