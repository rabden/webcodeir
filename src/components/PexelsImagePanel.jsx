import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Search, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PEXELS_API_KEY = 'SlQp2QTvSTt9CB9Fa6AMAZaNo3kC7IYvENxUJTWaSJzrs1kls0B5z3fX';

const PexelsImagePanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const observer = useRef();
  const lastImageElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  const fetchImages = async (pageNum, query = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `https://api.pexels.com/v1/search?query=${query}&per_page=50&page=${pageNum}`
        : `https://api.pexels.com/v1/curated?per_page=50&page=${pageNum}`;
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImages(prevImages => [...prevImages, ...data.photos]);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const handleSearch = () => {
    setImages([]);
    setPage(1);
    fetchImages(1, searchTerm);
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className={`fixed inset-y-4 right-4 ${isMobile ? 'left-4' : 'w-96'} bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Pexels Images</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5 text-white" />
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
        <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
          {images.map((image, index) => (
            <div key={image.id} className="relative group" ref={index === images.length - 1 ? lastImageElementRef : null}>
              <img src={image.src.medium} alt={image.alt} className="w-full h-auto rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button onClick={() => copyImageUrl(image.src.original)} className="mb-2 text-xs">
                  Copy URL
                </Button>
                <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-white text-xs">
                  <Button size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View on Pexels
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
        {loading && <p className="text-center text-white">Loading more images...</p>}
      </div>
    </div>
  );
};

export default PexelsImagePanel;