import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Search, ExternalLink, Copy, MoreVertical, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const PEXELS_API_KEY = 'SlQp2QTvSTt9CB9Fa6AMAZaNo3kC7IYvENxUJTWaSJzrs1kls0B5z3fX';

const PexelsImagePanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { toast } = useToast();

  const observer = useRef();
  const lastImageElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isSearching) {
        loadMoreImages();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isSearching]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchImages = async (query = '', newPage = 1, refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `https://api.pexels.com/v1/search?query=${query}&per_page=30&page=${newPage}`
        : `https://api.pexels.com/v1/curated?per_page=30&page=${newPage}`;
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (newPage === 1 || refresh) {
        setImages(data.photos);
      } else {
        setImages(prevImages => [...prevImages, ...data.photos]);
      }
      setHasMore(data.photos.length === 30);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = () => {
    setImages([]);
    setPage(1);
    setIsSearching(true);
    fetchImages(searchTerm);
  };

  const loadMoreImages = () => {
    if (isSearching) {
      fetchImages(searchTerm, page + 1);
    } else {
      fetchImages('', page + 1);
    }
  };

  const refreshImages = () => {
    setImages([]);
    setPage(1);
    fetchImages(searchTerm || '', 1, true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  return (
    <div className={`fixed inset-y-4 right-4 ${isMobile ? 'left-4' : 'w-96'} bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Pexels Images</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={refreshImages} variant="ghost" size="icon" className="text-white hover:bg-gray-700">
            <RefreshCw className="w-5 h-5" />
          </Button>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
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
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-4'}`}>
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="relative group" 
              ref={index === images.length - 1 ? lastImageElementRef : null}
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                <img 
                  src={image.src.medium} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-black bg-opacity-50 text-white hover:bg-opacity-75">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
                    <DropdownMenuItem onSelect={() => copyToClipboard(image.src.original)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => copyToClipboard(`<img src="${image.src.original}" alt="${image.alt}" />`)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Image Tag
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => window.open(image.url, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Pexels
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        {loading && <p className="text-center text-white">Loading images...</p>}
        {!loading && hasMore && (
          <Button onClick={loadMoreImages} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default PexelsImagePanel;