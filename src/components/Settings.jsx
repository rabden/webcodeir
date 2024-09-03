import React from 'react';
import { X } from 'lucide-react';

const Settings = ({ settings, setSettings, onClose }) => {
  const handleThemeChange = (e) => {
    setSettings({ ...settings, theme: e.target.value });
  };

  const handleFontSizeChange = (e) => {
    setSettings({ ...settings, fontSize: parseInt(e.target.value) });
  };

  const handleAutoSaveChange = (e) => {
    setSettings({ ...settings, autoSave: e.target.checked });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-${settings.theme === 'dark' ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg w-96`}>
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
              onChange={handleThemeChange}
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
              onChange={handleFontSizeChange}
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
              onChange={handleAutoSaveChange}
              className="mr-2"
            />
            <label htmlFor="autoSave" className={`${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Auto Save</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;