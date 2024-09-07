import React, { useState } from 'react';
import { X, Copy, Code, Palette, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const snippets = {
  html: [
    { name: 'Basic Structure', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>' },
    { name: 'Navigation', code: '<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>' },
    { name: 'Form', code: '<form>\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" required>\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  <button type="submit">Submit</button>\n</form>' },
  ],
  css: [
    { name: 'Flexbox Center', code: '.flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}' },
    { name: 'Grid Layout', code: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}' },
    { name: 'Responsive Image', code: '.responsive-image {\n  max-width: 100%;\n  height: auto;\n}' },
  ],
  js: [
    { name: 'Fetch API', code: 'fetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));' },
    { name: 'Event Listener', code: 'document.getElementById("myButton").addEventListener("click", function() {\n  console.log("Button clicked!");\n});' },
    { name: 'Local Storage', code: '// Set item\nlocaleStorage.setItem("key", "value");\n\n// Get item\nconst value = localStorage.getItem("key");\n\n// Remove item\nlocaleStorage.removeItem("key");' },
  ],
};

const CodeSnippetLibrary = ({ onClose, isMobile }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredSnippets = snippets[activeTab].filter(snippet =>
    snippet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
  };

  return (
    <div className={`fixed inset-y-4 right-4 ${isMobile ? 'left-4' : 'w-96'} bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Code Snippet Library</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <Input
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="bg-gray-700 p-1">
          <TabsTrigger value="html" className="flex-1 data-[state=active]:bg-gray-600">
            <Code className="w-4 h-4 mr-2" />
            HTML
          </TabsTrigger>
          <TabsTrigger value="css" className="flex-1 data-[state=active]:bg-gray-600">
            <Palette className="w-4 h-4 mr-2" />
            CSS
          </TabsTrigger>
          <TabsTrigger value="js" className="flex-1 data-[state=active]:bg-gray-600">
            <Wrench className="w-4 h-4 mr-2" />
            JavaScript
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-grow">
          <TabsContent value="html" className="p-4 space-y-4">
            {filteredSnippets.map((snippet, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-semibold">{snippet.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(snippet.code)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-gray-800 p-2 rounded text-sm text-white overflow-x-auto">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="css" className="p-4 space-y-4">
            {filteredSnippets.map((snippet, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-semibold">{snippet.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(snippet.code)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-gray-800 p-2 rounded text-sm text-white overflow-x-auto">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="js" className="p-4 space-y-4">
            {filteredSnippets.map((snippet, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-semibold">{snippet.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(snippet.code)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-gray-800 p-2 rounded text-sm text-white overflow-x-auto">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CodeSnippetLibrary;