import React from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MinimizedPanelIcon = ({ onMaximize, type }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={onMaximize}
        className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2"
      >
        <Maximize2 className="h-6 w-6" />
        <span className="sr-only">Maximize {type} Tools Panel</span>
      </Button>
    </div>
  );
};

export default MinimizedPanelIcon;