import React from 'react';
import { Switch } from "@/components/ui/switch";

const LibraryTogglePanel = ({ libraries, toggleLibrary }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Library Toggles</h3>
      <div className="space-y-2">
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