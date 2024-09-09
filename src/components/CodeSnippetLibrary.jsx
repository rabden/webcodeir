import React, { useState } from 'react';
import { X, Copy, Code, Palette, Wrench, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const snippets = {
  html: [
    { name: 'Basic Structure', code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>` },
    { name: 'Navigation', code: `<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>` },
    { name: 'Form', code: `<form action="/submit" method="post">\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" required>\n  \n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  \n  <label for="message">Message:</label>\n  <textarea id="message" name="message" required></textarea>\n  \n  <button type="submit">Submit</button>\n</form>` },
    { name: 'Responsive Image', code: `<picture>\n  <source srcset="img-large.jpg" media="(min-width: 800px)">\n  <source srcset="img-medium.jpg" media="(min-width: 400px)">\n  <img src="img-small.jpg" alt="Description" style="width:auto;">\n</picture>` },
    { name: 'Semantic Article', code: `<article>\n  <header>\n    <h1>Article Title</h1>\n    <p>Posted by John Doe on <time datetime="2023-05-15">May 15, 2023</time></p>\n  </header>\n  <p>Article content goes here...</p>\n  <footer>\n    <p>Tags: <a href="#">web</a>, <a href="#">html</a>, <a href="#">semantic</a></p>\n  </footer>\n</article>` },
    { name: 'Video Player', code: `<video width="320" height="240" controls>\n  <source src="movie.mp4" type="video/mp4">\n  <source src="movie.ogg" type="video/ogg">\n  Your browser does not support the video tag.\n</video>` },
    { name: 'Table', code: `<table>\n  <thead>\n    <tr>\n      <th>Header 1</th>\n      <th>Header 2</th>\n      <th>Header 3</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Row 1, Cell 1</td>\n      <td>Row 1, Cell 2</td>\n      <td>Row 1, Cell 3</td>\n    </tr>\n    <tr>\n      <td>Row 2, Cell 1</td>\n      <td>Row 2, Cell 2</td>\n      <td>Row 2, Cell 3</td>\n    </tr>\n  </tbody>\n</table>` },
    { name: 'Meta Tags', code: `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="A brief description of your page">\n<meta name="keywords" content="your, keywords, here">\n<meta name="author" content="Your Name">\n<meta property="og:title" content="Your Page Title">\n<meta property="og:description" content="Brief description for social media">\n<meta property="og:image" content="https://example.com/image.jpg">\n<meta property="og:url" content="https://example.com/page">\n<meta name="twitter:card" content="summary_large_image">` },
    { name: 'Accordion', code: `<div class="accordion">\n  <div class="accordion-item">\n    <h2 class="accordion-header">\n      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">\n        Accordion Item #1\n      </button>\n    </h2>\n    <div id="collapseOne" class="accordion-collapse collapse show">\n      <div class="accordion-body">\n        Content for accordion item #1 goes here.\n      </div>\n    </div>\n  </div>\n  <!-- More accordion items -->\n</div>` },
    { name: 'Modal', code: `<button id="openModal">Open Modal</button>\n\n<div id="myModal" class="modal">\n  <div class="modal-content">\n    <span class="close">&times;</span>\n    <h2>Modal Title</h2>\n    <p>This is the modal content.</p>\n  </div>\n</div>\n\n<script>\n  // Modal functionality would go here\n</script>` },
    { name: 'Responsive Grid', code: `<div class="grid-container">\n  <div class="grid-item">1</div>\n  <div class="grid-item">2</div>\n  <div class="grid-item">3</div>\n  <div class="grid-item">4</div>\n  <div class="grid-item">5</div>\n  <div class="grid-item">6</div>\n</div>\n\n<style>\n  .grid-container {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n    gap: 20px;\n  }\n  .grid-item {\n    background-color: #f1f1f1;\n    padding: 20px;\n    text-align: center;\n  }\n</style>` },
    { name: 'Flexbox Layout', code: `<div class="flex-container">\n  <div class="flex-item">1</div>\n  <div class="flex-item">2</div>\n  <div class="flex-item">3</div>\n</div>\n\n<style>\n  .flex-container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n  }\n  .flex-item {\n    flex: 1;\n    margin: 10px;\n    padding: 20px;\n    background-color: #f1f1f1;\n    text-align: center;\n  }\n</style>` },
    { name: 'Card Component', code: `<div class="card">\n  <img src="image.jpg" alt="Card image" style="width:100%">\n  <div class="card-content">\n    <h4><b>Card Title</b></h4>\n    <p>Some description text</p>\n  </div>\n</div>\n\n<style>\n  .card {\n    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\n    transition: 0.3s;\n    width: 300px;\n  }\n  .card:hover {\n    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\n  }\n  .card-content {\n    padding: 2px 16px;\n  }\n</style>` },
    { name: 'Responsive Navigation', code: `<nav class="navbar">\n  <ul class="nav-menu">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n  <div class="hamburger">\n    <span class="bar"></span>\n    <span class="bar"></span>\n    <span class="bar"></span>\n  </div>\n</nav>\n\n<style>\n  .navbar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem 1.5rem;\n  }\n  .hamburger {\n    display: none;\n  }\n  .bar {\n    display: block;\n    width: 25px;\n    height: 3px;\n    margin: 5px auto;\n    background-color: #333;\n  }\n  @media (max-width: 768px) {\n    .nav-menu {\n      position: fixed;\n      left: -100%;\n      top: 5rem;\n      flex-direction: column;\n      background-color: #fff;\n      width: 100%;\n      text-align: center;\n      transition: 0.3s;\n      box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);\n    }\n    .nav-menu.active {\n      left: 0;\n    }\n    .hamburger {\n      display: block;\n      cursor: pointer;\n    }\n  }\n</style>` },
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
    <div className="fixed inset-y-4 right-4 w-80 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden">
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
                <Code className="w-4 h-4 mr-2" />
                HTML
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('css')} className="hover:bg-gray-600">
                <Palette className="w-4 h-4 mr-2" />
                CSS
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('js')} className="hover:bg-gray-600">
                <Wrench className="w-4 h-4 mr-2" />
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(snippet.code, snippet.name)}
                  className={copiedStates[snippet.name] ? "text-green-500" : ""}
                >
                  {copiedStates[snippet.name] ? (
                    "Copied!"
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-gray-800 p-2 rounded text-sm text-white overflow-x-auto whitespace-pre-wrap break-all">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CodeSnippetLibrary;