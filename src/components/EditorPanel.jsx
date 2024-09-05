import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';

const EditorPanel = ({ language, code, setCode, settings, themes }) => {
  return (
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
          onChange={(value) => setCode(prev => ({ ...prev, [language]: value }))}
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
  );
};

export default EditorPanel;