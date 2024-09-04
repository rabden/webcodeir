import React from 'react';
import { Save, BookOpen, Type, SettingsIcon, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const EditorHeader = ({
  currentCodeName,
  setCurrentCodeName,
  previewWidth,
  isMobile,
  saveCurrentCode,
  setShowSavedCodes,
  setShowFontPanel,
  setShowSettings,
  isMenuOpen,
  setIsMenuOpen,
  handleMenuItemClick
}) => {
  const renderMobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-[#1e1e1e] text-white border-r border-gray-700">
        <nav className="flex flex-col space-y-4">
          <Button onClick={() => handleMenuItemClick(() => setShowSettings(true))} className="justify-start">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button onClick={() => handleMenuItemClick(() => setShowSavedCodes(true))} className="justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            Saved Codes
          </Button>
          <Button onClick={() => handleMenuItemClick(() => setShowFontPanel(true))} className="justify-start">
            <Type className="mr-2 h-4 w-4" />
            Font Library
          </Button>
          <Button onClick={() => handleMenuItemClick(saveCurrentCode)} className="justify-start">
            <Save className="mr-2 h-4 w-4" />
            Save Current Code
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-black p-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {isMobile && renderMobileMenu()}
        <div className="w-6 h-6 bg-white rounded-sm"></div>
        <input
          type="text"
          value={currentCodeName}
          onChange={(e) => setCurrentCodeName(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none focus:outline-none text-white max-w-[150px] sm:max-w-none"
        />
        {!isMobile && (
          <div className="text-sm ml-4 hidden sm:block">
            Preview width: {previewWidth}px
          </div>
        )}
      </div>
      {!isMobile && (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={saveCurrentCode}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <Save className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save current code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowSavedCodes(true)}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Saved Codes</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowFontPanel(true)}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <Type className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Font Library</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </header>
  );
};

export default EditorHeader;