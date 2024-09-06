import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const JsSnippetGenerator = () => {
  const [snippetType, setSnippetType] = useState('function');
  const [snippetCode, setSnippetCode] = useState('');

  const generateSnippet = () => {
    let code = '';
    switch (snippetType) {
      case 'function':
        code = `function myFunction(param1, param2) {\n  // Function body\n  return result;\n}`;
        break;
      case 'arrowFunction':
        code = `const myArrowFunction = (param1, param2) => {\n  // Function body\n  return result;\n};`;
        break;
      case 'class':
        code = `class MyClass {\n  constructor(param) {\n    this.property = param;\n  }\n\n  myMethod() {\n    // Method body\n  }\n}`;
        break;
      case 'promise':
        code = `const myPromise = new Promise((resolve, reject) => {\n  // Asynchronous operation\n  if (/* operation successful */) {\n    resolve(result);\n  } else {\n    reject(error);\n  }\n});`;
        break;
      default:
        code = '// Select a snippet type';
    }
    setSnippetCode(code);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">JavaScript Snippet Generator</h3>
      <Select value={snippetType} onValueChange={setSnippetType}>
        <SelectTrigger className="bg-gray-700 text-white border-gray-600">
          <SelectValue placeholder="Select Snippet Type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600">
          <SelectItem value="function">Function</SelectItem>
          <SelectItem value="arrowFunction">Arrow Function</SelectItem>
          <SelectItem value="class">Class</SelectItem>
          <SelectItem value="promise">Promise</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={generateSnippet} className="bg-blue-600 text-white hover:bg-blue-700">
        Generate Snippet
      </Button>
      <Textarea
        value={snippetCode}
        onChange={(e) => setSnippetCode(e.target.value)}
        className="h-48 font-mono bg-gray-800 text-white border-gray-700"
        placeholder="Generated snippet will appear here"
      />
      <Button onClick={() => navigator.clipboard.writeText(snippetCode)} className="bg-green-600 text-white hover:bg-green-700">
        Copy Snippet
      </Button>
    </div>
  );
};

export default JsSnippetGenerator;