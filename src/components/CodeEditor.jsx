import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { githubDark } from '@uiw/codemirror-theme-github';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronDown, ChevronUp, ChevronRight, Settings as SettingsIcon, Save } from 'lucide-react';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { indentOnInput } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [output, setOutput] = useState('');
  const [collapsedPanels, setCollapsedPanels] = useState({ html: false, css: false, js: false });
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedCodes, setShowSavedCodes] = useState(false);
  const [settings, setSettings] = useState({
    editorTheme: 'dracula',
    fontSize: 14,
    autoSave: true,
    tabSize: 2,
    lineNumbers: true,
    wordWrap: true,
    indentWithTabs: true,
    autoCloseBrackets: 'always',
    highlightActiveLine: true,
  });

  const themes = {
    dracula: dracula,
    vscodeDark: vscodeDark,
    solarizedDark: solarizedDark,
    githubDark: githubDark,
    monokai: monokai,
  };

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('editorSettings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('editorSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.autoSave) {
      const timer = setTimeout(() => {
        updateOutput();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [htmlCode, cssCode, jsCode, settings.autoSave]);

  const createLanguageExtensions = (language) => {
    const languageSupport = language === 'html' ? html() : language === 'css' ? css() : javascript();
    return [
      languageSupport,
      autocompletion(),
      closeBrackets(),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle),
      EditorState.tabSize.of(settings.tabSize),
      EditorState.phrases.of({
        "Ctrl-Space": "Trigger autocompletion",
        "Ctrl-/": "Toggle comment",
        "Cmd-/": "Toggle comment",
        "Shift-Alt-A": "Toggle block comment",
      }),
    ];
  };

  const editorSetup = {
    lineNumbers: settings.lineNumbers,
    foldGutter: true,
    dropCursor: true,
    allowMultipleSelections: true,
    indentOnInput: true,
    bracketMatching: true,
    closeBrackets: settings.autoCloseBrackets === 'always',
    autocompletion: true,
    rectangularSelection: true,
    crosshairCursor: true,
    highlightActiveLine: settings.highlightActiveLine,
    highlightSelectionMatches: true,
    closeBracketsKeymap: true,
    defaultKeymap: true,
    searchKeymap: true,
    historyKeymap: true,
    foldKeymap: true,
    completionKeymap: true,
    lintKeymap: true,
  };

  const renderEditor = (language, code, setCode, panel) => (
    <Panel minSize={5} defaultSize={33} collapsible={true}>
      <div className="h-full flex flex-col">
        <div className="bg-[#2d2d2d] p-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${language === 'html' ? 'bg-[#ff5f56]' : language === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
            <span className="text-sm font-semibold">{language.toUpperCase()}</span>
          </div>
          <button onClick={() => togglePanel(panel)} className="p-1 hover:bg-[#3a3a3a] rounded">
            {collapsedPanels[panel] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <div className={`flex-grow overflow-auto transition-all duration-300 ${collapsedPanels[panel] ? 'h-0' : 'h-auto'}`}>
          <CodeMirror
            value={code}
            height="100%"
            theme={themes[settings.editorTheme]}
            extensions={createLanguageExtensions(language)}
            onChange={(value) => setCode(value)}
            style={{ fontSize: `${settings.fontSize}px` }}
            basicSetup={editorSetup}
            indentWithTab={settings.indentWithTabs}
          />
        </div>
      </div>
    </Panel>
  );

  const togglePanel = (panel) => {
    setCollapsedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const updateOutput = () => {
    const combinedOutput = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
    setOutput(combinedOutput);
  };

  const handleSave = () => {
    const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    const newCode = {
      id: Date.now(),
      name: `Code ${savedCodes.length + 1}`,
      html: htmlCode,
      css: cssCode,
      js: jsCode,
    };
    savedCodes.push(newCode);
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  };

  const handleLoad = (code) => {
    setHtmlCode(code.html);
    setCssCode(code.css);
    setJsCode(code.js);
    setShowSavedCodes(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Code Editor</h1>
        <div className="flex space-x-4">
          <button onClick={() => setShowSettings(true)} className="p-2 rounded hover:bg-gray-700 transition-colors">
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button onClick={handleSave} className="p-2 rounded hover:bg-gray-700 transition-colors">
            <Save className="w-5 h-5" />
          </button>
          <button onClick={() => setShowSavedCodes(true)} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors">
            Load Saved Code
          </button>
        </div>
      </div>
      <div className="flex-grow flex">
        <div className="w-1/2 h-full">
          <PanelGroup direction="vertical">
            {renderEditor('html', htmlCode, setHtmlCode, 'html')}
            <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
            {renderEditor('css', cssCode, setCssCode, 'css')}
            <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
            {renderEditor('js', jsCode, setJsCode, 'js')}
          </PanelGroup>
        </div>
        <div className="w-1/2 h-full border-l border-gray-700">
          <iframe
            title="output"
            srcDoc={output}
            className="w-full h-full"
            sandbox="allow-scripts"
          />
        </div>
      </div>
      {showSettings && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showSavedCodes && (
        <SavedCodes
          onClose={() => setShowSavedCodes(false)}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};

export default CodeEditor;