import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const HtmlStructureGenerator = () => {
  const [structure, setStructure] = useState({
    title: 'My Web Page',
    headContent: '',
    bodyContent: '<h1>Welcome to My Web Page</h1>\n<p>This is a paragraph.</p>'
  });

  const generateHtml = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${structure.title}</title>
    ${structure.headContent}
</head>
<body>
    ${structure.bodyContent}
</body>
</html>
    `.trim();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">HTML Structure Generator</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Page Title</label>
        <Input
          value={structure.title}
          onChange={(e) => setStructure({ ...structure, title: e.target.value })}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Head Content</label>
        <Textarea
          value={structure.headContent}
          onChange={(e) => setStructure({ ...structure, headContent: e.target.value })}
          placeholder="Add meta tags, links, scripts, etc."
          className="bg-gray-700 text-white border-gray-600 h-24"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Body Content</label>
        <Textarea
          value={structure.bodyContent}
          onChange={(e) => setStructure({ ...structure, bodyContent: e.target.value })}
          placeholder="Add your main HTML content here"
          className="bg-gray-700 text-white border-gray-600 h-32"
        />
      </div>
      <Button onClick={() => navigator.clipboard.writeText(generateHtml())} className="bg-blue-600 text-white hover:bg-blue-700">
        Copy HTML
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto whitespace-pre-wrap">
        {generateHtml()}
      </pre>
    </div>
  );
};

export default HtmlStructureGenerator;