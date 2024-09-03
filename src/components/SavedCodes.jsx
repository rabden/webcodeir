import React, { useState, useEffect } from 'react';
import { X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const SavedCodes = ({ onClose, onLoad, theme }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Saved Codes</h2>
          <button onClick={onClose} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {savedCodes.length === 0 ? (
          <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No saved codes yet.</p>
        ) : (
          <ul className="space-y-4">
            {savedCodes.map((code) => (
              <li key={code.id} className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={code.name}
                    onChange={(e) => handleRename(code.id, e.target.value)}
                    className={`flex-grow mr-2 px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLoad(code)}
                      className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-red-700' : 'hover:bg-red-100'}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      onClick={() => toggleExpand(code.id)}
                      className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    >
                      {expandedCode === code.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {expandedCode === code.id && (
                  <div className={`mt-2 p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <pre className={`text-xs overflow-x-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <code>{code.html}</code>
                    </pre>
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