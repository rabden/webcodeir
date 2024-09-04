import React from 'react';
import { X } from 'lucide-react';

const EditorSettings = ({ onClose, language }) => {
  const handleFormatCode = () => {
    // Implement code formatting logic here
    console.log(`Formatting ${language} code`);
  };

  const handleAnalyzeCode = () => {
    // Implement code analysis logic here
    console.log(`Analyzing ${language} code`);
  };

  const handleMaximizeEditor = () => {
    // Implement editor maximization logic here
    console.log(`Maximizing ${language} editor`);
  };

  const handleMinimizeEditor = () => {
    // Implement editor minimization logic here
    console.log(`Minimizing ${language} editor`);
  };

  const handleFoldAll = () => {
    // Implement fold all logic here
    console.log(`Folding all in ${language} editor`);
  };

  const handleUnfoldAll = () => {
    // Implement unfold all logic here
    console.log(`Unfolding all in ${language} editor`);
  };

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
          <button onClick={handleFormatCode} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Format {language.toUpperCase()}
          </button>
        </li>
        <li>
          <button onClick={handleAnalyzeCode} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Analyze {language.toUpperCase()}
          </button>
        </li>
        <li>
          <button onClick={handleMaximizeEditor} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Maximize {language.toUpperCase()} Editor
          </button>
        </li>
        <li>
          <button onClick={handleMinimizeEditor} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Minimize {language.toUpperCase()} Editor
          </button>
        </li>
        <li>
          <button onClick={handleFoldAll} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Fold All
          </button>
        </li>
        <li>
          <button onClick={handleUnfoldAll} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">
            Unfold All
          </button>
        </li>
      </ul>
    </div>
  );
};

export default EditorSettings;