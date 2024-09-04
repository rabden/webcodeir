import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

const icons = [
  { name: 'Home', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { name: 'Search', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' },
  { name: 'Settings', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>' },
  // Add more icons as needed
];

const IconPanel = ({ onClose }) => {
  const [copiedStates, setCopiedStates] = useState({});

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
          <h2 className="text-3xl font-bold text-white">Icon Library</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {icons.map((icon) => (
            <div key={icon.name} className="p-4 bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-2">
                <div dangerouslySetInnerHTML={{ __html: icon.svg }} className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-2">{icon.name}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => copyToClipboard(icon.svg, icon.name, 'svg')}
                  className="w-full px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  {copiedStates[icon.name + 'svg'] ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      <span className="text-white">Copy SVG</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(`<i className="icon-${icon.name.toLowerCase()}"></i>`, icon.name, 'class')}
                  className="w-full px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  {copiedStates[icon.name + 'class'] ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      <span className="text-white">Copy Class</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconPanel;