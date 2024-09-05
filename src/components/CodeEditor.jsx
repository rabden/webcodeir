import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { githubDark } from '@uiw/codemirror-theme-github';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu } from 'lucide-react';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import FontPanel from './FontPanel';
import { autocompletion } from '@codemirror/autocomplete';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EditorView } from '@codemirror/view';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CodeEditor = () => {
  const [code, setCode] = useState({ html: '', css: '', js: '' });
  const [preview, setPreview] = useState('');
  const [showPanels, setShowPanels] = useState({ settings: false, savedCodes: false, fontPanel: false });
  const [settings, setSettings] = useState({
    editorTheme: 'dracula',
    fontSize: 14,
    autoSave: true,
    tabSize: 2,
    lineNumbers: true,
    wordWrap: false,
    indentWithTabs: true,
    highlightActiveLine: true,
    layout: 'vertical',
    cursorStyle: 'line',
    matchBrackets: true,
    minimap: false,
    scrollSpeed: 5,
  });
  const [currentCodeName, setCurrentCodeName] = useState('Untitled');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const themes = { dracula, vscodeDark, solarizedDark, githubDark, monokai };

  useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
      if (settings.autoSave) saveToLocalStorage();
    }, 300);
    return () => clearTimeout(debounce);
  }, [code, settings.autoSave]);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const updatePreview = () => {
    setPreview(`
      <html>
        <head><style>${code.css}</style></head>
        <body>${code.html}<script>${code.js}</script></body>
      </html>
    `);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('codeEditorState', JSON.stringify({ code, settings, currentCodeName }));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('codeEditorState');
    if (savedState) {
      const { code: savedCode, settings: savedSettings, currentCodeName } = JSON.parse(savedState);
      setCode(savedCode);
      setSettings(savedSettings);
      setCurrentCodeName(currentCodeName || 'Untitled');
    }
  };

  const saveCurrentCode = () => {
    const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    const newSavedCode = {
      id: Date.now(),
      name: currentCodeName,
      ...code,
      date: new Date().toISOString(),
    };
    savedCodes.push(newSavedCode);
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
    alert('Code saved successfully!');
  };

  const renderEditor = (language) => (
    <Panel minSize={20}>
      <div className="h-full flex flex-col">
        <div className="bg-[#2d2d2d] p-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${language === 'html' ? 'bg-[#ff5f56]' : language === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
            <span className="text-sm font-semibold">{language.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          <CodeMirror
            value={code[language]}
            height="100%"
            theme={themes[settings.editorTheme]}
            extensions={[
              language === 'html' ? html() : language === 'css' ? css() : javascript(),
              autocompletion(),
              EditorView.lineWrapping,
            ]}
            onChange={(value) => setCode(prev => ({ ...prev, [language]: value }))}
            style={{
              height: '100%',
              fontSize: `${settings.fontSize}px`,
            }}
            className="h-full"
            basicSetup={{
              lineNumbers: settings.lineNumbers,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false,
              tabSize: settings.tabSize,
              highlightActiveLine: settings.highlightActiveLine,
              bracketMatching: settings.matchBrackets,
            }}
            indentWithTab={settings.indentWithTabs}
          />
        </div>
      </div>
    </Panel>
  );

  const renderLayout = () => {
    const editorsPanel = (
      <PanelGroup direction="vertical">
        {renderEditor('html')}
        <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
        {renderEditor('css')}
        <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
        {renderEditor('js')}
      </PanelGroup>
    );

    const previewPanel = (
      <Panel>
        <iframe
          title="preview"
          srcDoc={preview}
          className="w-full h-full border-none bg-white"
          sandbox="allow-scripts"
        />
      </Panel>
    );

    if (isMobile) {
      return (
        <PanelGroup direction="vertical">
          {editorsPanel}
          <PanelResizeHandle className="h-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
          {previewPanel}
        </PanelGroup>
      );
    } else {
      switch (settings.layout) {
        case 'editorsLeft':
          return (
            <PanelGroup direction="horizontal">
              <Panel minSize={30}>{editorsPanel}</Panel>
              <PanelResizeHandle className="w-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
              {previewPanel}
            </PanelGroup>
          );
        case 'editorsRight':
          return (
            <PanelGroup direction="horizontal">
              {previewPanel}
              <PanelResizeHandle className="w-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
              <Panel minSize={30}>{editorsPanel}</Panel>
            </PanelGroup>
          );
        case 'previewBottom':
          return (
            <PanelGroup direction="vertical">
              <Panel minSize={30}>
                <PanelGroup direction="horizontal">
                  {renderEditor('html')}
                  <PanelResizeHandle className="w-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
                  {renderEditor('css')}
                  <PanelResizeHandle className="w-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
                  {renderEditor('js')}
                </PanelGroup>
              </Panel>
              <PanelResizeHandle className="h-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
              {previewPanel}
            </PanelGroup>
          );
        default:
          return null;
      }
    }
  };

  const renderMobileMenu = () => (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Menu</h2>
        <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>
      <nav className="p-4 flex flex-col space-y-4">
        <Button onClick={() => { setShowPanels(prev => ({ ...prev, settings: true })); setIsMenuOpen(false); }} className="justify-start">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button onClick={() => { setShowPanels(prev => ({ ...prev, savedCodes: true })); setIsMenuOpen(false); }} className="justify-start">
          <BookOpen className="mr-2 h-4 w-4" />
          Saved Codes
        </Button>
        <Button onClick={() => { setShowPanels(prev => ({ ...prev, fontPanel: true })); setIsMenuOpen(false); }} className="justify-start">
          <Type className="mr-2 h-4 w-4" />
          Font Library
        </Button>
        <Button onClick={() => { saveCurrentCode(); setIsMenuOpen(false); }} className="justify-start">
          <Save className="mr-2 h-4 w-4" />
          Save Current Code
        </Button>
      </nav>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <header className="bg-black p-2 flex justify-between items-center">
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
            <Select
              value={settings.layout}
              onValueChange={(value) => setSettings(prev => ({ ...prev, layout: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="editorsLeft">Editors Left</SelectItem>
                <SelectItem value="editorsRight">Editors Right</SelectItem>
                <SelectItem value="previewBottom">Preview Bottom</SelectItem>
              </SelectContent>
            </Select>
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
                    onClick={() => setShowPanels(prev => ({ ...prev, savedCodes: !prev.savedCodes }))}
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
                    onClick={() => setShowPanels(prev => ({ ...prev, fontPanel: !prev.fontPanel }))}
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
                    onClick={() => setShowPanels(prev => ({ ...prev, settings: !prev.settings }))}
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
      <div className="flex-grow overflow-hidden">
        {renderLayout()}
      </div>
      {showPanels.settings && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowPanels(prev => ({ ...prev, settings: false }))}
          isMobile={isMobile}
        />
      )}
      {showPanels.savedCodes && (
        <SavedCodes
          onClose={() => setShowPanels(prev => ({ ...prev, savedCodes: false }))}
          onLoad={(loadedCode) => {
            setCode(loadedCode);
            setCurrentCodeName(loadedCode.name);
            setShowPanels(prev => ({ ...prev, savedCodes: false }));
          }}
          isMobile={isMobile}
        />
      )}
      {showPanels.fontPanel && (
        <FontPanel onClose={() => setShowPanels(prev => ({ ...prev, fontPanel: false }))} isMobile={isMobile} />
      )}
      {renderMobileMenu()}
    </div>
  );
};

export default CodeEditor;