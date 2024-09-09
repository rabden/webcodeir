import React, { useState } from 'react';
import { X, Search, Check, MoreVertical, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('css', css);

const snippets = {
  html: [
    { name: 'Basic Structure', code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>` },
    { name: 'Responsive Image', code: `<picture>\n  <source srcset="img-large.jpg" media="(min-width: 800px)">\n  <source srcset="img-medium.jpg" media="(min-width: 400px)">\n  <img src="img-small.jpg" alt="Description" style="width:auto;">\n</picture>` },
    { name: 'Semantic Article', code: `<article>\n  <header>\n    <h1>Article Title</h1>\n    <p>Posted by John Doe on <time datetime="2023-05-15">May 15, 2023</time></p>\n  </header>\n  <p>Article content goes here...</p>\n  <footer>\n    <p>Tags: <a href="#">web</a>, <a href="#">html</a>, <a href="#">semantic</a></p>\n  </footer>\n</article>` },
    { name: 'Video Player', code: `<video width="320" height="240" controls>\n  <source src="movie.mp4" type="video/mp4">\n  <source src="movie.ogg" type="video/ogg">\n  Your browser does not support the video tag.\n</video>` },
    { name: 'Meta Tags', code: `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="A brief description of your page">\n<meta name="keywords" content="your, keywords, here">\n<meta name="author" content="Your Name">\n<meta property="og:title" content="Your Page Title">\n<meta property="og:description" content="Brief description for social media">\n<meta property="og:image" content="https://example.com/image.jpg">\n<meta property="og:url" content="https://example.com/page">\n<meta name="twitter:card" content="summary_large_image">` },
    { name: 'Responsive Iframe', code: `<div style="position: relative; overflow: hidden; padding-top: 56.25%;">\n  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen\n    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>\n</div>` },
  ],
  css: [
    { name: 'Flexbox Center', code: `.flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}` },
    { name: 'Grid Layout', code: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 20px;\n}` },
    { name: 'Custom Scrollbar', code: `::-webkit-scrollbar {\n  width: 10px;\n}\n\n::-webkit-scrollbar-track {\n  background: #f1f1f1;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #888;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}` },
    { name: 'Glassmorphism', code: `.glassmorphism {\n  background: rgba(255, 255, 255, 0.25);\n  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\n  backdrop-filter: blur(4px);\n  -webkit-backdrop-filter: blur(4px);\n  border-radius: 10px;\n  border: 1px solid rgba(255, 255, 255, 0.18);\n}` },
    { name: 'Animated Gradient Background', code: `@keyframes gradient {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n.animated-gradient {\n  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);\n  background-size: 400% 400%;\n  animation: gradient 15s ease infinite;\n}` },
    { name: 'Responsive Typography', code: `html {\n  font-size: 16px;\n}\n\n@media screen and (min-width: 320px) {\n  html {\n    font-size: calc(16px + 6 * ((100vw - 320px) / 680));\n  }\n}\n\n@media screen and (min-width: 1000px) {\n  html {\n    font-size: 22px;\n  }\n}` },
  ],
  js: [
    { name: 'Fetch API', code: `fetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));` },
    { name: 'Debounce Function', code: `function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}` },
    { name: 'Async/Await Function', code: `async function fetchData() {\n  try {\n    const response = await fetch("https://api.example.com/data");\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error("Error:", error);\n  }\n}` },
    { name: 'Promise All', code: `const promise1 = Promise.resolve(3);\nconst promise2 = 42;\nconst promise3 = new Promise((resolve, reject) => {\n  setTimeout(resolve, 100, "foo");\n});\n\nPromise.all([promise1, promise2, promise3]).then((values) => {\n  console.log(values); // [3, 42, "foo"]\n});` },
    { name: 'Intersection Observer', code: `const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      console.log("Element is visible");\n    }\n  });\n});\n\nconst target = document.querySelector("#myElement");\nobserver.observe(target);` },
    { name: 'Web Worker', code: `// main.js\nconst worker = new Worker("worker.js");\n\nworker.postMessage({ data: "Hello from main" });\n\nworker.onmessage = function(event) {\n  console.log("Received from worker:", event.data);\n};\n\n// worker.js\nself.onmessage = function(event) {\n  console.log("Received in worker:", event.data);\n  self.postMessage({ result: "Hello from worker" });\n};` },
  ],
};

const CodeSnippetLibrary = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const { toast } = useToast();

  const filteredSnippets = snippets[activeTab].filter(snippet =>
    snippet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (code, snippetName) => {
    navigator.clipboard.writeText(code);
    setCopiedStates({ ...copiedStates, [snippetName]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [snippetName]: false });
    }, 2000);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Code Snippet Library</h2>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-700 text-white border-gray-600">
              <DropdownMenuItem onSelect={() => setActiveTab('html')} className="hover:bg-gray-600">
                HTML
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('css')} className="hover:bg-gray-600">
                CSS
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('js')} className="hover:bg-gray-600">
                JavaScript
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Input
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 text-white border-gray-600"
        />
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {filteredSnippets.map((snippet, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-semibold">{snippet.name}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(snippet.code, snippet.name)}
                        className={copiedStates[snippet.name] ? "text-green-500" : ""}
                      >
                        {copiedStates[snippet.name] ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copiedStates[snippet.name] ? "Copied!" : "Copy to clipboard"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  language={activeTab === 'js' ? 'javascript' : activeTab}
                  style={docco}
                  customStyle={{
                    backgroundColor: 'transparent',
                    padding: '1rem',
                    margin: 0,
                    borderRadius: '0.5rem',
                  }}
                  wrapLongLines={false}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CodeSnippetLibrary;