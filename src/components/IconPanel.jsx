import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { topIcons } from '../data/iconData';
import { additionalIcons } from '../data/iconData2';
import { extraIcons } from '../data/iconData3';
import ReactDOMServer from 'react-dom/server';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fas);

const IconPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState(null);
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [iconSource, setIconSource] = useState('lucide');

  const allLucideIcons = { ...topIcons, ...additionalIcons, ...extraIcons };
  const allFontAwesomeIcons = Object.keys(fas);

  useEffect(() => {
    const results = iconSource === 'lucide'
      ? Object.keys(allLucideIcons).filter(iconName => 
          iconName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allFontAwesomeIcons.filter(iconName => 
          iconName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    setFilteredIcons(results);
  }, [searchTerm, iconSource]);

  const copyToClipboard = (iconName) => {
    let svgString;
    if (iconSource === 'lucide') {
      const IconComponent = allLucideIcons[iconName];
      const iconElement = React.createElement(IconComponent, { width: 24, height: 24 });
      svgString = ReactDOMServer.renderToStaticMarkup(iconElement);
    } else {
      const iconElement = <FontAwesomeIcon icon={['fas', iconName]} size="lg" />;
      svgString = ReactDOMServer.renderToStaticMarkup(iconElement);
    }
    
    navigator.clipboard.writeText(svgString);

    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className={`fixed inset-y-0 right-0 bg-gray-800 shadow-lg z-50 flex flex-col ${isMobile ? 'w-full' : 'w-80'}`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Icon Library</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <Select value={iconSource} onValueChange={setIconSource}>
          <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
            <SelectValue placeholder="Select Icon Source" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600">
            <SelectItem value="lucide">Lucide Icons</SelectItem>
            <SelectItem value="fontawesome">Font Awesome Icons</SelectItem>
          </SelectContent>
        </Select>
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
      <div className="flex-grow overflow-y-auto p-4">
        <div className={`grid ${isMobile ? 'grid-cols-5 gap-2' : 'grid-cols-4 gap-4'}`}>
          {filteredIcons.map((iconName) => {
            const IconComponent = iconSource === 'lucide' ? allLucideIcons[iconName] : FontAwesomeIcon;
            return (
              <TooltipProvider key={iconName}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full ${isMobile ? 'h-10' : 'h-12'} flex items-center justify-center bg-gray-700 hover:bg-gray-600 border-gray-600`}
                      onClick={() => copyToClipboard(iconName)}
                    >
                      {copiedIcon === iconName ? (
                        <Check className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-green-500`} />
                      ) : (
                        iconSource === 'lucide' ? (
                          <IconComponent className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                        ) : (
                          <FontAwesomeIcon icon={['fas', iconName]} className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                        )
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{iconName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IconPanel;