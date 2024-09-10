import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const editorRef = useRef(null);
  const [editors, setEditors] = useState({});
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());

  useEffect(() => {
    if (!editorRef.current) return;

    const htmlEditor = monaco.editor.create(editorRef.current, {
      value: htmlCode,
      language: 'html',
      theme: settings.editorTheme,
      fontSize: settings.fontSize,
      minimap: { enabled: settings.minimap },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      tabSize: settings.tabSize,
      insertSpaces: !settings.indentWithTabs,
      wordWrap: 'on',
      automaticLayout: true,
    });

    const cssEditor = monaco.editor.create(editorRef.current, {
      value: cssCode,
      language: 'css',
      theme: settings.editorTheme,
      fontSize: settings.fontSize,
      minimap: { enabled: settings.minimap },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      tabSize: settings.tabSize,
      insertSpaces: !settings.indentWithTabs,
      wordWrap: 'on',
      automaticLayout: true,
    });

    const jsEditor = monaco.editor.create(editorRef.current, {
      value: jsCode,
      language: 'javascript',
      theme: settings.editorTheme,
      fontSize: settings.fontSize,
      minimap: { enabled: settings.minimap },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      tabSize: settings.tabSize,
      insertSpaces: !settings.indentWithTabs,
      wordWrap: 'on',
      automaticLayout: true,
    });

    setEditors({ html: htmlEditor, css: cssEditor, js: jsEditor });

    return () => {
      htmlEditor.dispose();
      cssEditor.dispose();
      jsEditor.dispose();
    };
  }, []);

  useEffect(() => {
    if (!editors.html || !editors.css || !editors.js) return;

    editors.html.onDidChangeModelContent(() => {
      setHtmlCode(editors.html.getValue());
    });

    editors.css.onDidChangeModelContent(() => {
      setCssCode(editors.css.getValue());
    });

    editors.js.onDidChangeModelContent(() => {
      setJsCode(editors.js.getValue());
    });
  }, [editors, setHtmlCode, setCssCode, setJsCode]);

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

  const setupAutoCompletion = (editor, language) => {
    const provideCompletionItems = (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const suggestions = [];

      if (language === 'html') {
        const htmlTags = ['div', 'span', 'p', 'a', 'img', 'ul', 'li', 'h1', 'h2', 'h3'];
        htmlTags.forEach(tag => {
          if (tag.startsWith(textUntilPosition.split('<').pop())) {
            suggestions.push({
              label: tag,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: `${tag}></${tag}>`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            });
          }
        });
      } else if (language === 'css') {
        const cssProperties = ['color', 'background-color', 'font-size', 'margin', 'padding'];
        cssProperties.forEach(prop => {
          if (prop.startsWith(textUntilPosition.split(':').pop().trim())) {
            suggestions.push({
              label: prop,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: `${prop}: `,
            });
          }
        });
      } else if (language === 'javascript') {
        const jsFunctions = ['function', 'console.log', 'document.getElementById', 'addEventListener'];
        jsFunctions.forEach(func => {
          if (func.startsWith(textUntilPosition.split(' ').pop())) {
            suggestions.push({
              label: func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: func,
            });
          }
        });
      }

      return { suggestions };
    };

    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems,
    });
  };

  useEffect(() => {
    if (!editors.html || !editors.css || !editors.js) return;

    setupAutoCompletion(editors.html, 'html');
    setupAutoCompletion(editors.css, 'css');
    setupAutoCompletion(editors.js, 'javascript');
  }, [editors]);

  const renderEditor = (lang) => {
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
  };

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