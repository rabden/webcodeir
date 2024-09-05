import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Header from './Header';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import MobileMenu from './MobileMenu';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import FontPanel from './FontPanel';

const CodeEditor = () => {
  const [state, setState] = useState({
    htmlCode: '',
    cssCode: '',
    jsCode: '',
    preview: '',
    showSettings: false,
    showSavedCodes: false,
    showFontPanel: false,
    settings: {
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
    },
    currentCodeName: 'Untitled',
    isMobile: window.innerWidth < 768,
    previewSize: 50,
    isMenuOpen: false,
    user: null,
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
    const { htmlCode, cssCode, jsCode, settings, currentCodeName, user } = state;
    localStorage.setItem('codeEditorState', JSON.stringify({ htmlCode, cssCode, jsCode, settings, currentCodeName, user }));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('codeEditorState');
    if (savedState) {
      const { htmlCode, cssCode, jsCode, settings: savedSettings, currentCodeName, user: savedUser } = JSON.parse(savedState);
      setState(s => ({
        ...s,
        htmlCode,
        cssCode,
        jsCode,
        settings: savedSettings,
        currentCodeName: currentCodeName || 'Untitled',
        user: savedUser
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

  const handleUpdateUser = (updatedUser) => {
    setState(s => ({ ...s, user: updatedUser }));
    saveToLocalStorage();
  };

  const handleGoogleLogin = (googleUser) => {
    setState(s => ({ ...s, user: googleUser }));
    saveToLocalStorage();
  };

  const renderLayout = () => {
    const editorPanel = (
      <EditorPanel
        htmlCode={state.htmlCode}
        cssCode={state.cssCode}
        jsCode={state.jsCode}
        setHtmlCode={(code) => setState(s => ({ ...s, htmlCode: code }))}
        setCssCode={(code) => setState(s => ({ ...s, cssCode: code }))}
        setJsCode={(code) => setState(s => ({ ...s, jsCode: code }))}
        settings={state.settings}
      />
    );

    const previewPanel = (
      <PreviewPanel preview={state.preview} />
    );

    if (state.isMobile) {
      return (
        <PanelGroup direction="vertical" className="h-full">
          <Panel minSize={0} maxSize={100} defaultSize={100 - state.previewSize}>
            {editorPanel}
          </Panel>
          <PanelResizeHandle
            className="h-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group"
            onTouchStart={handleTouchStart}
            ref={resizerRef}
          >
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
          </PanelResizeHandle>
          <Panel minSize={0} maxSize={100} defaultSize={state.previewSize}>
            {previewPanel}
          </Panel>
        </PanelGroup>
      );
    } else {
      if (state.settings.layout === 'horizontal') {
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
      } else if (state.settings.layout === 'vertical') {
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
        currentCodeName={state.currentCodeName}
        setCurrentCodeName={(name) => setState(s => ({ ...s, currentCodeName: name }))}
        isMobile={state.isMobile}
        saveCurrentCode={saveCurrentCode}
        setShowSavedCodes={(show) => setState(s => ({ ...s, showSavedCodes: show }))}
        setShowFontPanel={(show) => setState(s => ({ ...s, showFontPanel: show }))}
        setShowSettings={(show) => setState(s => ({ ...s, showSettings: show }))}
        setIsMenuOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        toggleLayout={toggleLayout}
        layout={state.settings.layout}
        user={state.user}
        onUpdateUser={handleUpdateUser}
        onGoogleLogin={handleGoogleLogin}
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
      <MobileMenu
        isOpen={state.isMenuOpen}
        setIsOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        setShowSettings={(show) => setState(s => ({ ...s, showSettings: show }))}
        setShowSavedCodes={(show) => setState(s => ({ ...s, showSavedCodes: show }))}
        setShowFontPanel={(show) => setState(s => ({ ...s, showFontPanel: show }))}
        saveCurrentCode={saveCurrentCode}
      />
    </div>
  );
};

export default CodeEditor;