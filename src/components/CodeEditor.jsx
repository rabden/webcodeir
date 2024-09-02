import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Save, Settings, Layout, ChevronDown } from 'lucide-react';

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [preview, setPreview] = useState('');

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

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <header className="bg-black p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-sm"></div>
          <h1 className="text-lg font-semibold">Untitled</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-[#3a3a3a] rounded">
            <Save className="w-4 h-4" />
            <span className="ml-1">Save</span>
          </button>
          <button className="p-1 bg-[#3a3a3a] rounded">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-1 bg-[#3a3a3a] rounded">
            <Layout className="w-4 h-4" />
          </button>
          <button className="p-1 bg-[#3a3a3a] rounded">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </header>
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel minSize={0} defaultSize={50}>
          <iframe
            title="preview"
            srcDoc={preview}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts"
          />
        </Panel>
        <PanelResizeHandle className="w-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
        <Panel minSize={0} defaultSize={50}>
          <PanelGroup direction="vertical">
            <Panel minSize={10} defaultSize={33}>
              <div className="h-full flex flex-col">
                <div className="bg-[#2d2d2d] p-2 flex items-center">
                  <div className="w-4 h-4 bg-[#ff5f56] rounded-full mr-2"></div>
                  <span className="text-sm font-semibold">HTML</span>
                </div>
                <CodeMirror
                  value={htmlCode}
                  height="100%"
                  theme={dracula}
                  extensions={[html()]}
                  onChange={(value) => setHtmlCode(value)}
                  className="flex-grow"
                />
              </div>
            </Panel>
            <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
            <Panel minSize={10} defaultSize={33}>
              <div className="h-full flex flex-col">
                <div className="bg-[#2d2d2d] p-2 flex items-center">
                  <div className="w-4 h-4 bg-[#27c93f] rounded-full mr-2"></div>
                  <span className="text-sm font-semibold">CSS</span>
                </div>
                <CodeMirror
                  value={cssCode}
                  height="100%"
                  theme={dracula}
                  extensions={[css()]}
                  onChange={(value) => setCssCode(value)}
                  className="flex-grow"
                />
              </div>
            </Panel>
            <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
            <Panel minSize={10} defaultSize={33}>
              <div className="h-full flex flex-col">
                <div className="bg-[#2d2d2d] p-2 flex items-center">
                  <div className="w-4 h-4 bg-[#ffbd2e] rounded-full mr-2"></div>
                  <span className="text-sm font-semibold">JS</span>
                </div>
                <CodeMirror
                  value={jsCode}
                  height="100%"
                  theme={dracula}
                  extensions={[javascript()]}
                  onChange={(value) => setJsCode(value)}
                  className="flex-grow"
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
      <footer className="bg-[#2d2d2d] p-2 flex justify-between items-center text-sm">
        <div className="flex space-x-4">
          <span>Console</span>
          <span>Assets</span>
          <span>Shortcuts</span>
        </div>
        <div>
          {/* Add any additional footer content here */}
        </div>
      </footer>
    </div>
  );
};

export default CodeEditor;