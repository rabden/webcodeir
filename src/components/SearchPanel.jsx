import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchPanel = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
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
      <div className="p-4 flex-grow">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter your search query"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-700 text-white border-gray-600"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchPanel;