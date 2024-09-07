import React from 'react';
import { Settings as SettingsIcon, Save, Menu, LayoutPanelLeft, LayoutPanelTop, Layout, Keyboard, ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  setActiveTab,
  toggleConsole,
  showConsole,
  toggleSnippetLibrary,
  showSnippetLibrary,
  setShowCssToolsPanel,
  setShowHtmlToolsPanel,
  setShowJsToolsPanel
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

  const renderButton = (icon, onClick, tooltip) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className="text-white hover:bg-gray-700"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );

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
            {renderButton(<Save className="w-5 h-5" />, saveCurrentCode, "Save current code (Ctrl + S)")}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-gray-700">
                  Library <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-700 text-white">
                <DropdownMenuItem onSelect={() => setShowSavedCodes(true)}>Saved Codes</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowFontPanel(true)}>Font Library</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowIconPanel(true)}>Icon Library</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowPexelsPanel(true)}>Pexels Images</DropdownMenuItem>
                <DropdownMenuItem onSelect={toggleSnippetLibrary}>
                  {showSnippetLibrary ? 'Hide' : 'Show'} Snippet Library
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-gray-700">
                  Tools <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-700 text-white">
                <DropdownMenuItem onSelect={toggleConsole}>
                  {showConsole ? 'Hide' : 'Show'} Console
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowHtmlToolsPanel(true)}>HTML Tools</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowCssToolsPanel(true)}>CSS Tools</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowJsToolsPanel(true)}>JS Tools</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {renderButton(getLayoutIcon(), toggleLayout, "Toggle Layout (Ctrl + L)")}
            {renderButton(<Keyboard className="w-5 h-5" />, () => setShowKeyboardShortcuts(true), "Keyboard Shortcuts (Ctrl + /)")}
            {renderButton(<SettingsIcon className="w-5 h-5" />, () => setShowSettings(true), "Settings (Ctrl + ,)")}
          </TooltipProvider>
        </div>
      )}
    </header>
  );
};

export default Header;