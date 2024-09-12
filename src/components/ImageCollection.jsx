import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGeneratedImages, useDeleteGeneratedImage } from '../integrations/supabase/hooks/useGeneratedImages';
import { useToast } from "@/components/ui/use-toast";

const ImageCollection = ({ onClose, userId }) => {
  const { data: generatedImages, isLoading, error } = useGeneratedImages(userId);
  const deleteGeneratedImage = useDeleteGeneratedImage();
  const { toast } = useToast();

  const handleDelete = async (id) => {
    try {
      await deleteGeneratedImage.mutateAsync(id);
      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-gray-800 shadow-lg z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Image Collection</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-grow p-4">
        {generatedImages && generatedImages.length === 0 ? (
          <p className="text-gray-400 text-center">No generated images yet.</p>
        ) : (
          <div className="space-y-4">
            {generatedImages && generatedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img src={image.image_url} alt={`Generated image ${image.id}`} className="w-full rounded-lg" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(image.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <p>Seed: {image.seed}</p>
                  <p>Prompt: {image.prompt}</p>
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