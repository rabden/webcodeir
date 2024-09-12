import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const ImageCollection = ({ onClose, savedImages, onRemoveImage }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-gray-800 shadow-lg z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Image Collection</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-grow p-4">
        {savedImages.length === 0 ? (
          <p className="text-gray-400 text-center">No saved images yet.</p>
        ) : (
          <div className="space-y-4">
            {savedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img src={image.imageUrl} alt={`Saved image ${index + 1}`} className="w-full rounded-lg" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveImage(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ImageCollection;