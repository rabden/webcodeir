import React, { useState, useEffect, useRef } from 'react';
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
import { autocompletion } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { Tooltip } from '@/components/ui/tooltip';

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [preview, setPreview] = useState('');
  const [previewWidth, setPreviewWidth] = useState(0);
  const [collapsedPanels, setCollapsedPanels] = useState({
    html: false,
    css: false,
    js: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedCodes, setShowSavedCodes] = useState(false);
  const [settings, setSettings] = useState({
    editorTheme: 'dracula',
    fontSize: 14,
    autoSave: true,
    tabSize: 2,
    lineNumbers: true,
    wordWrap: false,
    indentWithTabs: true,
    autoCloseBrackets: 'always',
    highlightActiveLine: true,
  });
  const [currentCodeName, setCurrentCodeName] = useState('Untitled');
  const [dropdownOpen, setDropdownOpen] = useState({
    html: false,
    css: false,
    js: false,
  });

  const editorRefs = {
    html: useRef(null),
    css: useRef(null),
    js: useRef(null),
  };

  const themes = {
    dracula: dracula,
    vscodeDark: vscodeDark,
    solarizedDark: solarizedDark,
    githubDark: githubDark,
    monokai: monokai,
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
      if (settings.autoSave) {
        saveToLocalStorage();
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [htmlCode, cssCode, jsCode, settings.autoSave]);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const updatePreview = () => {
    const combinedCode = `
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
    setPreview(combinedCode);
  };

  const togglePanel = (panel) => {
    setCollapsedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('codeEditorState', JSON.stringify({ htmlCode, cssCode, jsCode, settings, currentCodeName }));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('codeEditorState');
    if (savedState) {
      const { htmlCode, cssCode, jsCode, settings: savedSettings, currentCodeName } = JSON.parse(savedState);
      setHtmlCode(htmlCode);
      setCssCode(cssCode);
      setJsCode(jsCode);
      setSettings(savedSettings);
      setCurrentCodeName(currentCodeName || 'Untitled');
    }
  };

  const saveCurrentCode = () => {
    const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
    const newSavedCode = {
      id: Date.now(),
      name: currentCodeName,
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      date: new Date().toISOString(),
    };
    savedCodes.push(newSavedCode);
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
    alert('Code saved successfully!');
  };

  const toggleDropdown = (panel) => {
    setDropdownOpen(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const handleDropdownAction = (action, panel) => {
    const view = editorRefs[panel].current?.view;
    if (!view) return;

    switch (action) {
      case 'format':
        formatCode(panel);
        break;
      case 'analyze':
        analyzeCode(panel);
        break;
      case 'maximize':
        maximizeEditor(panel);
        break;
      case 'minimize':
        togglePanel(panel);
        break;
      case 'foldAll':
        foldAllCode(view);
        break;
      case 'unfoldAll':
        unfoldAllCode(view);
        break;
      default:
        break;
    }
    setDropdownOpen(prev => ({ ...prev, [panel]: false }));
  };

  const formatCode = (panel) => {
    const view = editorRefs[panel].current?.view;
    if (!view) return;

    const formatted = prettier.format(view.state.doc.toString(), {
      parser: panel === 'js' ? 'babel' : panel,
      plugins: [parserHTML, parserCSS, parserBabel],
    });

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: formatted },
    });
  };

  const analyzeCode = (panel) => {
    const code = panel === 'html' ? htmlCode : panel === 'css' ? cssCode : jsCode;
    console.log(`Analyzing ${panel.toUpperCase()} code:`);
    console.log('Character count:', code.length);
    console.log('Line count:', code.split('\n').length);
    // Add more analysis as needed
    alert(`${panel.toUpperCase()} Analysis:\nCharacter count: ${code.length}\nLine count: ${code.split('\n').length}`);
  };

  const maximizeEditor = (panel) => {
    const sizes = [0, 0, 0];
    sizes[['html', 'css', 'js'].indexOf(panel)] = 100;
    editorRefs[panel].current?.view.dispatch({
      effects: EditorView.scrollIntoView(0),
    });
    // Assuming you have a way to control panel sizes, update it here
    // For example: setPanelSizes(sizes);
  };

  const foldAllCode = (view) => {
    // This is a placeholder. Actual implementation depends on the folding extension you're using
    console.log('Folding all code');
  };

  const unfoldAllCode = (view) => {
    // This is a placeholder. Actual implementation depends on the folding extension you're using
    console.log('Unfolding all code');
  };

  const renderEditor = (language, code, setCode, panel) => (
    <Panel minSize={5} defaultSize={33} collapsible={true}>
      <div className="h-full flex flex-col">
        <div className="bg-[#2d2d2d] p-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${language === 'html' ? 'bg-[#ff5f56]' : language === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
            <span className="text-sm font-semibold">{language.toUpperCase()}</span>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Tooltip content="More options">
                <button
                  onClick={() => toggleDropdown(panel)}
                  className="p-1 hover:bg-[#3a3a3a] rounded"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </Tooltip>
              {dropdownOpen[panel] && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2d2d2d] rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => handleDropdownAction('format', panel)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                      >
                        Format {language.toUpperCase()}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropdownAction('analyze', panel)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                      >
                        Analyze {language.toUpperCase()}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropdownAction('maximize', panel)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                      >
                        Maximize {language.toUpperCase()} Editor
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropdownAction('minimize', panel)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                      >
                        Minimize {language.toUpperCase()} Editor
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropdownAction('foldAll', panel)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                      >
                        Fold All
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropdownAction('unfoldAll', panel)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                      >
                        Unfold All
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <Tooltip content={collapsedPanels[panel] ? "Expand" : "Collapse"}>
              <button onClick={() => togglePanel(panel)} className="p-1 hover:bg-[#3a3a3a] rounded ml-2">
                {collapsedPanels[panel] ? <ChevronRight className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </Tooltip>
          </div>
        </div>
        <div className={`flex-grow overflow-auto transition-all duration-300 ${collapsedPanels[panel] ? 'h-0' : 'h-auto'}`}>
          <CodeMirror
            value={code}
            height="100%"
            theme={themes[settings.editorTheme]}
            extensions={[
              language === 'html' ? html() : language === 'css' ? css() : javascript(),
              autocompletion(),
              indentUnit.of(" ".repeat(settings.tabSize)),
              EditorView.lineWrapping.of(settings.wordWrap),
              EditorView.theme({
                "&": { fontSize: settings.fontSize + "px" },
                ".cm-activeLineGutter, .cm-activeLine": {
                  backgroundColor: settings.highlightActiveLine ? "rgba(255,255,255,0.1)" : "transparent"
                }
              })
            ]}
            onChange={(value) => setCode(value)}
            basicSetup={{
              lineNumbers: settings.lineNumbers,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: settings.autoCloseBrackets === 'always',
              autocompletion: true,
              highlightActiveLine: settings.highlightActiveLine,
              highlightSelectionMatches: true,
              syntaxHighlighting: true,
            }}
            indentWithTab={settings.indentWithTabs}
            ref={editorRefs[panel]}
          />
        </div>
      </div>
    </Panel>
  );

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <header className="bg-black p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-sm"></div>
          <input
            type="text"
            value={currentCodeName}
            onChange={(e) => setCurrentCodeName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none text-white"
          />
          <div className="text-sm ml-4">
            Preview width: {previewWidth}px
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip content="Save current code">
            <button
              onClick={saveCurrentCode}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <Save className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="View saved codes">
            <button
              onClick={() => setShowSavedCodes(!showSavedCodes)}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              Saved Codes
            </button>
          </Tooltip>
          <Tooltip content="Open settings">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </header>
      <div className="flex-grow overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full" onLayout={(sizes) => setPreviewWidth(Math.round(sizes[0] * window.innerWidth / 100))}>
          <Panel minSize={0} defaultSize={50}>
            <iframe
              title="preview"
              srcDoc={preview}
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts"
            />
          </Panel>
          <PanelResizeHandle className="w-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
          </PanelResizeHandle>
          <Panel minSize={0} defaultSize={50}>
            <PanelGroup direction="vertical">
              {renderEditor('html', htmlCode, setHtmlCode, 'html')}
              <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
              {renderEditor('css', cssCode, setCssCode, 'css')}
              <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
              {renderEditor('js', jsCode, setJsCode, 'js')}
            </PanelGroup>
          </Panel>
        </PanelGroup>
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
          onLoad={(code) => {
            setHtmlCode(code.html);
            setCssCode(code.css);
            setJsCode(code.js);
            setCurrentCodeName(code.name);
            setShowSavedCodes(false);
          }}
        />
      )}
    </div>
  );
};

export default CodeEditor;