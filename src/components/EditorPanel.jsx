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

const EditorPanel = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, settings }) => {
  const themes = { dracula, vscodeDark, solarizedDark, githubDark, monokai };

  const renderEditor = (language, code, setCode) => (
    <Panel minSize={5} defaultSize={33}>
      <div className="h-full flex flex-col">
        <div className="bg-[#2d2d2d] p-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${language === 'html' ? 'bg-[#ff5f56]' : language === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
            <span className="text-sm font-semibold">{language.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          <CodeMirror
            value={code}
            height="100%"
            theme={themes[settings.editorTheme]}
            extensions={[
              language === 'html' ? html() : language === 'css' ? css() : javascript(),
              autocompletion(),
              EditorView.lineWrapping,
            ]}
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

  return (
    <PanelGroup direction="vertical">
      {renderEditor('html', htmlCode, setHtmlCode)}
      <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
      {renderEditor('css', cssCode, setCssCode)}
      <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
      {renderEditor('js', jsCode, setJsCode)}
    </PanelGroup>
  );
};

export default EditorPanel;