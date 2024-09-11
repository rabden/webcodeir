import React, { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import * as monaco from 'monaco-editor';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const editorRef = useRef(null);
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());

  useEffect(() => {
    setShowHtmlStructureIcon(isMobile && activeTab === 'html' && !htmlCode.trim());
  }, [isMobile, activeTab, htmlCode]);

  useEffect(() => {
    if (editorRef.current) {
      updateEditorOptions();
    }
  }, [settings]);

  const updateEditorOptions = () => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
        tabSize: settings.tabSize,
        insertSpaces: !settings.indentWithTabs,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingIndent: 'indent',
        lineNumbersMinChars: 3,
        overviewRulerLanes: 0,
      });
    }
  };

  const handleEditorDidMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    updateEditorOptions();
    monacoInstance.editor.setTheme('vs-dark');

    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .monaco-editor .margin-view-overlays .line-numbers {
        min-width: 2.5em !important;
      }
      .monaco-editor .monaco-editor-background,
      .monaco-editor .inputarea.ime-input {
        z-index: 50 !important;
      }
      .monaco-editor .suggest-widget {
        z-index: 1000 !important;
      }
      .editor-container {
        position: relative;
        z-index: 1;
        overflow: visible !important;
      }
      .editor-header {
        position: relative;
        z-index: 2;
      }
      .monaco-editor .overflow-guard {
        overflow: visible !important;
      }
    `;
    document.head.appendChild(styleElement);
  };

  const getLanguage = (lang) => {
    switch (lang) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'plaintext';
    }
  };

  const renderEditor = (lang, codeValue, setCodeValue) => {
    return (
      <div className="h-full flex flex-col editor-container">
        <div className="flex-grow overflow-hidden relative" ref={editorRef}>
          {showHtmlStructureIcon && lang === 'html' && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => {
                setCodeValue(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`);
                setShowHtmlStructureIcon(false);
              }}
            >
              <Code className="h-4 w-4" />
            </Button>
          )}
          <Editor
            height="100%"
            language={getLanguage(lang)}
            value={codeValue}
            onChange={(value) => setCodeValue(value)}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              fontSize: settings.fontSize,
              lineNumbers: settings.lineNumbers ? 'on' : 'off',
              tabSize: settings.tabSize,
              insertSpaces: !settings.indentWithTabs,
              wordWrap: 'on',
              wrappingIndent: 'indent',
              theme: 'vs-dark',
              lineNumbersMinChars: 3,
              overviewRulerLanes: 0,
            }}
            loading={<div className="text-white text-center p-4">Loading editor...</div>}
          />
        </div>
      </div>
    );
  };

  const renderTabMode = () => (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-700 w-full justify-start">
          <TabsTrigger value="html" className="text-sm">HTML</TabsTrigger>
          <TabsTrigger value="css" className="text-sm">CSS</TabsTrigger>
          <TabsTrigger value="js" className="text-sm">JS</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-grow overflow-hidden">
        {activeTab === 'html' && renderEditor('html', htmlCode, setHtmlCode)}
        {activeTab === 'css' && renderEditor('css', cssCode, setCssCode)}
        {activeTab === 'js' && renderEditor('javascript', jsCode, setJsCode)}
      </div>
    </div>
  );

  const renderPanelMode = () => (
    <PanelGroup direction={settings.layout === 'stacked' ? 'horizontal' : 'vertical'}>
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('html', htmlCode, setHtmlCode)}
      </Panel>
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200' : 'h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200'} />
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('css', cssCode, setCssCode)}
      </Panel>
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200' : 'h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200'} />
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('javascript', jsCode, setJsCode)}
      </Panel>
    </PanelGroup>
  );

  return (
    <div className="w-full h-full bg-gray-900">
      {isMobile || settings.tabMode ? renderTabMode() : renderPanelMode()}
    </div>
  );
};

export default EditorPanel;