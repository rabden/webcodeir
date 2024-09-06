import React, { useState } from 'react';
import { X, Search, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_SEARCH_ENGINE_ID&q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setSearchResults(data.items || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`fixed inset-y-4 ${isMobile ? 'inset-x-4' : 'right-4'} bg-gray-800 ${isMobile ? 'w-auto' : 'w-96'} shadow-lg z-50 flex flex-col rounded-lg`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Search Google</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Enter your search query"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-700 text-white border-gray-600"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            <Search className="w-4 h-4" />
          </Button>
        </form>
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center"
                >
                  <h3 className="font-semibold">{result.title}</h3>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <p className="text-gray-300 text-sm mt-1">{result.snippet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;