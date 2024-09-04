import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula, vscodeDark, solarizedDark, githubDark, monokai } from '@uiw/codemirror-theme-dracula';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu, X } from 'lucide-react';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import FontPanel from './FontPanel';
import { autocompletion } from '@codemirror/autocomplete';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EditorView } from '@codemirror/view';
import { Button } from "@/components/ui/button";

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [preview, setPreview] = useState('');
  const [previewWidth, setPreviewWidth] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedCodes, setShowSavedCodes] = useState(false);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [settings, setSettings] = useState({
    editorTheme: 'dracula',
    fontSize: 14,
    autoSave: true,
    tabSize: 2,
    lineNumbers: true,
    wordWrap: false,
    indentWithTabs: true,
    highlightActiveLine: true,
    layout: 'horizontal',
    cursorStyle: 'line',
    matchBrackets: true,
    minimap: false,
    scrollSpeed: 5,
  });
  const [currentCodeName, setCurrentCodeName] = useState('Untitled');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [previewSize, setPreviewSize] = useState(50);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resizerRef = useRef(null);

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
  }, [htmlCode, cssCode, jsCode, settings.autoSave]);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const updatePreview = () => {
    setPreview(`
      <html>
        <head><style>${cssCode}</style></head>
        <body>${htmlCode}<script>${jsCode}</script></body>
      </html>
    `);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('codeEditorState', JSON.stringify({ htmlCode, cssCode, jsCode, settings, currentCodeName }));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('codeEditorState');
    if (savedState) {
      const { htmlCode, cssCode, jsCode, settings: savedSettings, currentCodeName } = JSON.parse(savedState);
      setHtmlCode(htmlCode);
      setCssCode(cssCode);
      setJsCode(jsCode);
      setSettings(savedSettings);
      setCurrentCodeName(currentCodeName || 'Untitled');
    }
  };

  const saveCurrentCode = () => {
    const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    const newSavedCode = {
      id: Date.now(),
      name: currentCodeName,
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      date: new Date().toISOString(),
    };
    savedCodes.push(newSavedCode);
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
    alert('Code saved successfully!');
  };

  const renderEditor = (language, code, setCode) => (
    <Panel minSize={5} defaultSize={33}>
      <div className="h-full flex flex-col">
        <div className="bg-[#2d2d2d] p-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${language === 'html' ? 'bg-[#ff5f56]' : language === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
            <span className="text-sm font-semibold">{language.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          <CodeMirror
            value={code}
            height="100%"
            theme={themes[settings.editorTheme]}
            extensions={[
              language === 'html' ? html() : language === 'css' ? css() : javascript(),
              autocompletion(),
              EditorView.lineWrapping,
            ]}
            onChange={(value) => setCode(value)}
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

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    const startPreviewSize = previewSize;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      const newPreviewSize = Math.max(0, Math.min(100, startPreviewSize - (deltaY / window.innerHeight) * 100));
      setPreviewSize(newPreviewSize);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const renderLayout = () => {
    const editorPanel = (
      <PanelGroup direction="vertical">
        {renderEditor('html', htmlCode, setHtmlCode)}
        <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
        {renderEditor('css', cssCode, setCssCode)}
        <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
        {renderEditor('js', jsCode, setJsCode)}
      </PanelGroup>
    );

    const previewPanel = (
      <iframe
        title="preview"
        srcDoc={preview}
        className="w-full h-full border-none bg-white"
        sandbox="allow-scripts"
      />
    );

    if (isMobile) {
      return (
        <PanelGroup direction="vertical" className="h-full">
          <Panel minSize={0} maxSize={100} defaultSize={100 - previewSize}>
            {editorPanel}
          </Panel>
          <PanelResizeHandle
            className="h-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group"
            onTouchStart={handleTouchStart}
            ref={resizerRef}
          >
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
          </PanelResizeHandle>
          <Panel minSize={0} maxSize={100} defaultSize={previewSize}>
            {previewPanel}
          </Panel>
        </PanelGroup>
      );
    } else {
      return (
        <PanelGroup direction={settings.layout === 'horizontal' ? 'horizontal' : 'vertical'} className="h-full" onLayout={(sizes) => setPreviewWidth(Math.round(sizes[0] * window.innerWidth / 100))}>
          {settings.layout === 'horizontal' ? (
            <>
              <Panel minSize={0} defaultSize={50}>
                {previewPanel}
              </Panel>
              <PanelResizeHandle className="w-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group">
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
              </PanelResizeHandle>
              <Panel minSize={0} defaultSize={50}>
                {editorPanel}
              </Panel>
            </>
          ) : (
            <>
              <Panel minSize={0} defaultSize={50}>
                {editorPanel}
              </Panel>
              <PanelResizeHandle className="h-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group">
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
              </PanelResizeHandle>
              <Panel minSize={0} defaultSize={50}>
                {previewPanel}
              </Panel>
            </>
          )}
        </PanelGroup>
      );
    }
  };

  const renderMobileMenu = () => (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Menu</h2>
        <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <nav className="p-4 flex flex-col space-y-4">
        <Button onClick={() => { setShowSettings(true); setIsMenuOpen(false); }} className="justify-start">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button onClick={() => { setShowSavedCodes(true); setIsMenuOpen(false); }} className="justify-start">
          <BookOpen className="mr-2 h-4 w-4" />
          Saved Codes
        </Button>
        <Button onClick={() => { setShowFontPanel(true); setIsMenuOpen(false); }} className="justify-start">
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
                    onClick={() => setShowSavedCodes(!showSavedCodes)}
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
                    onClick={() => setShowFontPanel(!showFontPanel)}
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
                    onClick={() => setShowSettings(!showSettings)}
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
      {showSettings && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
          isMobile={isMobile}
        />
      )}
      {showSavedCodes && (
        <SavedCodes
          onClose={() => setShowSavedCodes(false)}
          onLoad={(code) => {
            setHtmlCode(code.html);
            setCssCode(code.css);
            setJsCode(code.js);
            setCurrentCodeName(code.name);
            setShowSavedCodes(false);
          }}
          isMobile={isMobile}
        />
      )}
      {showFontPanel && (
        <FontPanel onClose={() => setShowFontPanel(false)} isMobile={isMobile} />
      )}
      {renderMobileMenu()}
    </div>
  );
};

export default CodeEditor;