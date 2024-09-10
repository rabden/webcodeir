import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Import language contributions
import 'monaco-editor/esm/vs/language/html/monaco.contribution';
import 'monaco-editor/esm/vs/language/css/monaco.contribution';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const editorRefs = useRef({
    html: null,
    css: null,
    js: null
  });
  const [editors, setEditors] = useState({});
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());

  useEffect(() => {
    // Initialize Monaco editor
    monaco.editor.onDidCreateEditor((editor) => {
      updateEditorOptions(editor);
    });

    // Initialize editors
    initEditor('html');
    initEditor('css');
    initEditor('js');

    return () => {
      Object.values(editors).forEach(editor => editor?.dispose());
    };
  }, []);

  useEffect(() => {
    setShowHtmlStructureIcon(isMobile && activeTab === 'html' && !htmlCode.trim());
  }, [isMobile, activeTab, htmlCode]);

  useEffect(() => {
    Object.values(editors).forEach(editor => {
      if (editor) {
        updateEditorOptions(editor);
      }
    });
  }, [settings, editors]);

  const updateEditorOptions = (editor) => {
    editor.updateOptions({
      fontSize: settings.fontSize,
      minimap: { enabled: settings.minimap },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      tabSize: settings.tabSize,
      insertSpaces: !settings.indentWithTabs,
      cursorStyle: settings.cursorStyle,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      theme: settings.editorTheme === 'vscodeDark' ? 'vs-dark' : 'vs',
      highlightActiveIndentGuide: settings.highlightActiveLine,
      matchBrackets: settings.matchBrackets ? 'always' : 'never',
    });
  };

  const initEditor = (language) => {
    if (editorRefs.current[language] && !editors[language]) {
      try {
        const editor = monaco.editor.create(editorRefs.current[language], {
          value: language === 'html' ? htmlCode : language === 'css' ? cssCode : jsCode,
          language: language === 'js' ? 'javascript' : language,
          automaticLayout: true,
        });

        updateEditorOptions(editor);

        editor.onDidChangeModelContent(() => {
          const value = editor.getValue();
          if (language === 'html') setHtmlCode(value);
          else if (language === 'css') setCssCode(value);
          else if (language === 'js') setJsCode(value);
        });

        setEditors(prev => ({ ...prev, [language]: editor }));
      } catch (error) {
        console.error(`Error initializing ${language} editor:`, error);
      }
    }
  };

  const renderEditor = (lang) => (
    <div className="h-full flex flex-col">
      {!isMobile && (
        <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 z-10">
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
              setHtmlCode(`<!DOCTYPE html>
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
        <div
          id={`${lang}-editor`}
          className="h-full"
          ref={el => editorRefs.current[lang] = el}
        ></div>
      </div>
    </div>
  );

  const renderMobileEditor = () => {
    switch (activeTab) {
      case 'html':
        return renderEditor('html');
      case 'css':
        return renderEditor('css');
      case 'js':
        return renderEditor('javascript');
      default:
        return null;
    }
  };

  const renderPanelMode = () => (
    <PanelGroup direction={settings.layout === 'stacked' ? 'horizontal' : 'vertical'}>
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('html')}
      </Panel>
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200' : 'h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200'} />
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('css')}
      </Panel>
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200' : 'h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200'} />
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('js')}
      </Panel>
    </PanelGroup>
  );

  return isMobile ? renderMobileEditor() : renderPanelMode();
};

export default EditorPanel;