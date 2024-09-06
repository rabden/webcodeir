import React, { useState, useEffect } from 'react';
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
import { useCodeEditorState } from '../hooks/useCodeEditorState';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CodeEditor = () => {
  const [state, setState] = useCodeEditorState();
  const { saveToLocalStorage, loadFromLocalStorage } = useLocalStorage(setState);

  useEffect(() => {
    loadFromLocalStorage();
    const handleResize = () => setState(s => ({ ...s, isMobile: window.innerWidth < 768 }));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
      if (state.settings.autoSave) saveToLocalStorage(state);
    }, 300);
    return () => clearTimeout(debounce);
  }, [state.htmlCode, state.cssCode, state.jsCode, state.settings.autoSave]);

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
      setShowCssToolsPanel={() => setState(s => ({ ...s, showCssToolsPanel: true }))}
      setShowHtmlToolsPanel={() => setState(s => ({ ...s, showHtmlToolsPanel: true }))}
      setShowJsToolsPanel={() => setState(s => ({ ...s, showJsToolsPanel: true }))}
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
            <div className="fixed inset-0 z-40 bg-gray-900">
              {previewPanel}
              <MobilePreviewButton onClick={toggleMobilePreview} isPreviewVisible={state.showMobilePreview} />
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
        <IconPanel onClose={() => setState(s => ({ ...s, showIconPanel: false }))} isMobile={state.iMobile} />
      )}
      {state.showCssToolsPanel && (
        <ToolsPanel onClose={() => setState(s => ({ ...s, showCssToolsPanel: false }))} type="css" />
      )}
      {state.showHtmlToolsPanel && (
        <ToolsPanel onClose={() => setState(s => ({ ...s, showHtmlToolsPanel: false }))} type="html" />
      )}
      {state.showJsToolsPanel && (
        <ToolsPanel onClose={() => setState(s => ({ ...s, showJsToolsPanel: false }))} type="js" />
      )}
      <MobileMenu
        isOpen={state.isMenuOpen}
        setIsOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        setShowSettings={() => setState(s => ({ ...s, showSettings: true, isMenuOpen: false }))}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true, isMenuOpen: false }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true, isMenuOpen: false }))}
        setShowIconPanel={() => setState(s => ({ ...s, showIconPanel: true, isMenuOpen: false }))}
        setShowCssToolsPanel={() => setState(s => ({ ...s, showCssToolsPanel: true, isMenuOpen: false }))}
        setShowHtmlToolsPanel={() => setState(s => ({ ...s, showHtmlToolsPanel: true, isMenuOpen: false }))}
        setShowJsToolsPanel={() => setState(s => ({ ...s, showJsToolsPanel: true, isMenuOpen: false }))}
        saveCurrentCode={() => { saveCurrentCode(); setState(s => ({ ...s, isMenuOpen: false })); }}
      />
    </div>
  );
};

export default CodeEditor;