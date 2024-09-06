import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Search, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PEXELS_API_KEY = 'SlQp2QTvSTt9CB9Fa6AMAZaNo3kC7IYvENxUJTWaSJzrs1kls0B5z3fX';

const PexelsImagePanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const observer = useRef();
  const lastImageElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isSearching) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isSearching]);

  const fetchImages = async (query = '', newPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `https://api.pexels.com/v1/search?query=${query}&per_page=100&page=${newPage}`
        : `https://api.pexels.com/v1/curated?per_page=100&page=${newPage}`;
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (newPage === 1) {
        setImages(data.photos);
        setVisibleImages(data.photos.slice(0, 10));
      } else {
        setImages(prevImages => [...prevImages, ...data.photos]);
        setVisibleImages(prevImages => [...prevImages, ...data.photos.slice(0, 10)]);
      }
      setHasMore(data.photos.length === 100);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!isSearching && page > 1) {
      fetchImages('', page);
    }
  }, [page, isSearching]);

  const handleSearch = () => {
    setImages([]);
    setVisibleImages([]);
    setPage(1);
    setIsSearching(true);
    fetchImages(searchTerm);
  };

  const loadMore = () => {
    if (isSearching) {
      fetchImages(searchTerm, page + 1);
    }
    setPage(prevPage => prevPage + 1);
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleImages.length < images.length) {
        setVisibleImages(prevVisible => [
          ...prevVisible,
          ...images.slice(prevVisible.length, prevVisible.length + 10)
        ]);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [visibleImages, images]);

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
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-4'}`}>
          {visibleImages.map((image, index) => (
            <div 
              key={image.id} 
              className="relative group" 
              ref={index === visibleImages.length - 1 ? lastImageElementRef : null}
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                <img 
                  src={image.src.medium} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
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
        {loading && <p className="text-center text-white">Loading images...</p>}
        {!loading && hasMore && isSearching && (
          <Button onClick={loadMore} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default PexelsImagePanel;