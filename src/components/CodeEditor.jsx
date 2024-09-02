import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('<h1>Hello, CodePen!</h1>');
  const [cssCode, setCssCode] = useState('body {\n  font-family: "Inter", sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n  font-size: 2.5rem;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);\n}');
  const [jsCode, setJsCode] = useState('console.log("Hello from JavaScript!");');
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
    <div className="h-screen flex flex-col bg-gray-100 text-gray-800">
      <header className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Modern CodePen Clone</h1>
      </header>
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel minSize={10} defaultSize={50}>
          <PanelGroup direction="vertical">
            <Panel minSize={10} defaultSize={33}>
              <div className="h-full flex flex-col rounded-lg overflow-hidden shadow-md m-2">
                <div className="bg-gray-200 p-2 font-semibold">HTML</div>
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
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors duration-200 cursor-row-resize" />
            <Panel minSize={10} defaultSize={33}>
              <div className="h-full flex flex-col rounded-lg overflow-hidden shadow-md m-2">
                <div className="bg-gray-200 p-2 font-semibold">CSS</div>
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
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors duration-200 cursor-row-resize" />
            <Panel minSize={10} defaultSize={33}>
              <div className="h-full flex flex-col rounded-lg overflow-hidden shadow-md m-2">
                <div className="bg-gray-200 p-2 font-semibold">JS</div>
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
        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 transition-colors duration-200 cursor-col-resize" />
        <Panel minSize={0} defaultSize={50}>
          <div className="h-full bg-white rounded-lg overflow-hidden shadow-md m-2">
            <h2 className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-2 font-semibold">Output</h2>
            <iframe
              title="preview"
              srcDoc={preview}
              className="w-full h-[calc(100%-40px)] border-none"
              sandbox="allow-scripts"
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeEditor;