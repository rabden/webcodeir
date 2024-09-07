import React from 'react';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu, LayoutPanelLeft, LayoutPanelTop, Layout, Library, Keyboard, Image, Terminal } from 'lucide-react';
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
  setActiveTab,
  toggleConsole,
  showConsole
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
            {renderButton(<BookOpen className="w-5 h-5" />, () => setShowSavedCodes(true), "Saved Codes (Ctrl + O)")}
            {renderButton(<Type className="w-5 h-5" />, () => setShowFontPanel(true), "Font Library (Ctrl + F)")}
            {renderButton(<Library className="w-5 h-5" />, () => setShowIconPanel(true), "Icon Library (Ctrl + I)")}
            {renderButton(<Image className="w-5 h-5" />, () => setShowPexelsPanel(true), "Pexels Images (Ctrl + U)")}
            {renderButton(getLayoutIcon(), toggleLayout, "Toggle Layout (Ctrl + L)")}
            {renderButton(<Keyboard className="w-5 h-5" />, () => setShowKeyboardShortcuts(true), "Keyboard Shortcuts (Ctrl + /)")}
            {renderButton(<Terminal className="w-5 h-5" />, toggleConsole, `${showConsole ? 'Hide' : 'Show'} Console (Ctrl + J)`)}
            {renderButton(<SettingsIcon className="w-5 h-5" />, () => setShowSettings(true), "Settings (Ctrl + ,)")}
          </TooltipProvider>
        </div>
      )}
    </header>
  );
};

export default Header;