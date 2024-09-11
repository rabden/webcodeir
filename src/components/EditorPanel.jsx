import React, { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import EditorHeader from './EditorHeader';
import { editorOptions } from '../utils/editorConfig';

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const editorRef = useRef(null);
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [showMinimap, setShowMinimap] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      if (editorRef.current) {
        updateEditorOptions();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setShowHtmlStructureIcon(isMobile && activeTab === 'html' && !htmlCode.trim());
  }, [isMobile, activeTab, htmlCode]);

  useEffect(() => {
    if (editorRef.current) {
      updateEditorOptions();
    }
  }, [settings, isSmallScreen, showMinimap]);

  const updateEditorOptions = () => {
    if (editorRef.current && editorRef.current.getModel()) {
      editorRef.current.updateOptions({
        ...editorOptions(settings),
        wordWrap: isSmallScreen || isMobile ? 'off' : 'on',
        minimap: { 
          enabled: !isMobile || (isMobile && showMinimap),
          side: 'right',
          size: 'fit',
          showSlider: 'always',
          renderCharacters: false,
          maxColumn: 120,
          scale: 1
        },
        scrollbar: {
          vertical: 'hidden',
          horizontal: 'hidden',
          useShadows: false,
          verticalScrollbarSize: 0,
          horizontalScrollbarSize: 0
        },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        padding: {
          top: 10,
          bottom: '50vh'
        }
      });
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    updateEditorOptions();
    monaco.editor.setTheme('vs-dark');
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
            wordWrap: isSmallScreen || isMobile ? 'off' : 'on',
            minimap: { 
              enabled: !isMobile || (isMobile && showMinimap),
              side: 'right',
              size: 'fit',
              showSlider: 'always',
              renderCharacters: false,
              maxColumn: 120,
              scale: 1
            },
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
              useShadows: false,
              verticalScrollbarSize: 0,
              horizontalScrollbarSize: 0
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            padding: {
              top: 10,
              bottom: '50vh'
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
    <div className="w-full h-full bg-gray-900 relative">
      {isMobile ? renderMobileEditor() : renderPanelMode()}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700"
          onClick={() => setShowMinimap(!showMinimap)}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${showMinimap ? 'rotate-180' : ''}`} />
        </Button>
      )}
    </div>
  );
};

export default EditorPanel;