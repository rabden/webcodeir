import React from 'react';
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
import { autocompletion } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';
import { Palette, Code, Wrench } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, setShowCssToolsPanel, setShowHtmlToolsPanel, setShowJsToolsPanel, isMobile, activeTab, setActiveTab }) => {
  const themes = { dracula, vscodeDark, solarizedDark, githubDark, monokai };

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case 'html': return html();
      case 'css': return css();
      case 'javascript': return javascript();
      default: return null;
    }
  };

  const renderEditor = (lang, codeValue, setCodeValue, setShowToolsPanel) => {
    const languageExtension = getLanguageExtension(lang);
    const extensions = [
      languageExtension,
      EditorView.lineWrapping.of(false),
      EditorView.theme({
        "&": { height: "100%", overflow: "auto" },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content": { paddingBottom: "50vh" }
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
      <div className="h-full flex flex-col">
        {!isMobile && (
          <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${lang === 'html' ? 'bg-[#ff5f56]' : lang === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
              <span className="text-sm font-semibold text-white">{lang.toUpperCase()}</span>
            </div>
            <button
              onClick={() => setShowToolsPanel(true)}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              title={`Open ${lang.toUpperCase()} Tools`}
            >
              {lang === 'html' ? <Code className="w-4 h-4 text-white" /> : lang === 'css' ? <Palette className="w-4 h-4 text-white" /> : <Wrench className="w-4 h-4 text-white" />}
            </button>
          </div>
        )}
        <div className="flex-grow overflow-hidden">
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

  const renderTabMode = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
      <TabsList className="bg-gray-800 p-1">
        <TabsTrigger value="html" className="text-white">HTML</TabsTrigger>
        <TabsTrigger value="css" className="text-white">CSS</TabsTrigger>
        <TabsTrigger value="js" className="text-white">JS</TabsTrigger>
      </TabsList>
      <div className="flex-grow overflow-hidden">
        <TabsContent value="html" className="h-full">
          {renderEditor('html', htmlCode, setHtmlCode, setShowHtmlToolsPanel)}
        </TabsContent>
        <TabsContent value="css" className="h-full">
          {renderEditor('css', cssCode, setCssCode, setShowCssToolsPanel)}
        </TabsContent>
        <TabsContent value="js" className="h-full">
          {renderEditor('javascript', jsCode, setJsCode, setShowJsToolsPanel)}
        </TabsContent>
      </div>
    </Tabs>
  );

  const renderPanelMode = () => (
    <PanelGroup direction={settings.layout === 'stacked' ? 'horizontal' : 'vertical'}>
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('html', htmlCode, setHtmlCode, setShowHtmlToolsPanel)}
      </Panel>
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200' : 'h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200'} />
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('css', cssCode, setCssCode, setShowCssToolsPanel)}
      </Panel>
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200' : 'h-1 bg-gray-700 hover:bg-gray-600 transition-colors duration-200'} />
      <Panel minSize={5} defaultSize={33}>
        {renderEditor('javascript', jsCode, setJsCode, setShowJsToolsPanel)}
      </Panel>
    </PanelGroup>
  );

  return isMobile ? renderTabMode() : renderPanelMode();
};

export default EditorPanel;