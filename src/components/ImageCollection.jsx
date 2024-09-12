import React from 'react';
import { X, Trash2, Download, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGeneratedImages, useDeleteGeneratedImage } from '../hooks/useGeneratedImages';
import { useSupabaseAuth } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const ImageCollection = ({ onClose }) => {
  const { session } = useSupabaseAuth();
  const userId = session?.user?.id;
  const { data: generatedImages, isLoading, error } = useGeneratedImages(userId);
  const deleteGeneratedImage = useDeleteGeneratedImage();
  const { toast } = useToast();

  const handleDelete = async (id) => {
    try {
      await deleteGeneratedImage.mutateAsync(id);
      toast({
        title: "Image Deleted",
        description: "The image has been removed from your collection.",
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  if (isLoading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-gray-800 shadow-lg z-50 flex flex-col">
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
                <img src={image.image_url} alt={image.prompt} className="w-full rounded-lg" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => window.open(image.image_url, '_blank')}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => copyToClipboard(image.image_url)}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(image.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Prompt: {image.prompt}</p>
                  <p>Seed: {image.seed}</p>
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