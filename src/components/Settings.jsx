import React from 'react';
import { X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const Settings = ({ settings, setSettings, onClose, isMobile }) => {
  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'inset-y-4 right-4 w-96'} bg-gray-800 shadow-lg z-50 flex flex-col ${isMobile ? '' : 'rounded-lg'}`}>
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        <div>
          <label className="block mb-2 text-white">Font Size</label>
          <input
            type="number"
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            min="10"
            max="24"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="autoSave" className="text-white">Auto Save</label>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={(checked) => handleChange('autoSave', checked)}
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Tab Size</label>
          <input
            type="number"
            value={settings.tabSize}
            onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
            min="2"
            max="8"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="lineNumbers" className="text-white">Show Line Numbers</label>
          <Switch
            id="lineNumbers"
            checked={settings.lineNumbers}
            onCheckedChange={(checked) => handleChange('lineNumbers', checked)}
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Indentation</label>
          <select
            value={settings.indentWithTabs ? 'tabs' : 'spaces'}
            onChange={(e) => handleChange('indentWithTabs', e.target.value === 'tabs')}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tabs">Tabs</option>
            <option value="spaces">Spaces</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="highlightActiveLine" className="text-white">Highlight Active Line</label>
          <Switch
            id="highlightActiveLine"
            checked={settings.highlightActiveLine}
            onCheckedChange={(checked) => handleChange('highlightActiveLine', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="matchBrackets" className="text-white">Match Brackets</label>
          <Switch
            id="matchBrackets"
            checked={settings.matchBrackets}
            onCheckedChange={(checked) => handleChange('matchBrackets', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;