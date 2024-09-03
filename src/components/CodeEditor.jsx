import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
    }, 300);

    return () => clearTimeout(debounce);
  }, [htmlCode, cssCode, jsCode]);

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
            theme={dracula}
            extensions={[language === 'html' ? html() : language === 'css' ? css() : javascript()]}
            onChange={(value) => setCode(value)}
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
          <h1 className="text-lg font-semibold">Untitled</h1>
        </div>
        <div className="text-sm">
          Preview width: {previewWidth}px
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
    </div>
  );
};

export default CodeEditor;