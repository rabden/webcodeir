export const editorOptions = (settings) => ({
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontSize: settings.fontSize,
  lineNumbers: settings.lineNumbers ? 'on' : 'off',
  tabSize: settings.tabSize,
  insertSpaces: !settings.indentWithTabs,
  wordWrap: 'on',
  wrappingIndent: 'indent',
  theme: 'vs-dark',
  lineNumbersMinChars: 3,
  overviewRulerLanes: 0,
  minimap: {
    enabled: true,
    side: 'right',
    size: 'fit',
    showSlider: 'always',
    renderCharacters: false,
    maxColumn: 120,
    scale: 1
  },
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10
  },
  padding: {
    bottom: '70vh'
  }
});