import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Search, ExternalLink, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PEXELS_API_KEY = 'SlQp2QTvSTt9CB9Fa6AMAZaNo3kC7IYvENxUJTWaSJzrs1kls0B5z3fX';

const PexelsImagePanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
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
        loadMoreImages();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isSearching]);

  const fetchImages = async (query = '', newPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=${newPage}`
        : `https://api.pexels.com/v1/curated?per_page=15&page=${newPage}`;
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
      } else {
        setImages(prevImages => [...prevImages, ...data.photos]);
      }
      setHasMore(data.photos.length === 15);
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

  const copyImageTag = (url, alt) => {
    const imgTag = `<img src="${url}" alt="${alt}" class="mx-auto object-cover" />`;
    navigator.clipboard.writeText(imgTag);
    toast.success("Image tag copied to clipboard!");
  };

  return (
    <div className="fixed inset-y-4 right-4 w-96 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg">
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
          {loading ? 'Searching...' : <Search className="w-4 h-4" />}
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="relative group"
            ref={index === images.length - 1 ? lastImageElementRef : null}
          >
            <img 
              src={image.src.medium} 
              alt={image.alt} 
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button onClick={() => copyImageTag(image.src.original, image.alt)} className="mr-2">
                <Copy className="w-4 h-4 mr-2" />
                Copy Tag
              </Button>
              <a href={image.url} target="_blank" rel="noopener noreferrer">
                <Button>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Pexels
                </Button>
              </a>
            </div>
          </div>
        ))}
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