import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Header from './Header';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import MobileMenu from './MobileMenu';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import FontPanel from './FontPanel';
import IconPanel from './IconPanel';
import ToolsPanel from './ToolsPanel';
import MobilePreviewButton from './MobilePreviewButton';

const CodeEditor = () => {
  const [state, setState] = useState({
    htmlCode: '',
    cssCode: '',
    jsCode: '',
    preview: '',
    showSettings: false,
    showSavedCodes: false,
    showFontPanel: false,
    showIconPanel: false,
    showToolsPanel: false,
    settings: {
      editorTheme: 'vscodeDark',
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
      enableAutocompletion: true,
    },
    currentCodeName: 'Untitled',
    isMobile: window.innerWidth < 768,
    previewSize: 50,
    isMenuOpen: false,
    showMobilePreview: false,
  });

  const resizerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setState(s => ({ ...s, isMobile: window.innerWidth < 768 }));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
      if (state.settings.autoSave) saveToLocalStorage();
    }, 300);
    return () => clearTimeout(debounce);
  }, [state.htmlCode, state.cssCode, state.jsCode, state.settings.autoSave]);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const updatePreview = () => {
    setState(s => ({
      ...s,
      preview: `
        <html>
          <head><style>${s.cssCode}</style></head>
          <body>${s.htmlCode}<script>${s.jsCode}</script></body>
        </html>
      `
    }));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('codeEditorState', JSON.stringify({
      htmlCode: state.htmlCode,
      cssCode: state.cssCode,
      jsCode: state.jsCode,
      settings: state.settings,
      currentCodeName: state.currentCodeName
    }));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('codeEditorState');
    if (savedState) {
      const { htmlCode, cssCode, jsCode, settings: savedSettings, currentCodeName } = JSON.parse(savedState);
      setState(s => ({
        ...s,
        htmlCode,
        cssCode,
        jsCode,
        settings: savedSettings,
        currentCodeName: currentCodeName || 'Untitled'
      }));
    }
  };

  const saveCurrentCode = () => {
    const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    const newSavedCode = {
      id: Date.now(),
      name: state.currentCodeName,
      html: state.htmlCode,
      css: state.cssCode,
      js: state.jsCode,
      date: new Date().toISOString(),
    };
    savedCodes.push(newSavedCode);
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
    alert('Code saved successfully!');
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    const startPreviewSize = state.previewSize;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      const newPreviewSize = Math.max(0, Math.min(100, startPreviewSize - (deltaY / window.innerHeight) * 100));
      setState(s => ({ ...s, previewSize: newPreviewSize }));
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const toggleLayout = () => {
    setState(s => ({
      ...s,
      settings: {
        ...s.settings,
        layout: s.settings.layout === 'horizontal' ? 'vertical' : s.settings.layout === 'vertical' ? 'stacked' : 'horizontal'
      }
    }));
  };

  const toggleMobilePreview = () => {
    setState(s => ({ ...s, showMobilePreview: !s.showMobilePreview }));
  };

  const renderEditors = () => (
    <EditorPanel
      htmlCode={state.htmlCode}
      cssCode={state.cssCode}
      jsCode={state.jsCode}
      setHtmlCode={(code) => setState(s => ({ ...s, htmlCode: code }))}
      setCssCode={(code) => setState(s => ({ ...s, cssCode: code }))}
      setJsCode={(code) => setState(s => ({ ...s, jsCode: code }))}
      settings={state.settings}
      setShowToolsPanel={() => setState(s => ({ ...s, showToolsPanel: true }))}
      isMobile={state.isMobile}
    />
  );

  const renderLayout = () => {
    const editorPanel = renderEditors();
    const previewPanel = <PreviewPanel preview={state.preview} />;

    if (state.isMobile) {
      return (
        <div className="h-full relative">
          {editorPanel}
          <MobilePreviewButton onClick={toggleMobilePreview} isPreviewVisible={state.showMobilePreview} />
          {state.showMobilePreview && (
            <div className="fixed inset-0 z-50 bg-gray-900">
              {previewPanel}
              <button
                onClick={toggleMobilePreview}
                className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
              >
                Close
              </button>
            </div>
          )}
        </div>
      );
    } else {
      const panelConfig = {
        horizontal: [previewPanel, editorPanel],
        vertical: [editorPanel, previewPanel],
        stacked: [editorPanel, previewPanel]
      };

      const [leftPanel, rightPanel] = panelConfig[state.settings.layout];

      return (
        <PanelGroup direction={state.settings.layout === 'stacked' ? 'vertical' : 'horizontal'} className="h-full">
          <Panel minSize={0} defaultSize={50}>
            {leftPanel}
          </Panel>
          <PanelResizeHandle className={state.settings.layout === 'stacked' ? 'h-2' : 'w-2'}>
            <div className={`${state.settings.layout === 'stacked' ? 'h-0.5 w-full' : 'w-0.5 h-full'} bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200`}></div>
          </PanelResizeHandle>
          <Panel minSize={0} defaultSize={50}>
            {rightPanel}
          </Panel>
        </PanelGroup>
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <Header
        currentCodeName={state.currentCodeName}
        setCurrentCodeName={(name) => setState(s => ({ ...s, currentCodeName: name }))}
        isMobile={state.isMobile}
        saveCurrentCode={saveCurrentCode}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true }))}
        setShowIconPanel={() => setState(s => ({ ...s, showIconPanel: true }))}
        setShowSettings={() => setState(s => ({ ...s, showSettings: true }))}
        setIsMenuOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        toggleLayout={toggleLayout}
        layout={state.settings.layout}
      />
      <div className="flex-grow overflow-hidden">
        {renderLayout()}
      </div>
      {state.showSettings && (
        <Settings
          settings={state.settings}
          setSettings={(newSettings) => setState(s => ({ ...s, settings: newSettings }))}
          onClose={() => setState(s => ({ ...s, showSettings: false }))}
          isMobile={state.isMobile}
        />
      )}
      {state.showSavedCodes && (
        <SavedCodes
          onClose={() => setState(s => ({ ...s, showSavedCodes: false }))}
          onLoad={(code) => {
            setState(s => ({
              ...s,
              htmlCode: code.html,
              cssCode: code.css,
              jsCode: code.js,
              currentCodeName: code.name,
              showSavedCodes: false
            }));
          }}
          isMobile={state.isMobile}
        />
      )}
      {state.showFontPanel && (
        <FontPanel onClose={() => setState(s => ({ ...s, showFontPanel: false }))} isMobile={state.isMobile} />
      )}
      {state.showIconPanel && (
        <IconPanel onClose={() => setState(s => ({ ...s, showIconPanel: false }))} isMobile={state.isMobile} />
      )}
      {state.showToolsPanel && (
        <ToolsPanel onClose={() => setState(s => ({ ...s, showToolsPanel: false }))} />
      )}
      <MobileMenu
        isOpen={state.isMenuOpen}
        setIsOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        setShowSettings={() => setState(s => ({ ...s, showSettings: true, isMenuOpen: false }))}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true, isMenuOpen: false }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true, isMenuOpen: false }))}
        setShowIconPanel={() => setState(s => ({ ...s, showIconPanel: true, isMenuOpen: false }))}
        saveCurrentCode={() => { saveCurrentCode(); setState(s => ({ ...s, isMenuOpen: false })); }}
      />
    </div>
  );
};

export default CodeEditor;