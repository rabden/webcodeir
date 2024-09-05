import React, { useState, useEffect } from 'react';
import { X, Search, Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// This is a mock list of 500 Font Awesome icons. In a real implementation, you'd want to fetch this from an API or import it from a file.
const icons = [
  { name: 'fa-user', unicode: '\uf007' },
  { name: 'fa-home', unicode: '\uf015' },
  { name: 'fa-cog', unicode: '\uf013' },
  // ... (497 more icons would be listed here)
];

const IconPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [filteredIcons, setFilteredIcons] = useState(icons);

  useEffect(() => {
    const results = icons.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(results);
  }, [searchTerm]);

  const copyToClipboard = (text, iconName) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [iconName]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [iconName]: false });
    }, 2000);
  };

  return (
    <div className={`fixed inset-y-4 ${isMobile ? 'inset-x-4' : 'right-4'} bg-gray-800 ${isMobile ? 'w-auto' : 'w-96'} shadow-lg z-50 flex flex-col rounded-lg`}>
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Icon Library</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {filteredIcons.map((icon) => (
            <TooltipProvider key={icon.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => copyToClipboard(`<i class="${icon.name}"></i>`, icon.name)}
                  >
                    {copiedStates[icon.name] ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <span className="text-2xl">{icon.unicode}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{icon.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconPanel;