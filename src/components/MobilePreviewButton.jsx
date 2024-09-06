import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MobilePreviewButton = ({ onClick, isPreviewVisible }) => {
  return (
    <Button
      className="fixed bottom-4 right-4 z-50 rounded-full p-2 w-12 h-12 flex items-center justify-center"
      onClick={onClick}
      variant="secondary"
    >
      {isPreviewVisible ? <EyeOff size={24} /> : <Eye size={24} />}
    </Button>
  );
};

export default MobilePreviewButton;