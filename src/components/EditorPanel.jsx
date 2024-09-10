import React, { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const editorRef = useRef(null);
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());

  useEffect(() => {
    setShowHtmlStructureIcon(isMobile && activeTab === 'html' && !htmlCode.trim());
  }, [isMobile, activeTab, htmlCode]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
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
      <div className="h-full flex flex-col">
        {!isMobile && (
          <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${lang === 'html' ? 'bg-[#ff5f56]' : lang === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
              <span className="text-sm font-semibold text-white">{lang.toUpperCase()}</span>
            </div>
          </div>
        )}
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
              minimap: { enabled: false },
              fontSize: settings.fontSize,
              lineNumbers: settings.lineNumbers ? 'on' : 'off',
              tabSize: settings.tabSize,
              insertSpaces: !settings.indentWithTabs,
              wordWrap: 'on',
              wrappingIndent: 'indent',
              automaticLayout: true,
              theme: settings.editorTheme === 'vscodeDark' ? 'vs-dark' : 'vs-light',
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    );
  };

  const renderMobileEditor = () => {
    switch (activeTab) {
      case 'html':
        return renderEditor('html', htmlCode, setHtmlCode);
      case 'css':
        return renderEditor('css', cssCode, setCssCode);
      case 'js':
        return renderEditor('javascript', jsCode, setJsCode);
      default:
        return null;
    }
  };

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

  return isMobile ? renderMobileEditor() : renderPanelMode();
};

export default EditorPanel;