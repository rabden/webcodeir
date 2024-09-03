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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Saved Codes</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        {savedCodes.length === 0 ? (
          <p className="text-center text-gray-400">No saved codes yet.</p>
        ) : (
          <ul className="space-y-4">
            {savedCodes.map((code) => (
              <li key={code.id} className="p-4 rounded bg-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={code.name}
                    onChange={(e) => handleRename(code.id, e.target.value)}
                    className="flex-grow mr-2 px-2 py-1 rounded bg-gray-800 text-white"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLoad(code)}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-1 rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      onClick={() => toggleExpand(code.id)}
                      className="p-1 rounded hover:bg-gray-600"
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
                      className="w-full aspect-video rounded border border-gray-600"
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