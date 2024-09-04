import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula, vscodeDark, solarizedDark, githubDark, monokai } from '@uiw/codemirror-theme-dracula';
import { autocompletion } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';

const EditorLayout = ({
  isMobile,
  previewSize,
  setPreviewSize,
  preview,
  htmlCode,
  setHtmlCode,
  cssCode,
  setCssCode,
  jsCode,
  setJsCode,
  settings,
  setPreviewWidth
}) => {
  const themes = {
    dracula, vscodeDark, solarizedDark, githubDark, monokai,
  };

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

  const mobileResizeHandle = (
    <PanelResizeHandle className="h-6 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group cursor-row-resize" onDrag={(e) => {
      const newSize = 100 - (e.clientY / window.innerHeight) * 100;
      setPreviewSize(Math.max(0, Math.min(100, newSize)));
    }}>
      <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
    </PanelResizeHandle>
  );

  const desktopResizeHandle = (
    <PanelResizeHandle className="w-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group cursor-col-resize">
      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
    </PanelResizeHandle>
  );

  if (isMobile) {
    return (
      <PanelGroup direction="vertical" className="h-full">
        <Panel minSize={0} maxSize={100} defaultSize={100 - previewSize}>
          <PanelGroup direction="vertical">
            {renderEditor('html', htmlCode, setHtmlCode)}
            <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
            {renderEditor('css', cssCode, setCssCode)}
            <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
            {renderEditor('js', jsCode, setJsCode)}
          </PanelGroup>
        </Panel>
        {mobileResizeHandle}
        <Panel minSize={0} maxSize={100} defaultSize={previewSize}>
          <iframe
            title="preview"
            srcDoc={preview}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts"
          />
        </Panel>
      </PanelGroup>
    );
  } else {
    return (
      <PanelGroup direction="horizontal" className="h-full" onLayout={(sizes) => setPreviewWidth(Math.round(sizes[0] * window.innerWidth / 100))}>
        <Panel minSize={0} defaultSize={50}>
          <iframe
            title="preview"
            srcDoc={preview}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts"
          />
        </Panel>
        {desktopResizeHandle}
        <Panel minSize={0} defaultSize={50}>
          <PanelGroup direction="vertical">
            {renderEditor('html', htmlCode, setHtmlCode)}
            <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
            {renderEditor('css', cssCode, setCssCode)}
            <PanelResizeHandle className="h-1 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200" />
            {renderEditor('js', jsCode, setJsCode)}
          </PanelGroup>
        </Panel>
      </PanelGroup>
    );
  }
};

export default EditorLayout;