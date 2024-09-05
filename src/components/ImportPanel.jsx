import React, { useState } from 'react';
import { X, Upload, HardDrive, Dropbox } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ImportPanel = ({ onClose, onImport, isMobile }) => {
  const [selectedSource, setSelectedSource] = useState('localStorage');

  const handleImport = async () => {
    let importedCode = { html: '', css: '', js: '' };

    switch (selectedSource) {
      case 'localStorage':
        const savedState = localStorage.getItem('codeEditorState');
        if (savedState) {
          const { htmlCode, cssCode, jsCode } = JSON.parse(savedState);
          importedCode = { html: htmlCode, css: cssCode, js: jsCode };
        }
        break;
      case 'googleDrive':
        // Implement Google Drive import logic here
        alert('Google Drive import not implemented yet');
        return;
      case 'dropbox':
        // Implement Dropbox import logic here
        alert('Dropbox import not implemented yet');
        return;
      default:
        return;
    }

    onImport(importedCode);
    onClose();
  };

  return (
    <div className={`fixed inset-y-4 ${isMobile ? 'inset-x-4' : 'right-4'} bg-gray-800 ${isMobile ? 'w-auto' : 'w-96'} shadow-lg z-50 flex flex-col rounded-lg`}>
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Import Code</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        <div>
          <label className="block mb-2 text-white">Import Source</label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="localStorage">Local Storage</option>
            <option value="googleDrive">Google Drive</option>
            <option value="dropbox">Dropbox</option>
          </select>
        </div>
        <Button onClick={handleImport} className="w-full">
          {selectedSource === 'localStorage' && <HardDrive className="w-4 h-4 mr-2" />}
          {selectedSource === 'googleDrive' && <Upload className="w-4 h-4 mr-2" />}
          {selectedSource === 'dropbox' && <Dropbox className="w-4 h-4 mr-2" />}
          Import from {selectedSource === 'localStorage' ? 'Local Storage' : selectedSource === 'googleDrive' ? 'Google Drive' : 'Dropbox'}
        </Button>
      </div>
    </div>
  );
};

export default ImportPanel;