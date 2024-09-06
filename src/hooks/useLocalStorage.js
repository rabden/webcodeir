export const useLocalStorage = (setState) => {
  const saveToLocalStorage = (state) => {
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

  return { saveToLocalStorage, loadFromLocalStorage };
};