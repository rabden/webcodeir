import React, { useRef, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { githubDark } from '@uiw/codemirror-theme-github';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';
import { Palette, Code, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, isMobile, activeTab, setActiveTab }) => {
  const themes = { dracula, vscodeDark, solarizedDark, githubDark, monokai };
  const editorRef = useRef(null);
  const [showHtmlStructureIcon, setShowHtmlStructureIcon] = useState(isMobile && activeTab === 'html' && !htmlCode.trim());

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case 'html': return html();
      case 'css': return css();
      case 'javascript': return javascript();
      default: return null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = editorRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        editorRef.current.style.overflowX = isAtBottom ? 'auto' : 'hidden';
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener('scroll', handleResize);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('scroll', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setShowHtmlStructureIcon(isMobile && activeTab === 'html' && !htmlCode.trim());
  }, [isMobile, activeTab, htmlCode]);

  const myCompletions = (context: CompletionContext): CompletionResult | null => {
    let word = context.matchBefore(/\w+/);
    if (word && word.from != null && word.to != null && (word.from !== word.to || context.explicit)) {
      return {
        from: word.from,
        options: [
          { label: "function", type: "keyword" },
          { label: "class", type: "keyword" },
          { label: "if", type: "keyword" },
          { label: "else", type: "keyword" },
          { label: "for", type: "keyword" },
          { label: "while", type: "keyword" },
          { label: "return", type: "keyword" },
          { label: "const", type: "keyword" },
          { label: "let", type: "keyword" },
          { label: "var", type: "keyword" },
          // Add more completions as needed
        ]
      };
    }
    return null;
  };

  const renderEditor = (lang, codeValue, setCodeValue) => {
    const languageExtension = getLanguageExtension(lang);
    const extensions = [
      languageExtension,
      EditorView.theme({
        "&": { height: "100%", overflow: "auto" },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content": { 
          whiteSpace: isMobile ? "pre !important" : "pre-wrap !important",
          wordBreak: isMobile ? "normal" : "break-word",
          paddingBottom: "50vh"
        },
        "&::-webkit-scrollbar": { width: "2px", height: "2px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "rgba(255, 255, 255, 0.1)", borderRadius: "1px" },
      }),
      autocompletion({ override: [myCompletions] })
    ];

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
          <CodeMirror
            value={codeValue}
            height="100%"
            theme={themes[settings.editorTheme]}
            extensions={extensions}
            onChange={(value) => setCodeValue(value)}
            style={{
              height: '100%',
              fontSize: `${settings.fontSize}px`,
            }}
            className="h-full overflow-auto"
            basicSetup={{
              lineNumbers: settings.lineNumbers,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false,
              tabSize: settings.tabSize,
              highlightActiveLine: settings.highlightActiveLine,
              bracketMatching: settings.matchBrackets,
            }}
            indentWithTab={settings.indentWithTabs}
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