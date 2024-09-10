import React from 'react';
import { Settings as SettingsIcon, Save, Menu, LayoutPanelLeft, LayoutPanelTop, Layout, Keyboard, Library, Wrench, BookOpen, Type, Image, Code, Terminal, Palette } from 'lucide-react';
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
  setShowCodeToolsPanel,
  setCodeToolsInitialTab,
  setShowAIImageGeneratorPanel,
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
          className="text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
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
    <header className="bg-gray-900 p-2 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center space-x-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6 text-gray-300" />
          </Button>
        )}
        <input
          type="text"
          value={currentCodeName}
          onChange={(e) => setCurrentCodeName(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-300 max-w-[150px] sm:max-w-none"
        />
      </div>
      {isMobile && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow mx-2">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="html" className="text-xs text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">HTML</TabsTrigger>
            <TabsTrigger value="css" className="text-xs text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">CSS</TabsTrigger>
            <TabsTrigger value="js" className="text-xs text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">JS</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      {!isMobile && (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            {renderButton(<Save className="w-5 h-5" />, saveCurrentCode, "Save current code (Ctrl + S)")}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-700">
                  <Library className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 text-gray-300 border-gray-700">
                <DropdownMenuItem onSelect={() => setShowSavedCodes(true)} className="hover:bg-gray-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Saved Codes</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowFontPanel(true)} className="hover:bg-gray-700">
                  <Type className="w-4 h-4 mr-2" />
                  <span>Font Library</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowIconPanel(true)} className="hover:bg-gray-700">
                  <Image className="w-4 h-4 mr-2" />
                  <span>Icon Library</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowPexelsPanel(true)} className="hover:bg-gray-700">
                  <Image className="w-4 h-4 mr-2" />
                  <span>Pexels Images</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={toggleSnippetLibrary} className="hover:bg-gray-700">
                  <Code className="w-4 h-4 mr-2" />
                  <span>{showSnippetLibrary ? 'Hide' : 'Show'} Snippet Library</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-700">
                  <Wrench className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 text-gray-300 border-gray-700">
                <DropdownMenuItem onSelect={toggleConsole} className="hover:bg-gray-700">
                  <Terminal className="w-4 h-4 mr-2" />
                  <span>{showConsole ? 'Hide' : 'Show'} Console</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setShowCodeToolsPanel(true); setCodeToolsInitialTab('html'); }} className="hover:bg-gray-700">
                  <Code className="w-4 h-4 mr-2" />
                  <span>HTML Tools</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setShowCodeToolsPanel(true); setCodeToolsInitialTab('css'); }} className="hover:bg-gray-700">
                  <Palette className="w-4 h-4 mr-2" />
                  <span>CSS Tools</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setShowCodeToolsPanel(true); setCodeToolsInitialTab('js'); }} className="hover:bg-gray-700">
                  <Code className="w-4 h-4 mr-2" />
                  <span>JS Tools</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowAIImageGeneratorPanel(true)} className="hover:bg-gray-700">
                  <Image className="w-4 h-4 mr-2" />
                  <span>AI Image Generator</span>
                </DropdownMenuItem>
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