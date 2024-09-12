import React from 'react';
import Settings from './Settings';
import SavedCodes from './SavedCodes';
import FontPanel from './FontPanel';
import IconPanel from './IconPanel';
import CodeToolsPanel from './CodeToolsPanel';
import KeyboardShortcutsPanel from './KeyboardShortcutsPanel';
import PexelsImagePanel from './PexelsImagePanel';
import ConsolePanel from './ConsolePanel';
import CodeSnippetLibrary from './CodeSnippetLibrary';
import AIImageGenerator from './AIImageGenerator';
import ProfilePanel from './ProfilePanel';

const LazyComponents = ({
  state,
  setState,
  showConsole,
  setShowConsole,
  showSnippetLibrary,
  setShowSnippetLibrary,
  showCodeToolsPanel,
  setShowCodeToolsPanel,
  codeToolsInitialTab
}) => {
  return (
    <>
      {state.showSettings && <Settings settings={state.settings} setSettings={(newSettings) => setState(s => ({ ...s, settings: newSettings }))} onClose={() => setState(s => ({ ...s, showSettings: false }))} isMobile={state.iMobile} />}
      {state.showSavedCodes && state.authContext?.session && <SavedCodes onClose={() => setState(s => ({ ...s, showSavedCodes: false }))} onLoad={(code) => setState(s => ({ ...s, htmlCode: code.html_code, cssCode: code.css_code, jsCode: code.js_code, currentCodeName: code.title, showSavedCodes: false }))} isMobile={state.iMobile} />}
      {state.showFontPanel && <FontPanel onClose={() => setState(s => ({ ...s, showFontPanel: false }))} isMobile={state.iMobile} />}
      {state.showIconPanel && <IconPanel onClose={() => setState(s => ({ ...s, showIconPanel: false }))} iMobile={state.iMobile} />}
      {showCodeToolsPanel && <CodeToolsPanel onClose={() => setShowCodeToolsPanel(false)} initialTab={codeToolsInitialTab} />}
      {state.showAIImageGeneratorPanel && state.authContext?.session && <AIImageGenerator onClose={() => setState(s => ({ ...s, showAIImageGeneratorPanel: false }))} />}
      {state.showKeyboardShortcuts && <KeyboardShortcutsPanel onClose={() => setState(s => ({ ...s, showKeyboardShortcuts: false }))} />}
      {state.showPexelsPanel && <PexelsImagePanel onClose={() => setState(s => ({ ...s, showPexelsPanel: false }))} />}
      {showConsole && <ConsolePanel onClose={() => setShowConsole(false)} isMobile={state.iMobile} />}
      {showSnippetLibrary && <CodeSnippetLibrary onClose={() => setShowSnippetLibrary(false)} isMobile={state.iMobile} />}
      {state.showProfilePanel && <ProfilePanel onClose={() => setState(s => ({ ...s, showProfilePanel: false }))} />}
    </>
  );
};

export default React.memo(LazyComponents);