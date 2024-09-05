import React from 'react';
import { X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const LibraryTogglePanel = ({ libraries, toggleLibrary, onClose, isMobile }) => {
  return (
    <div className={`fixed inset-y-4 ${isMobile ? 'inset-x-4' : 'right-4'} bg-gray-800 ${isMobile ? 'w-auto' : 'w-96'} shadow-lg z-50 flex flex-col rounded-lg`}>
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Library Toggles</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {Object.entries(libraries).map(([name, enabled]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="text-white">{name}</span>
            <Switch
              checked={enabled}
              onCheckedChange={() => toggleLibrary(name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryTogglePanel;