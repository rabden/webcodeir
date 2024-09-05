import React from 'react';
import { X, SettingsIcon, BookOpen, Type, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MobileMenu = ({ isOpen, setIsOpen, setShowSettings, setShowSavedCodes, setShowFontPanel, saveCurrentCode }) => {
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Menu</h2>
        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <nav className="p-4 flex flex-col space-y-4">
        <Button onClick={() => { setShowSettings(true); setIsOpen(false); }} className="justify-start">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button onClick={() => { setShowSavedCodes(true); setIsOpen(false); }} className="justify-start">
          <BookOpen className="mr-2 h-4 w-4" />
          Saved Codes
        </Button>
        <Button onClick={() => { setShowFontPanel(true); setIsOpen(false); }} className="justify-start">
          <Type className="mr-2 h-4 w-4" />
          Font Library
        </Button>
        <Button onClick={() => { saveCurrentCode(); setIsOpen(false); }} className="justify-start">
          <Save className="mr-2 h-4 w-4" />
          Save Current Code
        </Button>
      </nav>
    </div>
  );
};

export default MobileMenu;