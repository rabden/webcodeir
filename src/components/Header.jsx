import React from 'react';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu, LayoutPanelLeft, LayoutPanelTop, Layout, Library } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const Header = ({
  currentCodeName,
  setCurrentCodeName,
  isMobile,
  saveCurrentCode,
  setShowSavedCodes,
  setShowFontPanel,
  setShowIconPanel,
  setShowSettings,
  setIsMenuOpen,
  toggleLayout,
  layout
}) => {
  const getLayoutIcon = () => {
    switch (layout) {
      case 'horizontal':
        return <LayoutPanelLeft className="w-5 h-5" />;
      case 'vertical':
        return <LayoutPanelTop className="w-5 h-5" />;
      case 'stacked':
        return <Layout className="w-5 h-5" />;
      default:
        return <LayoutPanelLeft className="w-5 h-5" />;
    }
  };

  return (
    <header className="bg-gray-800 p-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <div className="w-6 h-6 bg-white rounded-sm"></div>
        <input
          type="text"
          value={currentCodeName}
          onChange={(e) => setCurrentCodeName(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none focus:outline-none text-white max-w-[150px] sm:max-w-none"
        />
      </div>
      {!isMobile && (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveCurrentCode}
                  className="text-white hover:bg-gray-700"
                >
                  <Save className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save current code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSavedCodes(true)}
                  className="text-white hover:bg-gray-700"
                >
                  <BookOpen className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Saved Codes</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFontPanel(true)}
                  className="text-white hover:bg-gray-700"
                >
                  <Type className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Font Library</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowIconPanel(true)}
                  className="text-white hover:bg-gray-700"
                >
                  <Library className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Icon Library</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  className="text-white hover:bg-gray-700"
                >
                  <SettingsIcon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLayout}
                  className="text-white hover:bg-gray-700"
                >
                  {getLayoutIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Layout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </header>
  );
};

export default Header;