import React, { useState, useEffect } from 'react';
import { X, Trash2, ChevronDown, ChevronUp, Play, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCodeSnippets, useDeleteCodeSnippet } from '../integrations/supabase';
import { useSupabaseAuth } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const SavedCodes = ({ onClose, onLoad }) => {
  const [expandedCode, setExpandedCode] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { session } = useSupabaseAuth();
  const userId = session?.user?.id;
  const { data: savedCodes, isLoading, error } = useCodeSnippets(userId);
  const deleteCodeSnippet = useDeleteCodeSnippet();
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCodeSnippet.mutateAsync(id);
      toast({
        title: "Success",
        description: "Code deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting code:', error);
      toast({
        title: "Error",
        description: "Failed to delete code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRename = (id, newName) => {
    // Implement rename functionality using Supabase
    // This will require creating a new mutation in the useCodeSnippets hook
    console.log('Rename functionality not implemented yet');
  };

  const toggleExpand = (id) => {
    setExpandedCode(expandedCode === id ? null : id);
  };

  const generatePreviewCode = (html, css, js) => {
    return `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  if (isLoading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'inset-y-4 right-4 w-[700px]'} bg-gray-800 shadow-lg z-50 flex flex-col ${isMobile ? '' : 'rounded-lg'} overflow-hidden`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>Saved Codes</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {savedCodes && savedCodes.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">No saved codes yet.</p>
        ) : (
          <ul className="space-y-4">
            {savedCodes && savedCodes.map((code) => (
              <li key={code.id} className={`p-3 rounded-lg bg-gray-700 shadow ${isMobile ? 'text-sm' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={code.title}
                    onChange={(e) => handleRename(code.id, e.target.value)}
                    className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mr-2 px-2 py-1 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLoad(code)}
                      className={`p-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors ${isMobile ? 'p-1' : ''}`}
                      title="Load"
                    >
                      <Play className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className={`p-2 rounded hover:bg-red-700 transition-colors ${isMobile ? 'p-1' : ''}`}
                      title="Delete"
                    >
                      <Trash2 className={`text-red-500 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </button>
                    {!isMobile && (
                      <button
                        onClick={() => toggleExpand(code.id)}
                        className="p-2 rounded hover:bg-gray-600 transition-colors"
                        title={expandedCode === code.id ? "Hide Preview" : "Show Preview"}
                      >
                        {expandedCode === code.id ? 
                          <EyeOff className="w-4 h-4 text-white" /> : 
                          <Eye className="w-4 h-4 text-white" />
                        }
                      </button>
                    )}
                  </div>
                </div>
                {!isMobile && expandedCode === code.id && (
                  <div className="mt-2">
                    <iframe
                      srcDoc={generatePreviewCode(code.html_code, code.css_code, code.js_code)}
                      title={`Preview of ${code.title}`}
                      className="w-full h-[400px] rounded border border-gray-600"
                      sandbox="allow-scripts"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedCodes;