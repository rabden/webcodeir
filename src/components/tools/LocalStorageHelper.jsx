import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const LocalStorageHelper = () => {
  const [operation, setOperation] = useState('set');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');

  const generateCode = () => {
    let generatedCode = '';
    switch (operation) {
      case 'set':
        generatedCode = `localStorage.setItem('${key}', '${value}');`;
        break;
      case 'get':
        generatedCode = `const value = localStorage.getItem('${key}');`;
        break;
      case 'remove':
        generatedCode = `localStorage.removeItem('${key}');`;
        break;
      case 'clear':
        generatedCode = `localStorage.clear();`;
        break;
      default:
        generatedCode = '// Select an operation';
    }
    setCode(generatedCode);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Local Storage Helper</h3>
      <Select value={operation} onValueChange={setOperation}>
        <SelectTrigger className="bg-gray-700 text-white border-gray-600">
          <SelectValue placeholder="Select Operation" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600">
          <SelectItem value="set">Set Item</SelectItem>
          <SelectItem value="get">Get Item</SelectItem>
          <SelectItem value="remove">Remove Item</SelectItem>
          <SelectItem value="clear">Clear All</SelectItem>
        </SelectContent>
      </Select>
      {operation !== 'clear' && (
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter key"
          className="bg-gray-700 text-white border-gray-600"
        />
      )}
      {operation === 'set' && (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="bg-gray-700 text-white border-gray-600"
        />
      )}
      <Button onClick={generateCode} className="bg-blue-600 text-white hover:bg-blue-700">
        Generate Code
      </Button>
      <Textarea
        value={code}
        readOnly
        className="h-24 font-mono bg-gray-800 text-white border-gray-700"
        placeholder="Generated code will appear here"
      />
      <Button onClick={() => navigator.clipboard.writeText(code)} className="bg-green-600 text-white hover:bg-green-700">
        Copy Code
      </Button>
    </div>
  );
};

export default LocalStorageHelper;