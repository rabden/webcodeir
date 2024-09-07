import React from 'react';
import { X, Save, BookOpen, Settings as SettingsIcon, Type, Library, Palette, Code, Wrench, Keyboard, Image, Terminal, BookMarked } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MobileMenu = ({ isOpen, setIsOpen, setShowSettings, setShowSavedCodes, setShowFontPanel, setShowIconPanel, setShowCssToolsPanel, setShowHtmlToolsPanel, setShowJsToolsPanel, setShowKeyboardShortcuts, setShowPexelsPanel, saveCurrentCode, toggleConsole, showConsole, toggleSnippetLibrary, showSnippetLibrary }) => {
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
      <div className="sticky top-0 bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Menu</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>
      <nav className="p-4 space-y-2">
        <MenuButton icon={<Save className="w-4 h-4" />} label="Save Current Code" onClick={() => { saveCurrentCode(); setIsOpen(false); }} />
        <MenuButton icon={<BookOpen className="w-4 h-4" />} label="Saved Codes" onClick={() => { setShowSavedCodes(true); setIsOpen(false); }} />
        <MenuButton icon={<Type className="w-4 h-4" />} label="Font Library" onClick={() => { setShowFontPanel(true); setIsOpen(false); }} />
        <MenuButton icon={<Library className="w-4 h-4" />} label="Icon Library" onClick={() => { setShowIconPanel(true); setIsOpen(false); }} />
        <MenuButton icon={<Image className="w-4 h-4" />} label="Pexels Images" onClick={() => { setShowPexelsPanel(true); setIsOpen(false); }} />
        <MenuButton icon={<Palette className="w-4 h-4" />} label="CSS Tools" onClick={() => { setShowCssToolsPanel(true); setIsOpen(false); }} />
        <MenuButton icon={<Code className="w-4 h-4" />} label="HTML Tools" onClick={() => { setShowHtmlToolsPanel(true); setIsOpen(false); }} />
        <MenuButton icon={<Wrench className="w-4 h-4" />} label="JS Tools" onClick={() => { setShowJsToolsPanel(true); setIsOpen(false); }} />
        <MenuButton icon={<Keyboard className="w-4 h-4" />} label="Keyboard Shortcuts" onClick={() => { setShowKeyboardShortcuts(true); setIsOpen(false); }} />
        <MenuButton icon={<Terminal className="w-4 h-4" />} label={`${showConsole ? 'Hide' : 'Show'} Console`} onClick={() => { toggleConsole(); setIsOpen(false); }} />
        <MenuButton icon={<BookMarked className="w-4 h-4" />} label={`${showSnippetLibrary ? 'Hide' : 'Show'} Snippet Library`} onClick={() => { toggleSnippetLibrary(); setIsOpen(false); }} />
        <MenuButton icon={<SettingsIcon className="w-4 h-4" />} label="Settings" onClick={() => { setShowSettings(true); setIsOpen(false); }} />
      </nav>
    </div>
  );
};

const MenuButton = ({ icon, label, onClick }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
  >
    <span className="flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </span>
  </Button>
);

export default MobileMenu;