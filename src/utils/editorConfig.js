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
});