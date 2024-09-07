import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MobilePreviewButton = ({ onClick, isPreviewVisible }) => {
  return (
    <Button
      className="fixed bottom-4 left-4 z-50 rounded-full p-1 w-10 h-10 flex items-center justify-center"
      onClick={onClick}
      variant="secondary"
      size="icon"
    >
      {isPreviewVisible ? <EyeOff size={20} /> : <Eye size={20} />}
    </Button>
  );
};

export default MobilePreviewButton;