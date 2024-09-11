import React, { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import * as monaco from 'monaco-editor';

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
    if (editorRef.current && editorRef.current.getModel()) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
        tabSize: settings.tabSize,
        insertSpaces: !settings.indentWithTabs,
        minimap: { 
          enabled: true,
          side: 'right',
          size: 'fit',
          showSlider: 'always',
          renderCharacters: false,
          maxColumn: 120,
          scale: 1
        },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingIndent: 'indent',
        lineNumbersMinChars: 3,
        overviewRulerLanes: 0,
      });
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    updateEditorOptions();

    monaco.editor.setTheme('vs-dark');

    // Add custom CSS to reduce line number column width and ensure editor popups are on top
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
      .monaco-editor .minimap {
        right: 0;
        top: 0;
        height: 100% !important;
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
        {!isMobile && (
          <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 editor-header">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${lang === 'html' ? 'bg-[#ff5f56]' : lang === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
              <span className="text-sm font-semibold text-white">{lang.toUpperCase()}</span>
            </div>
          </div>
        )}
        <div className="flex-grow overflow-hidden relative">
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
              minimap: { 
                enabled: true,
                side: 'right',
                size: 'fit',
                showSlider: 'always',
                renderCharacters: false,
                maxColumn: 120,
                scale: 1
              },
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

  return (
    <div className="w-full h-full bg-gray-900">
      {isMobile ? renderMobileEditor() : renderPanelMode()}
    </div>
  );
};

export default EditorPanel;