import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FONTAWESOME_API_KEY = '62706841-14C4-4659-88F2-25107E169A35';

const IconPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedIcon, setCopiedIcon] = useState(null);

  useEffect(() => {
    fetchIcons();
  }, [searchTerm]);

  const fetchIcons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.fontawesome.com/v6/search?query=${searchTerm}&family=classic&style=solid&token=${FONTAWESOME_API_KEY}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIcons(data.results || []);
    } catch (error) {
      console.error('Error fetching icons:', error);
      setError('Failed to fetch icons. Please try again.');
      setIcons([]);
    }
    setLoading(false);
  };

  const copyToClipboard = (iconName) => {
    const iconTag = `<i class="fas fa-${iconName}"></i>`;
    navigator.clipboard.writeText(iconTag);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className={`fixed inset-y-0 right-0 bg-gray-800 shadow-lg z-50 flex flex-col ${isMobile ? 'w-full' : 'w-96'}`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">FontAwesome Icon Library</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {loading && <p className="text-white text-center">Loading icons...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && icons.length === 0 && (
          <p className="text-white text-center">No icons found. Try a different search term.</p>
        )}
        <div className={`grid ${isMobile ? 'grid-cols-4 gap-2' : 'grid-cols-3 gap-4'}`}>
          {icons.map((icon) => (
            <TooltipProvider key={icon.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full ${isMobile ? 'h-12' : 'h-16'} flex items-center justify-center bg-gray-700 hover:bg-gray-600 border-gray-600`}
                    onClick={() => copyToClipboard(icon.id)}
                  >
                    {copiedIcon === icon.id ? (
                      <Check className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-green-500`} />
                    ) : (
                      <i className={`fas fa-${icon.id} ${isMobile ? 'text-lg' : 'text-2xl'}`} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{icon.id}</p>
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