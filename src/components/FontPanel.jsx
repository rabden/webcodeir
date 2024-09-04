import React, { useState, useEffect } from 'react';
import { X, Search, MoreVertical, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const fonts = [
  'Lato', 'Open Sans', 'Roboto', 'Merriweather', 'Montserrat', 'Raleway', 'Lora', 'Poppins',
  'Playfair Display', 'Source Sans Pro', 'Nunito', 'Oswald', 'Quicksand', 'Fira Sans',
  'Cabin', 'Arvo', 'Bitter', 'Crimson Text', 'Exo 2', 'Josefin Sans', 'Ubuntu', 'Roboto Slab',
  'Noto Sans', 'Droid Sans', 'PT Sans', 'Rubik', 'Work Sans', 'Mulish', 'Nunito Sans',
  'Barlow', 'Inter', 'Karla', 'Libre Franklin', 'Manrope', 'DM Sans', 'Archivo', 'Comfortaa',
  'Prompt', 'IBM Plex Sans', 'Catamaran', 'Heebo', 'Overpass', 'Asap', 'Noto Serif'
];

const FontPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [filteredFonts, setFilteredFonts] = useState(fonts);

  useEffect(() => {
    const results = fonts.filter(font =>
      font.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFonts(results);
  }, [searchTerm]);

  const copyToClipboard = (text, fontName, type) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [fontName + type]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [fontName + type]: false });
    }, 2000);
  };

  return (
    <div className={`fixed inset-y-4 ${isMobile ? 'inset-x-4' : 'right-4'} bg-gray-800 ${isMobile ? 'w-auto' : 'w-96'} shadow-lg z-50 flex flex-col rounded-lg`}>
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Font Library</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search fonts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {filteredFonts.map((font) => (
          <div key={font} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: font }}>{font}</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-gray-700 border-gray-600">
                {['link', 'import', 'font-family'].map((type) => (
                  <button
                    key={type}
                    onClick={() => copyToClipboard(
                      type === 'link' 
                        ? `<link href="https://fonts.googleapis.com/css?family=${font.replace(' ', '+')}" rel="stylesheet">`
                        : type === 'import'
                        ? `@import url('https://fonts.googleapis.com/css?family=${font.replace(' ', '+')}');`
                        : `font-family: '${font}', sans-serif;`,
                      font,
                      type
                    )}
                    className="w-full px-2 py-2 text-left hover:bg-gray-600 text-sm transition-colors flex items-center space-x-2"
                  >
                    {copiedStates[font + type] ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <span className="text-white">Copy {type}</span>
                    )}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontPanel;