import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const iconList = Object.entries(LucideIcons).filter(([name]) => name !== 'createLucideIcon');

const IconPanel = ({ onClose }) => {
  const [expandedIcon, setExpandedIcon] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});

  const toggleIcon = (iconName) => {
    setExpandedIcon(expandedIcon === iconName ? null : iconName);
  };

  const copyToClipboard = (text, iconName, type) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [iconName + type]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [iconName + type]: false });
    }, 2000);
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
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {iconList.map(([iconName, IconComponent]) => (
            <li key={iconName} className="p-6 rounded-lg bg-gray-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{iconName}</h3>
                <button
                  onClick={() => toggleIcon(iconName)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  {expandedIcon === iconName ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
              </div>
              <div className="flex justify-center mb-4">
                <IconComponent className="w-12 h-12 text-white" />
              </div>
              {expandedIcon === iconName && (
                <div className="mt-4 space-y-2">
                  {['jsx', 'svg'].map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Copy {type}:</span>
                      <button
                        onClick={() => copyToClipboard(
                          type === 'jsx' 
                            ? `<${iconName} className="w-6 h-6" />`
                            : IconComponent({}).props.children,
                          iconName,
                          type
                        )}
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm transition-colors flex items-center space-x-1"
                      >
                        {copiedStates[iconName + type] ? (
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

export default IconPanel;