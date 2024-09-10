import React, { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import * as monaco from 'monaco-editor';

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const editorRef = useRef(null);
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    setShowHtmlStructureIcon(isMobile && activeTab === 'html' && !htmlCode.trim());
  }, [isMobile, activeTab, htmlCode]);

  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      const editor = editorRef.current;
      editor.updateOptions({
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
        cursorStyle: settings.cursorStyle,
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        contextmenu: false,
        folding: true,
        renderIndentGuides: true,
        renderLineHighlight: 'all',
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      });

      // Custom theme
      monaco.editor.defineTheme('customDarkTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'C586C0' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'operator', foreground: 'D4D4D4' },
        ],
        colors: {
          'editor.background': '#1E1E1E',
          'editor.foreground': '#D4D4D4',
          'editorCursor.foreground': '#FFFFFF',
          'editor.lineHighlightBackground': '#2A2D2E',
          'editorLineNumber.foreground': '#858585',
          'editor.selectionBackground': '#264F78',
          'editor.inactiveSelectionBackground': '#3A3D41',
        },
      });

      monaco.editor.setTheme('customDarkTheme');
    }
  }, [settings, isEditorReady]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);

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
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .editor-header {
        position: relative;
        z-index: 2;
        background-color: #2D2D2D;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 8px 12px;
      }
      .monaco-editor .overflow-guard {
        overflow: visible !important;
      }
      .monaco-editor .cursors-layer .cursor {
        transition: all 0.1s ease;
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
          <div className="editor-header flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${lang === 'html' ? 'bg-red-500' : lang === 'css' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm font-semibold text-gray-300">{lang.toUpperCase()}</span>
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
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              fontSize: settings.fontSize,
              lineNumbers: settings.lineNumbers ? 'on' : 'off',
              tabSize: settings.tabSize,
              insertSpaces: !settings.indentWithTabs,
              wordWrap: 'on',
              wrappingIndent: 'indent',
              theme: 'customDarkTheme',
              lineNumbersMinChars: 3,
              overviewRulerLanes: 0,
              cursorStyle: settings.cursorStyle,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              contextmenu: false,
              folding: true,
              renderIndentGuides: true,
              renderLineHighlight: 'all',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
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
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-600 hover:bg-gray-500 transition-colors duration-200' : 'h-1 bg-gray-600 hover:bg-gray-500 transition-colors duration-200'} />
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('css', cssCode, setCssCode)}
      </Panel>
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-600 hover:bg-gray-500 transition-colors duration-200' : 'h-1 bg-gray-600 hover:bg-gray-500 transition-colors duration-200'} />
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