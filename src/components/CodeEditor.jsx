import React, { useState, useEffect } from 'react';
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveIcon, LayoutTemplateIcon } from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Your Page Title</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <script src="script.js"></script>\n</body>\n</html>');
  const [cssCode, setCssCode] = useState('* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: Arial, sans-serif;\n  line-height: 1.6;\n  padding: 20px;\n}');
  const [jsCode, setJsCode] = useState('console.log("Hello from JavaScript!");');
  const [preview, setPreview] = useState('');
  const [isVerticalLayout, setIsVerticalLayout] = useState(true);

  useEffect(() => {
    updatePreview();
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

  const handleSave = () => {
    // Implement save functionality here
    console.log('Saving code...');
  };

  const toggleLayout = () => {
    setIsVerticalLayout(!isVerticalLayout);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CODEIR</h1>
        <div>
          <Button onClick={handleSave} className="mr-2">
            <SaveIcon className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button onClick={toggleLayout}>
            <LayoutTemplateIcon className="mr-2 h-4 w-4" /> Toggle Layout
          </Button>
        </div>
      </header>
      <ResizablePanelGroup direction={isVerticalLayout ? "horizontal" : "vertical"} className="flex-grow">
        <ResizablePanel defaultSize={50}>
          <Tabs defaultValue="html" className="h-full">
            <TabsList className="bg-gray-700 text-white">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JS</TabsTrigger>
            </TabsList>
            <TabsContent value="html" className="h-full">
              <CodeMirror
                value={htmlCode}
                height="100%"
                theme={dracula}
                extensions={[html()]}
                onChange={(value) => setHtmlCode(value)}
              />
            </TabsContent>
            <TabsContent value="css" className="h-full">
              <CodeMirror
                value={cssCode}
                height="100%"
                theme={dracula}
                extensions={[css()]}
                onChange={(value) => setCssCode(value)}
              />
            </TabsContent>
            <TabsContent value="js" className="h-full">
              <CodeMirror
                value={jsCode}
                height="100%"
                theme={dracula}
                extensions={[javascript()]}
                onChange={(value) => setJsCode(value)}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizablePanel defaultSize={50}>
          <div className="h-full">
            <h2 className="bg-gray-700 text-white p-2">Preview</h2>
            <iframe
              title="preview"
              srcDoc={preview}
              className="w-full h-full border-none"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <footer className="bg-gray-800 text-white p-2">
        <Tabs defaultValue="console">
          <TabsList>
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
          <TabsContent value="console">
            <div className="h-32 bg-gray-900 p-2 overflow-auto">
              {/* Implement console output here */}
              <p>Console output will appear here.</p>
            </div>
          </TabsContent>
          <TabsContent value="assets">
            <div className="h-32 bg-gray-900 p-2 overflow-auto">
              {/* Implement asset management here */}
              <p>Asset management will be implemented here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </footer>
    </div>
  );
};

export default CodeEditor;