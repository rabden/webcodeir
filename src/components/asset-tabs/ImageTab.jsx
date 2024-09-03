import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';

const ImageTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockImages = [
    { id: 1, urls: { small: 'https://source.unsplash.com/random/300x200?sig=1', full: 'https://source.unsplash.com/random/1200x800?sig=1' }, alt_description: 'Random image 1' },
    { id: 2, urls: { small: 'https://source.unsplash.com/random/300x200?sig=2', full: 'https://source.unsplash.com/random/1200x800?sig=2' }, alt_description: 'Random image 2' },
    { id: 3, urls: { small: 'https://source.unsplash.com/random/300x200?sig=3', full: 'https://source.unsplash.com/random/1200x800?sig=3' }, alt_description: 'Random image 3' },
    { id: 4, urls: { small: 'https://source.unsplash.com/random/300x200?sig=4', full: 'https://source.unsplash.com/random/1200x800?sig=4' }, alt_description: 'Random image 4' },
    { id: 5, urls: { small: 'https://source.unsplash.com/random/300x200?sig=5', full: 'https://source.unsplash.com/random/1200x800?sig=5' }, alt_description: 'Random image 5' },
    { id: 6, urls: { small: 'https://source.unsplash.com/random/300x200?sig=6', full: 'https://source.unsplash.com/random/1200x800?sig=6' }, alt_description: 'Random image 6' },
  ];

  const searchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      const filteredImages = mockImages.filter(img => 
        img.alt_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setImages(filteredImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchImages();
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-white">Photos from <span className="text-blue-400">Unsplash</span>. Click to Copy.</h2>
        <button onClick={searchImages} className="bg-[#3a3a3a] text-white px-4 py-2 rounded flex items-center space-x-2">
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
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
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
      {images.length === 0 && !loading && !error && (
        <p className="text-white text-center">No images found. Try a different search query.</p>
      )}
    </div>
  );
};

export default ImageTab;