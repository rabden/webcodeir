import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula, vscodeDark, solarizedDark, githubDark, monokai } from '@uiw/codemirror-theme-dracula';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu } from 'lucide-react';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import FontPanel from './FontPanel';
import { autocompletion } from '@codemirror/autocomplete';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EditorView } from '@codemirror/view';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EditorHeader from './EditorHeader';
import EditorLayout from './EditorLayout';

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
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

  const handleMenuItemClick = (action) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <EditorHeader
        currentCodeName={currentCodeName}
        setCurrentCodeName={setCurrentCodeName}
        previewWidth={previewWidth}
        isMobile={isMobile}
        saveCurrentCode={saveCurrentCode}
        setShowSavedCodes={setShowSavedCodes}
        setShowFontPanel={setShowFontPanel}
        setShowSettings={setShowSettings}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        handleMenuItemClick={handleMenuItemClick}
      />
      <div className="flex-grow overflow-hidden">
        <EditorLayout
          isMobile={isMobile}
          previewSize={previewSize}
          setPreviewSize={setPreviewSize}
          preview={preview}
          htmlCode={htmlCode}
          setHtmlCode={setHtmlCode}
          cssCode={cssCode}
          setCssCode={setCssCode}
          jsCode={jsCode}
          setJsCode={setJsCode}
          settings={settings}
          setPreviewWidth={setPreviewWidth}
        />
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
    </div>
  );
};

export default CodeEditor;