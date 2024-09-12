import React, { lazy, Suspense, useEffect, useCallback, useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Header from './Header';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import MobileMenu from './MobileMenu';
import MobilePreviewButton from './MobilePreviewButton';
import { useCodeEditorState } from '../hooks/useCodeEditorState';
import { useLocalStorage } from '../hooks/useLocalStorage';
import LoadingAnimation from './LoadingAnimation';
import { useSupabaseAuth } from '../integrations/supabase';
import { useAddCodeSnippet, useUpdateCodeSnippet } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const LazyComponents = lazy(() => import('./LazyComponents'));

const CodeEditor = () => {
  const [state, setState] = useCodeEditorState();
  const { saveToLocalStorage, loadFromLocalStorage } = useLocalStorage(setState);
  const [activeTab, setActiveTab] = useState('html');
  const [showConsole, setShowConsole] = useState(false);
  const [showSnippetLibrary, setShowSnippetLibrary] = useState(false);
  const [showCodeToolsPanel, setShowCodeToolsPanel] = useState(false);
  const [codeToolsInitialTab, setCodeToolsInitialTab] = useState('html');
  const [currentLoadedCode, setCurrentLoadedCode] = useState(null);
  const authContext = useSupabaseAuth();
  const addCodeSnippet = useAddCodeSnippet();
  const updateCodeSnippet = useUpdateCodeSnippet();
  const { toast } = useToast();

  useEffect(() => {
    loadFromLocalStorage();
    const handleResize = () => setState(s => ({ ...s, isMobile: window.innerWidth < 768 }));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
      if (state.settings.autoSave) saveToLocalStorage(state);
    }, 300);
    return () => clearTimeout(debounce);
  }, [state.htmlCode, state.cssCode, state.jsCode, state.settings.autoSave]);

  const updatePreview = useCallback(() => {
    setState(s => ({
      ...s,
      preview: `
        <html>
          <head><style>${s.cssCode}</style></head>
          <body>${s.htmlCode}<script>${s.jsCode}</script></body>
        </html>
      `
    }));
  }, [setState]);

  const saveOrUpdateCode = useCallback(async () => {
    if (!authContext || !authContext.session) {
      toast({
        title: "Error",
        description: "You must be signed in to save codes.",
        variant: "destructive",
      });
      return;
    }

    const codeData = {
      user_id: authContext.session.user.id,
      title: state.currentCodeName,
      html_code: state.htmlCode,
      css_code: state.cssCode,
      js_code: state.jsCode,
    };

    try {
      if (currentLoadedCode) {
        await updateCodeSnippet.mutateAsync({ id: currentLoadedCode.id, ...codeData });
        toast({
          title: "Success",
          description: "Code updated successfully!",
        });
      } else {
        await addCodeSnippet.mutateAsync(codeData);
        toast({
          title: "Success",
          description: "Code saved successfully!",
        });
      }
    } catch (error) {
      console.error('Error saving/updating code:', error);
      toast({
        title: "Error",
        description: "Failed to save/update code. Please try again.",
        variant: "destructive",
      });
    }
  }, [authContext, addCodeSnippet, updateCodeSnippet, state.currentCodeName, state.htmlCode, state.cssCode, state.jsCode, currentLoadedCode, toast]);

  const toggleLayout = useCallback(() => {
    setState(s => ({
      ...s,
      settings: {
        ...s.settings,
        layout: s.settings.layout === 'horizontal' ? 'vertical' : s.settings.layout === 'vertical' ? 'stacked' : 'horizontal'
      }
    }));
  }, [setState]);

  const renderLayout = useMemo(() => {
    const editorPanel = (
      <EditorPanel
        htmlCode={state.htmlCode}
        cssCode={state.cssCode}
        jsCode={state.jsCode}
        setHtmlCode={(code) => setState(s => ({ ...s, htmlCode: code }))}
        setCssCode={(code) => setState(s => ({ ...s, cssCode: code }))}
        setJsCode={(code) => setState(s => ({ ...s, jsCode: code }))}
        settings={state.settings}
        isMobile={state.isMobile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );
    const previewPanel = <PreviewPanel preview={state.preview} />;

    if (state.isMobile) {
      return (
        <div className="h-full relative">
          {editorPanel}
          {state.showMobilePreview && (
            <div className="fixed inset-0 z-40 bg-gray-900">
              {previewPanel}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <PanelGroup direction={state.settings.layout === 'stacked' ? 'vertical' : 'horizontal'}>
          <Panel minSize={0} defaultSize={50}>
            {state.settings.layout === 'horizontal' ? previewPanel : editorPanel}
          </Panel>
          <PanelResizeHandle className={state.settings.layout === 'stacked' ? 'h-2' : 'w-2'}>
            <div className={`${state.settings.layout === 'stacked' ? 'h-0.5 w-full' : 'w-0.5 h-full'} bg-gray-600 group-hover:bg-gray-400 transition-colors duration-200`}></div>
          </PanelResizeHandle>
          <Panel minSize={0} defaultSize={50}>
            {state.settings.layout === 'horizontal' ? editorPanel : previewPanel}
          </Panel>
        </PanelGroup>
      );
    }
  }, [state.htmlCode, state.cssCode, state.jsCode, state.settings, state.isMobile, state.showMobilePreview, state.preview, activeTab, setActiveTab]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-300">
      <Header
        currentCodeName={state.currentCodeName}
        setCurrentCodeName={(name) => setState(s => ({ ...s, currentCodeName: name }))}
        isMobile={state.isMobile}
        saveOrUpdateCode={saveOrUpdateCode}
        isUpdateMode={!!currentLoadedCode}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true }))}
        setShowIconPanel={() => setState(s => ({ ...s, showIconPanel: true }))}
        setShowSettings={() => setState(s => ({ ...s, showSettings: true }))}
        setIsMenuOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        toggleLayout={toggleLayout}
        layout={state.settings.layout}
        setShowKeyboardShortcuts={() => setState(s => ({ ...s, showKeyboardShortcuts: true }))}
        setShowPexelsPanel={() => setState(s => ({ ...s, showPexelsPanel: true }))}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleConsole={() => setShowConsole(s => !s)}
        showConsole={showConsole}
        toggleSnippetLibrary={() => setShowSnippetLibrary(s => !s)}
        showSnippetLibrary={showSnippetLibrary}
        setShowCodeToolsPanel={setShowCodeToolsPanel}
        setCodeToolsInitialTab={setCodeToolsInitialTab}
        setShowAIImageGeneratorPanel={() => setState(s => ({ ...s, showAIImageGeneratorPanel: true }))}
        setShowProfilePanel={() => setState(s => ({ ...s, showProfilePanel: true }))}
        session={authContext?.session}
      />
      <div className="flex-grow overflow-hidden">
        {renderLayout}
      </div>
      <Suspense fallback={<LoadingAnimation />}>
        <LazyComponents
          state={state}
          setState={setState}
          showConsole={showConsole}
          setShowConsole={setShowConsole}
          showSnippetLibrary={showSnippetLibrary}
          setShowSnippetLibrary={setShowSnippetLibrary}
          showCodeToolsPanel={showCodeToolsPanel}
          setShowCodeToolsPanel={setShowCodeToolsPanel}
          codeToolsInitialTab={codeToolsInitialTab}
          setCurrentLoadedCode={setCurrentLoadedCode}
        />
      </Suspense>
      <MobileMenu
        isOpen={state.isMenuOpen}
        setIsOpen={(isOpen) => setState(s => ({ ...s, isMenuOpen: isOpen }))}
        setShowSettings={() => setState(s => ({ ...s, showSettings: true, isMenuOpen: false }))}
        setShowSavedCodes={() => setState(s => ({ ...s, showSavedCodes: true, isMenuOpen: false }))}
        setShowFontPanel={() => setState(s => ({ ...s, showFontPanel: true, isMenuOpen: false }))}
        setShowIconPanel={() => setState(s => ({ ...s, showIconPanel: true, isMenuOpen: false }))}
        setShowCodeToolsPanel={(tab) => { setShowCodeToolsPanel(true); setCodeToolsInitialTab(tab); setState(s => ({ ...s, isMenuOpen: false })); }}
        setShowAIImageGeneratorPanel={() => setState(s => ({ ...s, showAIImageGeneratorPanel: true, isMenuOpen: false }))}
        setShowKeyboardShortcuts={() => setState(s => ({ ...s, showKeyboardShortcuts: true, isMenuOpen: false }))}
        setShowPexelsPanel={() => setState(s => ({ ...s, showPexelsPanel: true, isMenuOpen: false }))}
        saveOrUpdateCode={() => { saveOrUpdateCode(); setState(s => ({ ...s, isMenuOpen: false })); }}
        isUpdateMode={!!currentLoadedCode}
        toggleConsole={() => { setShowConsole(s => !s); setState(s => ({ ...s, isMenuOpen: false })); }}
        showConsole={showConsole}
        toggleSnippetLibrary={() => { setShowSnippetLibrary(s => !s); setState(s => ({ ...s, isMenuOpen: false })); }}
        showSnippetLibrary={showSnippetLibrary}
        session={authContext?.session}
        setShowProfilePanel={() => setState(s => ({ ...s, showProfilePanel: true, isMenuOpen: false }))}
      />
    </div>
  );
};

export default React.memo(CodeEditor);