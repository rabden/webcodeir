import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { githubDark } from '@uiw/codemirror-theme-github';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronDown, ChevronUp, ChevronRight, Settings as SettingsIcon, Save, FileCode2, Maximize, Minimize } from 'lucide-react';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import AssetsManager from './AssetsManager';

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
  const [showAssetsManager, setShowAssetsManager] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    editorTheme: 'vscodeDark',
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
  const [assets, setAssets] = useState([
    { name: 'Bootstrap CSS', type: 'link', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', enabled: false },
    { name: 'Bootstrap JS', type: 'script', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', enabled: false },
    { name: 'Font Awesome', type: 'link', url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', enabled: false },
    { name: 'jQuery', type: 'script', url: 'https://code.jquery.com/jquery-3.6.0.min.js', enabled: false },
    { name: 'Animate.css', type: 'link', url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', enabled: false },
    { name: 'Tailwind CSS', type: 'link', url: 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css', enabled: false },
    { name: 'Vue.js', type: 'script', url: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js', enabled: false },
    { name: 'React', type: 'script', url: 'https://unpkg.com/react@17/umd/react.development.js', enabled: false },
    { name: 'React DOM', type: 'script', url: 'https://unpkg.com/react-dom@17/umd/react-dom.development.js', enabled: false },
    { name: 'Alpine.js', type: 'script', url: 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js', enabled: false },
    { name: 'Lodash', type: 'script', url: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', enabled: false },
    { name: 'Axios', type: 'script', url: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js', enabled: false },
    { name: 'Moment.js', type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js', enabled: false },
    { name: 'Chart.js', type: 'script', url: 'https://cdn.jsdelivr.net/npm/chart.js', enabled: false },
    { name: 'Normalize.css', type: 'link', url: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css', enabled: false },
    { name: 'Bulma CSS', type: 'link', url: 'https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css', enabled: false },
    { name: 'Three.js', type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', enabled: false },
    { name: 'D3.js', type: 'script', url: 'https://d3js.org/d3.v7.min.js', enabled: false },
    { name: 'Anime.js', type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js', enabled: false },
    { name: 'Materialize CSS', type: 'link', url: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css', enabled: false },
  ]);

  const themes = {
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
  }, [htmlCode, cssCode, jsCode, settings.autoSave, assets]);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const updatePreview = () => {
    const enabledAssets = assets.filter(asset => asset.enabled);
    const assetTags = enabledAssets.map(asset => 
      asset.type === 'link' 
        ? `<link rel="stylesheet" href="${asset.url}">`
        : `<script src="${asset.url}"></script>`
    ).join('\n');

    const combinedCode = `
      <html>
        <head>
          ${assetTags}
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
    localStorage.setItem('codeEditorState', JSON.stringify({ htmlCode, cssCode, jsCode, settings, currentCodeName, assets }));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('codeEditorState');
    if (savedState) {
      const { htmlCode, cssCode, jsCode, settings: savedSettings, currentCodeName, assets: savedAssets } = JSON.parse(savedState);
      setHtmlCode(htmlCode);
      setCssCode(cssCode);
      setJsCode(jsCode);
      setSettings(savedSettings);
      setCurrentCodeName(currentCodeName || 'Untitled');
      setAssets(savedAssets || assets);
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
      assets: assets,
      date: new Date().toISOString(),
    };
    savedCodes.push(newSavedCode);
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
    alert('Code saved successfully!');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const renderEditor = (language, code, setCode, panel) => (
    <Panel minSize={5} defaultSize={33} collapsible={true}>
      <div className="h-full flex flex-col">
        <div className="bg-[#1e1e1e] p-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${language === 'html' ? 'bg-[#ff5f56]' : language === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
            <span className="text-sm font-semibold">{language.toUpperCase()}</span>
          </div>
          <button onClick={() => togglePanel(panel)} className="p-1 hover:bg-[#2d2d2d] rounded transition-colors duration-200">
            {collapsedPanels[panel] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <div className={`flex-grow overflow-auto transition-all duration-300 ${collapsedPanels[panel] ? 'h-0' : 'h-auto'}`}>
          <CodeMirror
            value={code}
            height="100%"
            theme={themes[settings.editorTheme]}
            extensions={[language === 'html' ? html() : language === 'css' ? css() : javascript()]}
            onChange={(value) => setCode(value)}
            style={{ fontSize: `${settings.fontSize}px` }}
            basicSetup={{
              lineNumbers: settings.lineNumbers,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false,
              tabSize: settings.tabSize,
              highlightActiveLine: settings.highlightActiveLine,
            }}
            indentWithTab={settings.indentWithTabs}
            autoCloseBrackets={settings.autoCloseBrackets === 'always'}
          />
        </div>
      </div>
    </Panel>
  );

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <header className="bg-[#252526] p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[#0078d4] rounded-sm"></div>
          <input
            type="text"
            value={currentCodeName}
            onChange={(e) => setCurrentCodeName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none text-white"
          />
          <div className="text-sm ml-4 text-gray-400">
            Preview width: {previewWidth}px
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={saveCurrentCode}
            className="p-2 rounded-full hover:bg-[#3c3c3c] transition-colors duration-200"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSavedCodes(!showSavedCodes)}
            className="p-2 rounded-full hover:bg-[#3c3c3c] transition-colors duration-200"
          >
            Saved Codes
          </button>
          <button
            onClick={() => setShowAssetsManager(!showAssetsManager)}
            className="p-2 rounded-full hover:bg-[#3c3c3c] transition-colors duration-200"
          >
            <FileCode2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-[#3c3c3c] transition-colors duration-200"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-[#3c3c3c] transition-colors duration-200"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
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
          <PanelResizeHandle className="w-2 bg-[#2d2d2d] hover:bg-[#3c3c3c] transition-colors duration-200 relative group">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-[#4a4a4a] group-hover:bg-[#6a6a6a] transition-colors duration-200"></div>
          </PanelResizeHandle>
          <Panel minSize={0} defaultSize={50}>
            <PanelGroup direction="vertical">
              {renderEditor('html', htmlCode, setHtmlCode, 'html')}
              <PanelResizeHandle className="h-1 bg-[#2d2d2d] hover:bg-[#3c3c3c] transition-colors duration-200" />
              {renderEditor('css', cssCode, setCssCode, 'css')}
              <PanelResizeHandle className="h-1 bg-[#2d2d2d] hover:bg-[#3c3c3c] transition-colors duration-200" />
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
            setAssets(code.assets || assets);
            setShowSavedCodes(false);
          }}
        />
      )}
      {showAssetsManager && (
        <AssetsManager
          assets={assets}
          setAssets={setAssets}
          onClose={() => setShowAssetsManager(false)}
        />
      )}
    </div>
  );
};

export default CodeEditor;