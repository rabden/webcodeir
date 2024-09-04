import React, { useState } from 'react';
import { X, Copy, Check, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const IconPanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState(null);

  const icons = Object.entries(LucideIcons)
    .filter(([name]) => 
      name.toLowerCase().includes(searchTerm.toLowerCase()) && typeof LucideIcons[name] === 'function'
    )
    .map(([name, Icon]) => ({ name, Icon }));

  const copyToClipboard = (iconName) => {
    const svgString = `<i data-lucide="${iconName}"></i>`;
    navigator.clipboard.writeText(svgString);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
      <div className="w-full h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Icons</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {icons.map(({ name, Icon }) => (
            <div key={name} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
              <Icon className="w-8 h-8 text-white mb-2" />
              <p className="text-sm text-gray-300 mb-2 truncate w-full text-center">{name}</p>
              <button
                onClick={() => copyToClipboard(name)}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm transition-colors flex items-center space-x-1"
              >
                {copiedIcon === name ? (
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
      </div>
    </div>
  );
};

export default IconPanel;