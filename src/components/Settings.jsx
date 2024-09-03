import React from 'react';
import { X } from 'lucide-react';

const Settings = ({ settings, setSettings, onClose }) => {
  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-${settings.theme === 'dark' ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Settings</h2>
          <button onClick={onClose} className={`p-1 rounded-full ${settings.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className={`w-full p-2 rounded ${settings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} border border-gray-300`}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div>
            <label className={`block mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Font Size</label>
            <input
              type="number"
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              min="10"
              max="24"
              className={`w-full p-2 rounded ${settings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} border border-gray-300`}
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
            <label htmlFor="autoSave" className={`${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Auto Save</label>
          </div>
          <div>
            <label className={`block mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Tab Size</label>
            <input
              type="number"
              value={settings.tabSize}
              onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
              min="2"
              max="8"
              className={`w-full p-2 rounded ${settings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} border border-gray-300`}
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
            <label htmlFor="lineNumbers" className={`${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Show Line Numbers</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="wordWrap"
              checked={settings.wordWrap}
              onChange={(e) => handleChange('wordWrap', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="wordWrap" className={`${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Word Wrap</label>
          </div>
          <div>
            <label className={`block mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Indentation</label>
            <select
              value={settings.indentWithTabs ? 'tabs' : 'spaces'}
              onChange={(e) => handleChange('indentWithTabs', e.target.value === 'tabs')}
              className={`w-full p-2 rounded ${settings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} border border-gray-300`}
            >
              <option value="tabs">Tabs</option>
              <option value="spaces">Spaces</option>
            </select>
          </div>
          <div>
            <label className={`block mb-2 ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Auto Close Brackets</label>
            <select
              value={settings.autoCloseBrackets}
              onChange={(e) => handleChange('autoCloseBrackets', e.target.value)}
              className={`w-full p-2 rounded ${settings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} border border-gray-300`}
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
            <label htmlFor="highlightActiveLine" className={`${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Highlight Active Line</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;