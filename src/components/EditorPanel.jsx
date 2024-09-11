import React, { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import * as monaco from 'monaco-editor';
import EditorHeader from './EditorHeader';
import { editorOptions } from '../utils/editorConfig';

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
        ...editorOptions(settings),
        minimap: { 
          enabled: true,
          side: 'right',
          size: 'fit',
          showSlider: 'always',
          renderCharacters: false,
          maxColumn: 120,
          scale: 1
        },
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10
        },
        padding: {
          bottom: '70vh'
        }
      });
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    updateEditorOptions();
    monaco.editor.setTheme('vs-dark');
    applyEditorStyles();
  };

  const applyEditorStyles = () => {
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
      .monaco-editor .scrollbar {
        z-index: 11;
      }
      .monaco-editor .scrollbar.vertical {
        right: 0;
      }
    `;
    document.head.appendChild(styleElement);
  };

  const renderEditor = (lang, codeValue, setCodeValue) => (
    <div className="h-full flex flex-col editor-container">
      {!isMobile && <EditorHeader lang={lang} />}
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
          language={lang === 'html' ? 'html' : lang === 'css' ? 'css' : 'javascript'}
          value={codeValue}
          onChange={(value) => setCodeValue(value)}
          onMount={handleEditorDidMount}
          options={{
            ...editorOptions(settings),
            minimap: { 
              enabled: true,
              side: 'right',
              size: 'fit',
              showSlider: 'always',
              renderCharacters: false,
              maxColumn: 120,
              scale: 1
            },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            },
            padding: {
              bottom: '70vh'
            }
          }}
          loading={<div className="text-white text-center p-4">Loading editor...</div>}
        />
      </div>
    </div>
  );

  const renderMobileEditor = () => {
    switch (activeTab) {
      case 'html': return renderEditor('html', htmlCode, setHtmlCode);
      case 'css': return renderEditor('css', cssCode, setCssCode);
      case 'js': return renderEditor('javascript', jsCode, setJsCode);
      default: return null;
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