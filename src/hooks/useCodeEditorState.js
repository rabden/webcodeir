import { useState } from 'react';

export const useCodeEditorState = () => {
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
      fontSize: 14,
      autoSave: true,
      tabSize: 2,
      lineNumbers: true,
      indentWithTabs: true,
      highlightActiveLine: true,
      layout: 'horizontal',
      cursorStyle: 'line',
      matchBrackets: true,
      minimap: false,
      scrollSpeed: 5,
      enableAutocompletion: true,
      tabMode: false,
    },
    currentCodeName: 'Untitled',
    isMobile: window.innerWidth < 768,
    previewSize: 50,
    isMenuOpen: false,
    showMobilePreview: false,
    activeTab: 'html',
  });

  return [state, setState];
};