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
import LibraryTogglePanel from './LibraryTogglePanel';

const CodeEditor = () => {
  const [state, setState] = useState({
    htmlCode: '',
    cssCode: '',
    jsCode: '',
    preview: '',
    showSettings: false,
    showSavedCodes: false,
    showFontPanel: false,
    showToolsPanel: false,
    showLibraryTogglePanel: false,
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
    libraries: {
      'Tailwind CSS': true,
      'Bootstrap': true,
      'Bulma': true,
      'Materialize': true,
      'Foundation': true,
      'React': true,
      'Vue.js': true,
      'Angular': true,
      'jQuery': true,
      'D3.js': true,
    },
    currentCodeName: 'Untitled',
    isMobile: window.innerWidth < 768,
    previewSize: 50,
    isMenuOpen: false,
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
  }, [state.htmlCode, state.cssCode, state.jsCode, state.settings.autoSave, state.libraries]);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const updatePreview = () => {
    const cdnLinks = Object.entries(state.libraries)
      .filter(([_, enabled]) => enabled)
      .map(([name, _]) => {
        switch (name) {
          case 'Tailwind CSS':
            return '<script src="https://cdn.tailwindcss.com"></script>';
          case 'Bootstrap':
            return `
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            `;
          case 'Bulma':
            return '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">';
          case 'Materialize':
            return `
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
            `;
          case 'Foundation':
            return `
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/foundation-sites@6.7.5/dist/css/foundation.min.css">
              <script src="https://cdn.jsdelivr.net/npm/foundation-sites@6.7.5/dist/js/foundation.min.js"></script>
            `;
          case 'React':
            return `
              <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            `;
          case 'Vue.js':
            return '<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>';
          case 'Angular':
            return '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>';
          case 'jQuery':
            return '<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>';
          case 'D3.js':
            return '<script src="https://d3js.org/d3.v7.min.js"></script>';
          default:
            return '';
        }
      })
      .join('\n');

    setState(s => ({
      ...s,
      preview: `
        <html>
          <head>
            <style>${s.cssCode}</style>
            ${cdnLinks}
          </head>
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
      libraries: state.libraries,
      currentCodeName: state.currentCodeName
    }));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('codeEditorState');
    if (savedState) {
      const { htmlCode, cssCode, jsCode, settings: savedSettings, libraries: savedLibraries, currentCodeName } = JSON.parse(savedState);
      setState(s => ({
        ...s,
        htmlCode,
        cssCode,
        jsCode,
        settings: savedSettings,
        libraries: savedLibraries || s.libraries,
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

  const toggleLibrary = (name) => {
    setState(s => ({
      ...s,
      libraries: {
        ...s.libraries,
        [name]: !s.libraries[name]
      }
    }));
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
        setShowSettings={() => setState(s => ({ ...s, showSettings: true }))}
        setShowLibraryTogglePanel={() => setState(s => ({ ...s, showLibraryTogglePanel: true }))}
        setIsMenuOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
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
        <ToolsPanel onClose={() => setState(s => ({ ...s, showToolsPanel: false }))} />
      )}
      {state.showLibraryTogglePanel && (
        <LibraryTogglePanel
          libraries={state.libraries}
          toggleLibrary={toggleLibrary}
          onClose={() => setState(s => ({ ...s, showLibraryTogglePanel: false }))}
        />
      )}
      <MobileMenu
        isOpen={state.isMenuOpen}
        setIsOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        setShowSettings={() => setState(s => ({ ...s, showSettings: true, isMenuOpen: false }))}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true, isMenuOpen: false }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true, isMenuOpen: false }))}
        setShowLibraryTogglePanel={() => setState(s => ({ ...s, showLibraryTogglePanel: true, isMenuOpen: false }))}
        saveCurrentCode={() => { saveCurrentCode(); setState(s => ({ ...s, isMenuOpen: false })); }}
      />
    </div>
  );
};

export default CodeEditor;