import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

const fonts = [
  { name: 'Lato', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Open Sans', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Roboto', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Merriweather', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Montserrat', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Raleway', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Lora', sample: 'The quick brown fox jumps over the lazy dog' },
];

const FontPanel = () => {
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
    <div className="w-full h-full p-6 overflow-y-auto bg-[#1e1e1e] text-white">
      <h2 className="text-2xl font-bold mb-6">Some popular fonts from <span className="text-blue-400">Google Fonts</span>.</h2>
      <ul className="space-y-4">
        {fonts.map((font) => (
          <li key={font.name} className="bg-[#2d2d2d] rounded-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleFont(font.name)}>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: font.name }}>{font.name}</h3>
                <p className="text-lg mt-2" style={{ fontFamily: font.name }}>{font.sample}</p>
              </div>
              <button className="p-2 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors">
                {expandedFont === font.name ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {expandedFont === font.name && (
              <div className="bg-[#252525] p-4 space-y-2">
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
                      className="px-3 py-1 rounded bg-[#3a3a3a] hover:bg-[#4a4a4a] text-sm transition-colors flex items-center space-x-1"
                    >
                      {copiedStates[font.name + type] ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
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
  );
};

export default FontPanel;