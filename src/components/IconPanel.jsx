import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FONTAWESOME_API_KEY = '62706841-14C4-4659-88F2-25107E169A35';

const IconPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIcon, setCopiedIcon] = useState(null);

  useEffect(() => {
    const fetchIcons = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.fontawesome.com/v5.0/icons?family=solid&access_token=${FONTAWESOME_API_KEY}`);
        const data = await response.json();
        setIcons(data.icons);
      } catch (error) {
        console.error('Error fetching icons:', error);
      }
      setLoading(false);
    };

    fetchIcons();
  }, []);

  const filteredIcons = icons.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex-grow overflow-y-auto p-4">
        {loading ? (
          <p className="text-white text-center">Loading icons...</p>
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-4 gap-2' : 'grid-cols-3 gap-4'}`}>
            {filteredIcons.map((icon) => (
              <TooltipProvider key={icon.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full ${isMobile ? 'h-12' : 'h-16'} flex items-center justify-center bg-gray-700 hover:bg-gray-600 border-gray-600`}
                      onClick={() => copyToClipboard(icon.name)}
                    >
                      {copiedIcon === icon.name ? (
                        <Check className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-green-500`} />
                      ) : (
                        <i className={`fas fa-${icon.name} ${isMobile ? 'text-lg' : 'text-2xl'}`} />
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
        )}
      </div>
    </div>
  );
};

export default IconPanel;