import { useState } from 'react';

const useCodeEditorState = () => {
  const [state, setState] = useState({
    htmlCode: '',
    cssCode: '',
    jsCode: '',
    preview: '',
    showSettings: false,
    showSavedCodes: false,
    showFontPanel: false,
    showToolsPanel: false,
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
  });

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

  return {
    state,
    setState,
    updatePreview,
    saveToLocalStorage,
    loadFromLocalStorage,
    saveCurrentCode,
  };
};

export default useCodeEditorState;