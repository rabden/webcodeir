import React, { lazy, Suspense } from 'react';
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
import { useAddCodeSnippet } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const Settings = lazy(() => import('./Settings'));
const SavedCodes = lazy(() => import('./SavedCodes'));
const FontPanel = lazy(() => import('./FontPanel'));
const IconPanel = lazy(() => import('./IconPanel'));
const CodeToolsPanel = lazy(() => import('./CodeToolsPanel'));
const KeyboardShortcutsPanel = lazy(() => import('./KeyboardShortcutsPanel'));
const PexelsImagePanel = lazy(() => import('./PexelsImagePanel'));
const ConsolePanel = lazy(() => import('./ConsolePanel'));
const CodeSnippetLibrary = lazy(() => import('./CodeSnippetLibrary'));
const AIImageGenerator = lazy(() => import('./AIImageGenerator'));

const CodeEditor = () => {
  const [state, setState] = useCodeEditorState();
  const { saveToLocalStorage, loadFromLocalStorage } = useLocalStorage(setState);
  const [activeTab, setActiveTab] = React.useState('html');
  const [showConsole, setShowConsole] = React.useState(false);
  const [showSnippetLibrary, setShowSnippetLibrary] = React.useState(false);
  const [showCodeToolsPanel, setShowCodeToolsPanel] = React.useState(false);
  const [codeToolsInitialTab, setCodeToolsInitialTab] = React.useState('html');
  const { session } = useSupabaseAuth();
  const addCodeSnippet = useAddCodeSnippet();
  const { toast } = useToast();

  React.useEffect(() => {
    loadFromLocalStorage();
    const handleResize = () => setState(s => ({ ...s, isMobile: window.innerWidth < 768 }));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      updatePreview();
      if (state.settings.autoSave) saveToLocalStorage(state);
    }, 300);
    return () => clearTimeout(debounce);
  }, [state.htmlCode, state.cssCode, state.jsCode, state.settings.autoSave]);

  const updatePreview = () => {
    setState(s => ({
      ...s,
      preview: `
        <html>
          <head><style>${s.cssCode}</style></head>
          <body>${s.htmlCode}<script>${s.jsCode}</script></body>
        </html>
      `
    }));
  };

  const saveCurrentCode = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be signed in to save codes.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCodeSnippet.mutateAsync({
        user_id: session.user.id,
        title: state.currentCodeName,
        html_code: state.htmlCode,
        css_code: state.cssCode,
        js_code: state.jsCode,
      });
      toast({
        title: "Success",
        description: "Code saved successfully!",
      });
    } catch (error) {
      console.error('Error saving code:', error);
      toast({
        title: "Error",
        description: "Failed to save code. Please try again.",
        variant: "destructive",
      });
    }
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
      <div className="relative h-full">
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
        {state.isMobile && (
          <MobilePreviewButton
            onClick={() => setState(s => ({ ...s, showMobilePreview: !s.showMobilePreview }))}
            isPreviewVisible={state.showMobilePreview}
          />
        )}
      </div>
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
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-300">
      <Header
        currentCodeName={state.currentCodeName}
        setCurrentCodeName={(name) => setState(s => ({ ...s, currentCodeName: name }))}
        isMobile={state.isMobile}
        saveCurrentCode={saveCurrentCode}
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
        session={session}
      />
      <div className="flex-grow overflow-hidden">
        {renderLayout()}
      </div>
      <Suspense fallback={<LoadingAnimation />}>
        {state.showSettings && <Settings settings={state.settings} setSettings={(newSettings) => setState(s => ({ ...s, settings: newSettings }))} onClose={() => setState(s => ({ ...s, showSettings: false }))} isMobile={state.iMobile} />}
        {state.showSavedCodes && session && <SavedCodes onClose={() => setState(s => ({ ...s, showSavedCodes: false }))} onLoad={(code) => setState(s => ({ ...s, htmlCode: code.html_code, cssCode: code.css_code, jsCode: code.js_code, currentCodeName: code.title, showSavedCodes: false }))} isMobile={state.iMobile} />}
        {state.showFontPanel && <FontPanel onClose={() => setState(s => ({ ...s, showFontPanel: false }))} isMobile={state.iMobile} />}
        {state.showIconPanel && <IconPanel onClose={() => setState(s => ({ ...s, showIconPanel: false }))} isMobile={state.iMobile} />}
        {showCodeToolsPanel && <CodeToolsPanel onClose={() => setShowCodeToolsPanel(false)} initialTab={codeToolsInitialTab} />}
        {state.showAIImageGeneratorPanel && session && <AIImageGenerator onClose={() => setState(s => ({ ...s, showAIImageGeneratorPanel: false }))} />}
        {state.showKeyboardShortcuts && <KeyboardShortcutsPanel onClose={() => setState(s => ({ ...s, showKeyboardShortcuts: false }))} />}
        {state.showPexelsPanel && <PexelsImagePanel onClose={() => setState(s => ({ ...s, showPexelsPanel: false }))} />}
        {showConsole && <ConsolePanel onClose={() => setShowConsole(false)} isMobile={state.iMobile} />}
        {showSnippetLibrary && <CodeSnippetLibrary onClose={() => setShowSnippetLibrary(false)} isMobile={state.iMobile} />}
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
        saveCurrentCode={() => { saveCurrentCode(); setState(s => ({ ...s, isMenuOpen: false })); }}
        toggleConsole={() => { setShowConsole(s => !s); setState(s => ({ ...s, isMenuOpen: false })); }}
        showConsole={showConsole}
        toggleSnippetLibrary={() => { setShowSnippetLibrary(s => !s); setState(s => ({ ...s, isMenuOpen: false })); }}
        showSnippetLibrary={showSnippetLibrary}
        session={session}
      />
    </div>
  );
};

export default CodeEditor;