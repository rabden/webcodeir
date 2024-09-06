import React from 'react';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu, LayoutPanelLeft, LayoutPanelTop, Layout, Library, Keyboard, Image } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  layout,
  setShowKeyboardShortcuts,
  setShowPexelsPanel,
  activeTab,
  setActiveTab
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
        <input
          type="text"
          value={currentCodeName}
          onChange={(e) => setCurrentCodeName(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none focus:outline-none text-white max-w-[150px] sm:max-w-none"
        />
      </div>
      {isMobile && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow mx-2">
          <TabsList className="bg-gray-700">
            <TabsTrigger value="html" className="text-xs">HTML</TabsTrigger>
            <TabsTrigger value="css" className="text-xs">CSS</TabsTrigger>
            <TabsTrigger value="js" className="text-xs">JS</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
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
                <p>Save current code (Ctrl + S)</p>
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
                <p>Saved Codes (Ctrl + O)</p>
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
                <p>Font Library (Ctrl + F)</p>
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
                <p>Icon Library (Ctrl + I)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPexelsPanel(true)}
                  className="text-white hover:bg-gray-700"
                >
                  <Image className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pexels Images (Ctrl + U)</p>
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
                <p>Toggle Layout (Ctrl + L)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="text-white hover:bg-gray-700"
                >
                  <Keyboard className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard Shortcuts (Ctrl + /)</p>
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
                <p>Settings (Ctrl + ,)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </header>
  );
};

export default Header;