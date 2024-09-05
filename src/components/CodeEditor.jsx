import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Header from './Header';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import MobileMenu from './MobileMenu';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import FontPanel from './FontPanel';
import ToolsPanel from './ToolsPanel';

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [preview, setPreview] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedCodes, setShowSavedCodes] = useState(false);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [showToolsPanel, setShowToolsPanel] = useState(false);
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

  const toggleLayout = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      layout: prevSettings.layout === 'horizontal' ? 'vertical' : prevSettings.layout === 'vertical' ? 'stacked' : 'horizontal'
    }));
  };

  const renderLayout = () => {
    const editorPanel = (
      <EditorPanel
        htmlCode={htmlCode}
        cssCode={cssCode}
        jsCode={jsCode}
        setHtmlCode={setHtmlCode}
        setCssCode={setCssCode}
        setJsCode={setJsCode}
        settings={settings}
        setShowToolsPanel={setShowToolsPanel}
      />
    );

    const previewPanel = (
      <PreviewPanel preview={preview} />
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
      if (settings.layout === 'horizontal') {
        return (
          <PanelGroup direction="horizontal" className="h-full">
            <Panel minSize={0} defaultSize={50}>
              {previewPanel}
            </Panel>
            <PanelResizeHandle className="w-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group">
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
            </PanelResizeHandle>
            <Panel minSize={0} defaultSize={50}>
              {editorPanel}
            </Panel>
          </PanelGroup>
        );
      } else if (settings.layout === 'vertical') {
        return (
          <PanelGroup direction="horizontal" className="h-full">
            <Panel minSize={0} defaultSize={50}>
              {editorPanel}
            </Panel>
            <PanelResizeHandle className="w-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group">
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
            </PanelResizeHandle>
            <Panel minSize={0} defaultSize={50}>
              {previewPanel}
            </Panel>
          </PanelGroup>
        );
      } else {
        return (
          <PanelGroup direction="vertical" className="h-full">
            <Panel minSize={0} defaultSize={50}>
              {editorPanel}
            </Panel>
            <PanelResizeHandle className="h-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group">
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
            </PanelResizeHandle>
            <Panel minSize={0} defaultSize={50}>
              {previewPanel}
            </Panel>
          </PanelGroup>
        );
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <Header
        currentCodeName={currentCodeName}
        setCurrentCodeName={setCurrentCodeName}
        isMobile={isMobile}
        saveCurrentCode={saveCurrentCode}
        setShowSavedCodes={setShowSavedCodes}
        setShowFontPanel={setShowFontPanel}
        setShowSettings={setShowSettings}
        setShowToolsPanel={setShowToolsPanel}
        setIsMenuOpen={setIsMenuOpen}
        toggleLayout={toggleLayout}
        layout={settings.layout}
      />
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
      {showToolsPanel && (
        <ToolsPanel onClose={() => setShowToolsPanel(false)} />
      )}
      <MobileMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        setShowSettings={setShowSettings}
        setShowSavedCodes={setShowSavedCodes}
        setShowFontPanel={setShowFontPanel}
        setShowToolsPanel={setShowToolsPanel}
        saveCurrentCode={saveCurrentCode}
      />
    </div>
  );
};

export default CodeEditor;