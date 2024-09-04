import React from 'react';
import { X } from 'lucide-react';
import { formatCode, analyzeCode } from '../utils/codeUtils';

const EditorSettings = ({ onClose, language, code, onCodeUpdate }) => {
  const handleFormatCode = () => {
    const formattedCode = formatCode(code, language);
    onCodeUpdate(formattedCode);
  };

  const handleAnalyzeCode = () => {
    const analysis = analyzeCode(code, language);
    alert(`Code Analysis Result:\n${analysis.message}\n\nSuggestion: ${analysis.suggestion}`);
  };

  const handleFoldAll = () => {
    // Implement fold all logic here
    console.log(`Folding all in ${language} editor`);
    // This would typically involve calling a method on the CodeMirror instance
    // to fold all foldable regions
  };

  const handleUnfoldAll = () => {
    // Implement unfold all logic here
    console.log(`Unfolding all in ${language} editor`);
    // This would typically involve calling a method on the CodeMirror instance
    // to unfold all folded regions
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