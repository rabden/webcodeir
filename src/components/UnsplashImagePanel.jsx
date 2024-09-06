import React, { useState } from 'react';
import { X, Search, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UnsplashImagePanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
      const data = await response.json();
      setImages(data.results);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setLoading(false);
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="fixed inset-y-4 right-4 w-96 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Unsplash Images</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 flex space-x-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search images..."
          className="flex-grow bg-gray-700 text-white border-gray-600"
        />
        <Button onClick={searchImages} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img src={image.urls.small} alt={image.alt_description} className="w-full rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button onClick={() => copyImageUrl(image.urls.regular)} className="mr-2">
                Copy URL
              </Button>
              <a href={image.links.html} target="_blank" rel="noopener noreferrer">
                <Button>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Unsplash
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnsplashImagePanel;