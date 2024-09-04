import React from 'react';
import { X } from 'lucide-react';

const EditorSettings = ({ onClose, language, onAction }) => {
  return (
    <div className="absolute top-8 right-2 bg-gray-800 p-2 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">{language.toUpperCase()} Editor Settings</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      <ul className="space-y-1">
        <li>
          <button onClick={() => onAction('format')} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Format {language.toUpperCase()}
          </button>
        </li>
        <li>
          <button onClick={() => onAction('analyze')} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Analyze {language.toUpperCase()}
          </button>
        </li>
        <li>
          <button onClick={() => onAction('maximize')} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Maximize {language.toUpperCase()} Editor
          </button>
        </li>
        <li>
          <button onClick={() => onAction('minimize')} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Minimize {language.toUpperCase()} Editor
          </button>
        </li>
        <li>
          <button onClick={() => onAction('foldAll')} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Fold All
          </button>
        </li>
        <li>
          <button onClick={() => onAction('unfoldAll')} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Unfold All
          </button>
        </li>
      </ul>
    </div>
  );
};

export default EditorSettings;