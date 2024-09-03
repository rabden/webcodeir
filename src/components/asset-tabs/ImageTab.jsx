import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';

const ImageTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);

  const searchImages = async () => {
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
      const data = await response.json();
      setImages(data.results);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    searchImages();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-white">Photos from <span className="text-blue-400">Unsplash</span>. Click to Copy.</h2>
        <button className="bg-[#3a3a3a] text-white px-4 py-2 rounded flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>See more</span>
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Unsplash..."
          className="flex-grow px-4 py-2 rounded bg-[#3a3a3a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchImages}
          className="px-4 py-2 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a] transition-colors"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img src={image.urls.small} alt={image.alt_description} className="w-full h-48 object-cover rounded" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => navigator.clipboard.writeText(image.urls.full)}
                className="px-3 py-1 bg-white text-black rounded text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTab;