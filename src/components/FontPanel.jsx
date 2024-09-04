import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, X } from 'lucide-react';

const fonts = [
  { name: 'Lato', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Open Sans', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Roboto', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Merriweather', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Montserrat', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Raleway', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Lora', sample: 'The quick brown fox jumps over the lazy dog' },
];

const FontPanel = ({ onClose }) => {
  const [expandedFont, setExpandedFont] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});

  const toggleFont = (fontName) => {
    setExpandedFont(expandedFont === fontName ? null : fontName);
  };

  const copyToClipboard = (text, fontName, type) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [fontName + type]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [fontName + type]: false });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
      <div className="w-full h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Popular Fonts</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <ul className="space-y-6">
          {fonts.map((font) => (
            <li key={font.name} className="p-6 rounded-lg bg-gray-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: font.name }}>{font.name}</h3>
                <button
                  onClick={() => toggleFont(font.name)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  {expandedFont === font.name ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
              </div>
              <p className="text-lg mt-2 text-gray-300" style={{ fontFamily: font.name }}>{font.sample}</p>
              {expandedFont === font.name && (
                <div className="mt-4 space-y-2">
                  {['link', 'import', 'font-family'].map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Copy {type}:</span>
                      <button
                        onClick={() => copyToClipboard(
                          type === 'link' 
                            ? `<link href="https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}" rel="stylesheet">`
                            : type === 'import'
                            ? `@import url('https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}');`
                            : `font-family: '${font.name}', sans-serif;`,
                          font.name,
                          type
                        )}
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm transition-colors flex items-center space-x-1"
                      >
                        {copiedStates[font.name + type] ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-white" />
                            <span className="text-white">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FontPanel;