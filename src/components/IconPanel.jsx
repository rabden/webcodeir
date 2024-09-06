import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const IconPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState(null);
  const [icons, setIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIcons = async () => {
      if (searchTerm.length > 1) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://api.iconify.design/search?query=${searchTerm}&limit=50`);
          if (!response.ok) {
            throw new Error('Failed to fetch icons');
          }
          const data = await response.json();
          if (data && data.icons && Array.isArray(data.icons)) {
            setIcons(data.icons);
          } else {
            setIcons([]);
          }
        } catch (error) {
          console.error('Error fetching icons:', error);
          setError('Failed to load icons. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIcons([]);
      }
    };

    const debounceTimer = setTimeout(fetchIcons, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const copyToClipboard = async (iconName, prefix) => {
    try {
      const response = await fetch(`https://api.iconify.design/${prefix}/${iconName}.svg`);
      if (!response.ok) {
        throw new Error('Failed to fetch SVG');
      }
      const svgString = await response.text();
      await navigator.clipboard.writeText(svgString);
      setCopiedIcon(iconName);
      setTimeout(() => setCopiedIcon(null), 2000);
    } catch (error) {
      console.error('Error copying icon:', error);
      setError('Failed to copy icon. Please try again.');
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
        {isLoading && <p className="text-white">Loading icons...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && icons.length === 0 && searchTerm.length > 1 && (
          <p className="text-white">No icons found. Try a different search term.</p>
        )}
        <div className="grid grid-cols-4 gap-4">
          {icons.map((icon) => (
            <TooltipProvider key={`${icon.prefix}:${icon.name}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => copyToClipboard(icon.name, icon.prefix)}
                  >
                    {copiedIcon === icon.name ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <img 
                        src={`https://api.iconify.design/${icon.prefix}/${icon.name}.svg`} 
                        alt={icon.name} 
                        className="w-6 h-6"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFsZXJ0LWNpcmNsZSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48bGluZSB4MT0iMTIiIHkxPSI4IiB4Mj0iMTIiIHkyPSIxMiIvPjxsaW5lIHgxPSIxMiIgeTE9IjE2IiB4Mj0iMTIuMDEiIHkyPSIxNiIvPjwvc3ZnPg==';
                        }}
                      />
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