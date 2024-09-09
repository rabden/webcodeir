import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const JsSnippetGenerator = () => {
  const [snippetType, setSnippetType] = useState('function');
  const [functionName, setFunctionName] = useState('myFunction');
  const [parameters, setParameters] = useState(['param1', 'param2']);
  const [snippetCode, setSnippetCode] = useState('');

  const generateSnippet = () => {
    let code = '';
    const paramList = parameters.join(', ');
    switch (snippetType) {
      case 'function':
        code = `function ${functionName}(${paramList}) {\n  // Function body\n  return result;\n}`;
        break;
      case 'arrowFunction':
        code = `const ${functionName} = (${paramList}) => {\n  // Function body\n  return result;\n};`;
        break;
      case 'class':
        code = `class ${functionName} {\n  constructor(${paramList}) {\n    // Constructor body\n  }\n\n  myMethod() {\n    // Method body\n  }\n}`;
        break;
      case 'promise':
        code = `const ${functionName} = new Promise((resolve, reject) => {\n  // Asynchronous operation\n  if (/* operation successful */) {\n    resolve(result);\n  } else {\n    reject(error);\n  }\n});`;
        break;
      case 'asyncFunction':
        code = `async function ${functionName}(${paramList}) {\n  try {\n    // Async operation\n    const result = await someAsyncOperation();\n    return result;\n  } catch (error) {\n    console.error(error);\n  }\n}`;
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
          <SelectItem value="asyncFunction">Async Function</SelectItem>
        </SelectContent>
      </Select>
      <div className="space-y-2">
        <Label htmlFor="functionName" className="text-sm font-medium text-white">Function/Class Name</Label>
        <Input
          id="functionName"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parameters" className="text-sm font-medium text-white">Parameters (comma-separated)</Label>
        <Input
          id="parameters"
          value={parameters.join(', ')}
          onChange={(e) => setParameters(e.target.value.split(',').map(p => p.trim()))}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
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