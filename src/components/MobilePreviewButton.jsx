import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MobilePreviewButton = ({ onClick, isPreviewVisible }) => {
  return (
    <Button
      className="fixed bottom-4 right-4 z-10 rounded-full p-3"
      onClick={onClick}
      variant="secondary"
    >
      {isPreviewVisible ? <EyeOff size={24} /> : <Eye size={24} />}
    </Button>
  );
};

export default MobilePreviewButton;