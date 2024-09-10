import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const editorRef = useRef(null);
  const [editors, setEditors] = useState({});
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());

  useEffect(() => {
    if (!editorRef.current) return;

    const commonOptions = {
      theme: settings.editorTheme,
      fontSize: settings.fontSize,
      minimap: { enabled: settings.minimap },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      tabSize: settings.tabSize,
      insertSpaces: !settings.indentWithTabs,
      wordWrap: 'on',
      automaticLayout: true,
    };

    const createEditor = (language, value, onChange) => {
      const editor = monaco.editor.create(editorRef.current, {
        value,
        language,
        ...commonOptions,
      });

      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });

      return editor;
    };

    const htmlEditor = createEditor('html', htmlCode, setHtmlCode);
    const cssEditor = createEditor('css', cssCode, setCssCode);
    const jsEditor = createEditor('javascript', jsCode, setJsCode);

    setEditors({ html: htmlEditor, css: cssEditor, js: jsEditor });

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
    if (!editors.html || !editors.css || !editors.js) return;

    Object.values(editors).forEach(editor => {
      editor.updateOptions({
        theme: settings.editorTheme,
        fontSize: settings.fontSize,
        minimap: { enabled: settings.minimap },
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
        tabSize: settings.tabSize,
        insertSpaces: !settings.indentWithTabs,
      });
    });
  }, [editors, settings]);

  const setupAutoCompletion = () => {
    const languages = ['html', 'css', 'javascript'];
    languages.forEach(language => {
      monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = [];

          if (language === 'html') {
            ['div', 'span', 'p', 'a', 'img', 'ul', 'li', 'h1', 'h2', 'h3'].forEach(tag => {
              suggestions.push({
                label: tag,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: `<${tag}></${tag}>`,
                range: range,
              });
            });
          } else if (language === 'css') {
            ['color', 'background-color', 'font-size', 'margin', 'padding'].forEach(prop => {
              suggestions.push({
                label: prop,
                kind: monaco.languages.CompletionItemKind.Property,
                insertText: `${prop}: `,
                range: range,
              });
            });
          } else if (language === 'javascript') {
            ['function', 'const', 'let', 'var', 'if', 'for', 'while'].forEach(keyword => {
              suggestions.push({
                label: keyword,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: keyword,
                range: range,
              });
            });
          }

          return { suggestions };
        },
      });
    });
  };

  useEffect(() => {
    if (Object.keys(editors).length > 0) {
      setupAutoCompletion();
    }
  }, [editors]);

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
              const htmlStructure = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;
              editors.html.setValue(htmlStructure);
              setShowHtmlStructureIcon(false);
            }}
          >
            <Code className="h-4 w-4" />
          </Button>
        )}
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