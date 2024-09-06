import React from 'react';
import { X } from 'lucide-react';

const KeyboardShortcutsPanel = ({ onClose }) => {
  const shortcuts = [
    { key: 'Ctrl + S', description: 'Save current code' },
    { key: 'Ctrl + O', description: 'Open saved codes' },
    { key: 'Ctrl + F', description: 'Open font panel' },
    { key: 'Ctrl + I', description: 'Open icon panel' },
    { key: 'Ctrl + ,', description: 'Open settings' },
    { key: 'Ctrl + L', description: 'Toggle layout' },
    { key: 'Ctrl + 1', description: 'Focus HTML editor' },
    { key: 'Ctrl + 2', description: 'Focus CSS editor' },
    { key: 'Ctrl + 3', description: 'Focus JavaScript editor' },
    { key: 'Ctrl + P', description: 'Toggle preview (mobile)' },
    { key: 'Ctrl + M', description: 'Toggle mobile menu' },
    { key: 'Ctrl + /', description: 'Toggle keyboard shortcuts panel' },
    { key: 'Ctrl + U', description: 'Toggle Unsplash image panel' },
  ];

  return (
    <div className="fixed inset-y-4 right-4 w-80 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <ul className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <li key={index} className="flex justify-between">
              <kbd className="px-2 py-1 bg-gray-700 text-white rounded">{shortcut.key}</kbd>
              <span className="text-white">{shortcut.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KeyboardShortcutsPanel;