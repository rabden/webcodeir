import React, { useState } from 'react';
import { Search } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search images..."
          className="flex-grow px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchImages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Search className="w-5 h-5" />
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