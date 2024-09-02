import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('<h1>Hello, CodePen!</h1>');
  const [cssCode, setCssCode] = useState('body {\n  font-family: Arial, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}');
  const [jsCode, setJsCode] = useState('console.log("Hello from JavaScript!");');
  const [preview, setPreview] = useState('');

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
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CodePen Clone</h1>
        <Button onClick={updatePreview} className="bg-green-500 hover:bg-green-600">
          <PlayIcon className="mr-2 h-4 w-4" /> Run
        </Button>
      </header>
      <PanelGroup direction="vertical" className="flex-grow">
        <Panel defaultSize={60}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={33}>
              <div className="h-full flex flex-col">
                <div className="bg-gray-800 p-2">HTML</div>
                <CodeMirror
                  value={htmlCode}
                  height="100%"
                  theme={dracula}
                  extensions={[html()]}
                  onChange={(value) => setHtmlCode(value)}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 cursor-col-resize" />
            <Panel defaultSize={33}>
              <div className="h-full flex flex-col">
                <div className="bg-gray-800 p-2">CSS</div>
                <CodeMirror
                  value={cssCode}
                  height="100%"
                  theme={dracula}
                  extensions={[css()]}
                  onChange={(value) => setCssCode(value)}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 cursor-col-resize" />
            <Panel defaultSize={33}>
              <div className="h-full flex flex-col">
                <div className="bg-gray-800 p-2">JS</div>
                <CodeMirror
                  value={jsCode}
                  height="100%"
                  theme={dracula}
                  extensions={[javascript()]}
                  onChange={(value) => setJsCode(value)}
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-600 cursor-row-resize" />
        <Panel defaultSize={40}>
          <div className="h-full bg-white">
            <h2 className="bg-gray-800 text-white p-2">Output</h2>
            <iframe
              title="preview"
              srcDoc={preview}
              className="w-full h-[calc(100%-32px)] border-none"
              sandbox="allow-scripts"
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeEditor;