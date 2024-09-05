import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';

const useLayoutManager = (state, setState, updatePreview) => {
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    const startPreviewSize = state.previewSize;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      const newPreviewSize = Math.max(0, Math.min(100, startPreviewSize - (deltaY / window.innerHeight) * 100));
      setState(s => ({ ...s, previewSize: newPreviewSize }));
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const toggleLayout = () => {
    setState(s => ({
      ...s,
      settings: {
        ...s.settings,
        layout: s.settings.layout === 'horizontal' ? 'vertical' : s.settings.layout === 'vertical' ? 'stacked' : 'horizontal'
      }
    }));
  };

  const renderLayout = () => {
    const editorPanel = (
      <EditorPanel
        htmlCode={state.htmlCode}
        cssCode={state.cssCode}
        jsCode={state.jsCode}
        setHtmlCode={(code) => setState(s => ({ ...s, htmlCode: code }))}
        setCssCode={(code) => setState(s => ({ ...s, cssCode: code }))}
        setJsCode={(code) => setState(s => ({ ...s, jsCode: code }))}
        settings={state.settings}
        setShowToolsPanel={() => setState(s => ({ ...s, showToolsPanel: true }))}
      />
    );

    const previewPanel = (
      <PreviewPanel preview={state.preview} />
    );

    if (state.isMobile) {
      return (
        <PanelGroup direction="vertical" className="h-full">
          <Panel minSize={0} maxSize={100} defaultSize={100 - state.previewSize}>
            {editorPanel}
          </Panel>
          <PanelResizeHandle
            className="h-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition-colors duration-200 relative group"
            onTouchStart={handleTouchStart}
          >
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200"></div>
          </PanelResizeHandle>
          <Panel minSize={0} maxSize={100} defaultSize={state.previewSize}>
            {previewPanel}
          </Panel>
        </PanelGroup>
      );
    } else {
      const panelConfig = {
        horizontal: [previewPanel, editorPanel],
        vertical: [editorPanel, previewPanel],
        stacked: [editorPanel, previewPanel]
      };

      const [leftPanel, rightPanel] = panelConfig[state.settings.layout];

      return (
        <PanelGroup direction={state.settings.layout === 'stacked' ? 'vertical' : 'horizontal'} className="h-full">
          <Panel minSize={0} defaultSize={50}>
            {leftPanel}
          </Panel>
          <PanelResizeHandle className={state.settings.layout === 'stacked' ? 'h-2' : 'w-2'}>
            <div className={`${state.settings.layout === 'stacked' ? 'h-0.5 w-full' : 'w-0.5 h-full'} bg-gray-300 group-hover:bg-gray-100 transition-colors duration-200`}></div>
          </PanelResizeHandle>
          <Panel minSize={0} defaultSize={50}>
            {rightPanel}
          </Panel>
        </PanelGroup>
      );
    }
  };

  return {
    renderLayout,
    toggleLayout,
    handleTouchStart,
  };
};

export default useLayoutManager;