import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { githubDark } from '@uiw/codemirror-theme-github';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { autocompletion } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';
import { Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, setShowToolsPanel, isTabMode }) => {
  const themes = { vscodeDark, solarizedDark, githubDark, monokai };

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case 'html':
        return html();
      case 'css':
        return css();
      case 'javascript':
        return javascript();
      default:
        return null;
    }
  };

  const renderEditor = (lang, codeValue, setCodeValue) => {
    const languageExtension = getLanguageExtension(lang);
    const extensions = [
      languageExtension,
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          height: "100%",
          overflow: "auto"
        },
        ".cm-scroller": {
          overflow: "auto"
        },
        ".cm-content": {
          paddingBottom: "50vh"
        }
      })
    ];

    if (settings.enableAutocompletion) {
      extensions.push(autocompletion({
        override: [
          (context) => {
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
                ]
              };
            }
            return null;
          }
        ]
      }));
    }

    return (
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
    );
  };

  if (isTabMode) {
    return (
      <Tabs defaultValue="html" className="w-full h-full flex flex-col">
        <TabsList className="bg-gray-800 text-white">
          <TabsTrigger value="html" className="data-[state=active]:bg-gray-700">HTML</TabsTrigger>
          <TabsTrigger value="css" className="data-[state=active]:bg-gray-700">CSS</TabsTrigger>
          <TabsTrigger value="js" className="data-[state=active]:bg-gray-700">JavaScript</TabsTrigger>
        </TabsList>
        <div className="flex-grow overflow-hidden">
          <TabsContent value="html" className="h-full">
            {renderEditor('html', htmlCode, setHtmlCode)}
          </TabsContent>
          <TabsContent value="css" className="h-full">
            {renderEditor('css', cssCode, setCssCode)}
          </TabsContent>
          <TabsContent value="js" className="h-full">
            {renderEditor('javascript', jsCode, setJsCode)}
          </TabsContent>
        </div>
      </Tabs>
    );
  }

  return (
    <PanelGroup direction="vertical">
      <Panel minSize={5} defaultSize={33}>
        <div className="h-full flex flex-col">
          <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2 bg-[#ff5f56]"></div>
              <span className="text-sm font-semibold text-white">HTML</span>
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            {renderEditor('html', htmlCode, setHtmlCode)}
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200" />
      <Panel minSize={5} defaultSize={33}>
        <div className="h-full flex flex-col">
          <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2 bg-[#27c93f]"></div>
              <span className="text-sm font-semibold text-white">CSS</span>
            </div>
            <button
              onClick={() => setShowToolsPanel(true)}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              title="Open CSS Tools"
            >
              <Palette className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            {renderEditor('css', cssCode, setCssCode)}
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200" />
      <Panel minSize={5} defaultSize={33}>
        <div className="h-full flex flex-col">
          <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2 bg-[#ffbd2e]"></div>
              <span className="text-sm font-semibold text-white">JavaScript</span>
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            {renderEditor('javascript', jsCode, setJsCode)}
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default EditorPanel;