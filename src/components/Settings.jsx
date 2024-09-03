import React from 'react';
import { X } from 'lucide-react';

const Settings = ({ settings, setSettings, onClose }) => {
  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const themes = [
    { name: 'VSCode', value: 'vscode' },
    { name: 'Dracula', value: 'dracula' },
    { name: 'Solarized', value: 'solarized' },
    { name: 'Monaco', value: 'monaco' },
    { name: 'GitHub', value: 'github' },
    { name: 'Monokai', value: 'monokai' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-black">Editor Theme</label>
            <select
              value={settings.editorTheme}
              onChange={(e) => handleChange('editorTheme', e.target.value)}
              className="w-full p-2 rounded bg-white text-black border border-gray-300"
            >
              {themes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-black">Font Size</label>
            <input
              type="number"
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              min="10"
              max="24"
              className="w-full p-2 rounded bg-white text-black border border-gray-300"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              checked={settings.autoSave}
              onChange={(e) => handleChange('autoSave', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="autoSave" className="text-black">Auto Save</label>
          </div>
          <div>
            <label className="block mb-2 text-black">Tab Size</label>
            <input
              type="number"
              value={settings.tabSize}
              onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
              min="2"
              max="8"
              className="w-full p-2 rounded bg-white text-black border border-gray-300"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="lineNumbers"
              checked={settings.lineNumbers}
              onChange={(e) => handleChange('lineNumbers', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="lineNumbers" className="text-black">Show Line Numbers</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="wordWrap"
              checked={settings.wordWrap}
              onChange={(e) => handleChange('wordWrap', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="wordWrap" className="text-black">Word Wrap</label>
          </div>
          <div>
            <label className="block mb-2 text-black">Indentation</label>
            <select
              value={settings.indentWithTabs ? 'tabs' : 'spaces'}
              onChange={(e) => handleChange('indentWithTabs', e.target.value === 'tabs')}
              className="w-full p-2 rounded bg-white text-black border border-gray-300"
            >
              <option value="tabs">Tabs</option>
              <option value="spaces">Spaces</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-black">Auto Close Brackets</label>
            <select
              value={settings.autoCloseBrackets}
              onChange={(e) => handleChange('autoCloseBrackets', e.target.value)}
              className="w-full p-2 rounded bg-white text-black border border-gray-300"
            >
              <option value="always">Always</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highlightActiveLine"
              checked={settings.highlightActiveLine}
              onChange={(e) => handleChange('highlightActiveLine', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="highlightActiveLine" className="text-black">Highlight Active Line</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;