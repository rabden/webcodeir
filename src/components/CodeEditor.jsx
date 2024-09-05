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
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Header from './Header';
import MobileMenu from './MobileMenu';

const initialCode = {
  html: '<!-- HTML code here -->',
  css: '/* CSS code here */',
  js: '// JavaScript code here'
};

const themes = { dracula, vscodeDark, solarizedDark, githubDark, monokai };

const CodeEditor = () => {
  const [code, setCode] = useState(initialCode);
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
    layout: 'editorsLeft',
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

  const renderLayout = () => {
    const editorsPanel = (
      <PanelGroup direction="vertical">
        <EditorPanel language="html" code={code.html} setCode={setCode} settings={settings} themes={themes} />
        <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
        <EditorPanel language="css" code={code.css} setCode={setCode} settings={settings} themes={themes} />
        <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
        <EditorPanel language="js" code={code.js} setCode={setCode} settings={settings} themes={themes} />
      </PanelGroup>
    );

    const previewPanel = (
      <Panel>
        <PreviewPanel preview={preview} />
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
                  <EditorPanel language="html" code={code.html} setCode={setCode} settings={settings} themes={themes} />
                  <PanelResizeHandle className="w-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
                  <EditorPanel language="css" code={code.css} setCode={setCode} settings={settings} themes={themes} />
                  <PanelResizeHandle className="w-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
                  <EditorPanel language="js" code={code.js} setCode={setCode} settings={settings} themes={themes} />
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

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <Header
        currentCodeName={currentCodeName}
        setCurrentCodeName={setCurrentCodeName}
        isMobile={isMobile}
        settings={settings}
        setSettings={setSettings}
        saveCurrentCode={saveCurrentCode}
        setShowPanels={setShowPanels}
        setIsMenuOpen={setIsMenuOpen}
      />
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
      <MobileMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        setShowPanels={setShowPanels}
        saveCurrentCode={saveCurrentCode}
      />
    </div>
  );
};

export default CodeEditor;