import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const IconPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState(null);
  const [icons, setIcons] = useState({});
  const [filteredIcons, setFilteredIcons] = useState([]);

  useEffect(() => {
    const fetchIcons = async () => {
      if (searchTerm.length > 1) {
        try {
          const response = await fetch(`https://api.iconify.design/search?query=${searchTerm}&limit=50`);
          const data = await response.json();
          const newIcons = {};
          data.forEach(icon => {
            newIcons[icon.name] = `https://api.iconify.design/${icon.prefix}:${icon.name}.svg`;
          });
          setIcons(prevIcons => ({ ...prevIcons, ...newIcons }));
          setFilteredIcons(Object.keys(newIcons));
        } catch (error) {
          console.error('Error fetching icons:', error);
        }
      } else {
        setFilteredIcons(Object.keys(icons).filter(iconName => 
          iconName.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      }
    };

    const debounceTimer = setTimeout(fetchIcons, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const copyToClipboard = async (iconName) => {
    try {
      const response = await fetch(icons[iconName]);
      const svgString = await response.text();
      await navigator.clipboard.writeText(svgString);
      setCopiedIcon(iconName);
      setTimeout(() => setCopiedIcon(null), 2000);
    } catch (error) {
      console.error('Error copying icon:', error);
    }
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
      <div className="flex-grow overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-4">
          {filteredIcons.map((iconName) => (
            <TooltipProvider key={iconName}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => copyToClipboard(iconName)}
                  >
                    {copiedIcon === iconName ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <img src={icons[iconName]} alt={iconName} className="w-6 h-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{iconName}</p>
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