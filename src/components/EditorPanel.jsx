import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { githubDark } from '@uiw/codemirror-theme-github';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Palette, Code, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const themes = { dracula, vscodeDark, solarizedDark, githubDark, monokai };
  const editorRef = useRef(null);
  const [editors, setEditors] = useState({});
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());

  useEffect(() => {
    if (!editorRef.current) return;

    const commonOptions = {
      fontSize: settings.fontSize,
      minimap: { enabled: settings.minimap },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      tabSize: settings.tabSize,
      insertSpaces: !settings.indentWithTabs,
      cursorStyle: settings.cursorStyle,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      theme: settings.editorTheme === 'vscodeDark' ? 'vs-dark' : 'vs',
    };

    const htmlEditor = monaco.editor.create(editorRef.current.querySelector('#html-editor'), {
      ...commonOptions,
      language: 'html',
      value: htmlCode,
    });

    const cssEditor = monaco.editor.create(editorRef.current.querySelector('#css-editor'), {
      ...commonOptions,
      language: 'css',
      value: cssCode,
    });

    const jsEditor = monaco.editor.create(editorRef.current.querySelector('#js-editor'), {
      ...commonOptions,
      language: 'javascript',
      value: jsCode,
    });

    setEditors({ html: htmlEditor, css: cssEditor, js: jsEditor });

    htmlEditor.onDidChangeModelContent(() => setHtmlCode(htmlEditor.getValue()));
    cssEditor.onDidChangeModelContent(() => setCssCode(cssEditor.getValue()));
    jsEditor.onDidChangeModelContent(() => setJsCode(jsEditor.getValue()));

    return () => {
      htmlEditor.dispose();
      cssEditor.dispose();
      jsEditor.dispose();
    };
  }, []);

  useEffect(() => {
    setShowHtmlStructureIcon(isMobile && activeTab === 'html' && !htmlCode.trim());
  }, [isMobile, activeTab, htmlCode]);

  useEffect(() => {
    if (!editors.html) return;
    Object.values(editors).forEach(editor => {
      editor.updateOptions({
        fontSize: settings.fontSize,
        minimap: { enabled: settings.minimap },
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
        tabSize: settings.tabSize,
        insertSpaces: !settings.indentWithTabs,
        cursorStyle: settings.cursorStyle,
        theme: settings.editorTheme === 'vscodeDark' ? 'vs-dark' : 'vs',
      });
    });
  }, [settings, editors]);

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
      <div className="flex-grow overflow-hidden relative" ref={editorRef}>
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
        <div id={`${lang}-editor`} className="h-full"></div>
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
        {renderEditor('javascript')}
      </Panel>
    </PanelGroup>
  );

  return isMobile ? renderMobileEditor() : renderPanelMode();
};

export default EditorPanel;