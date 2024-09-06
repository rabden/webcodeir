import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MobilePreviewButton = ({ onClick, isPreviewVisible }) => {
  return (
    <Button
      className="absolute top-2 right-2 z-50 rounded-full p-1 w-8 h-8 flex items-center justify-center"
      onClick={onClick}
      variant="secondary"
      size="icon"
    >
      {isPreviewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
    </Button>
  );
};

export default MobilePreviewButton;