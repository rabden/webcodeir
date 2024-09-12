import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteImage } from '../integrations/supabase/hooks/useImageCollections';
import { useToast } from "@/components/ui/use-toast";

const ImageCollection = ({ onClose, savedImages, onRemoveImage }) => {
  const deleteImage = useDeleteImage();
  const { toast } = useToast();

  const handleDeleteImage = async (id) => {
    try {
      await deleteImage.mutateAsync(id);
      onRemoveImage();
      toast({
        title: "Image Deleted",
        description: "The image has been removed from your collection.",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete the image. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            {savedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img src={image.image_url} alt={`Saved image ${image.id}`} className="w-full rounded-lg" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteImage(image.id)}
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