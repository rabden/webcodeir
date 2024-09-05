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
import useCodeEditorState from '../hooks/useCodeEditorState';
import useLayoutManager from '../hooks/useLayoutManager';

const CodeEditor = () => {
  const {
    state,
    setState,
    updatePreview,
    saveToLocalStorage,
    loadFromLocalStorage,
    saveCurrentCode,
  } = useCodeEditorState();

  const {
    renderLayout,
    toggleLayout,
    handleTouchStart,
  } = useLayoutManager(state, setState, updatePreview);

  const resizerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setState(s => ({ ...s, isMobile: window.innerWidth < 768 }));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setState]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
      if (state.settings.autoSave) saveToLocalStorage();
    }, 300);
    return () => clearTimeout(debounce);
  }, [state.htmlCode, state.cssCode, state.jsCode, state.settings.autoSave, updatePreview, saveToLocalStorage]);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <Header
        currentCodeName={state.currentCodeName}
        setCurrentCodeName={(name) => setState(s => ({ ...s, currentCodeName: name }))}
        isMobile={state.isMobile}
        saveCurrentCode={saveCurrentCode}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true }))}
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
      {state.showToolsPanel && (
        <ToolsPanel onClose={() => setState(s => ({ ...s, showToolsPanel: false }))} isMobile={state.isMobile} />
      )}
      <MobileMenu
        isOpen={state.isMenuOpen}
        setIsOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        setShowSettings={() => setState(s => ({ ...s, showSettings: true, isMenuOpen: false }))}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true, isMenuOpen: false }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true, isMenuOpen: false }))}
        saveCurrentCode={() => { saveCurrentCode(); setState(s => ({ ...s, isMenuOpen: false })); }}
      />
    </div>
  );
};

export default CodeEditor;