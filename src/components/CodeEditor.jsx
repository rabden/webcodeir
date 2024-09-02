import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayIcon } from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

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
      <div className="flex-grow flex flex-col">
        <div className="flex-1 flex">
          <div className="flex-1 border-r border-gray-700">
            <Tabs defaultValue="html" className="h-full">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JS</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="h-[calc(100%-40px)]">
                <CodeMirror
                  value={htmlCode}
                  height="100%"
                  theme={dracula}
                  extensions={[html()]}
                  onChange={(value) => setHtmlCode(value)}
                />
              </TabsContent>
              <TabsContent value="css" className="h-[calc(100%-40px)]">
                <CodeMirror
                  value={cssCode}
                  height="100%"
                  theme={dracula}
                  extensions={[css()]}
                  onChange={(value) => setCssCode(value)}
                />
              </TabsContent>
              <TabsContent value="js" className="h-[calc(100%-40px)]">
                <CodeMirror
                  value={jsCode}
                  height="100%"
                  theme={dracula}
                  extensions={[javascript()]}
                  onChange={(value) => setJsCode(value)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex-1 bg-white">
          <h2 className="bg-gray-800 text-white p-2">Output</h2>
          <iframe
            title="preview"
            srcDoc={preview}
            className="w-full h-[calc(100%-40px)] border-none"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;