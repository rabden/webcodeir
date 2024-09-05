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
import { Palette } from 'lucide-react';

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings, setShowToolsPanel }) => {
  const themes = { dracula, vscodeDark, solarizedDark, githubDark, monokai };

  const getLanguageExtension = (language) => {
    switch (language) {
      case 'html':
        return html();
      case 'css':
        return css();
      case 'js':
        return javascript();
      default:
        return null;
    }
  };

  const renderEditor = (language, code, setCode) => {
    const languageExtension = getLanguageExtension(language);
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
            if (!word || (word.from === word.to && !context.explicit)) return null;
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
        ]
      }));
    }

    return (
      <Panel minSize={5} defaultSize={33}>
        <div className="h-full flex flex-col">
          <div className="bg-[#2d2d2d] p-2 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${language === 'html' ? 'bg-[#ff5f56]' : language === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
              <span className="text-sm font-semibold">{language.toUpperCase()}</span>
            </div>
            {language === 'css' && (
              <button
                onClick={() => setShowToolsPanel(true)}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                title="Open CSS Tools"
              >
                <Palette className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          <div className="flex-grow overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              theme={themes[settings.editorTheme]}
              extensions={extensions}
              onChange={(value) => setCode(value)}
              style={{
                height: '100%',
                fontSize: `${settings.fontSize}px`,
              }}
              className="h-full"
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
      </Panel>
    );
  };

  return (
    <PanelGroup direction={settings.layout === 'stacked' ? 'horizontal' : 'vertical'}>
      {renderEditor('html', htmlCode, setHtmlCode)}
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200' : 'h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200'} />
      {renderEditor('css', cssCode, setCssCode)}
      <PanelResizeHandle className={settings.layout === 'stacked' ? 'w-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200' : 'h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200'} />
      {renderEditor('js', jsCode, setJsCode)}
    </PanelGroup>
  );
};

export default EditorPanel;