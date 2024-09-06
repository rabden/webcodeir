import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FetchApiHelper = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [fetchCode, setFetchCode] = useState('');

  const generateFetchCode = () => {
    let code = `
fetch('${url}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
  },${method !== 'GET' ? `\n  body: JSON.stringify({\n    // Your request body here\n  }),` : ''}
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });`.trim();
    setFetchCode(code);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Fetch API Helper</h3>
      <Select value={method} onValueChange={setMethod}>
        <SelectTrigger className="bg-gray-700 text-white border-gray-600">
          <SelectValue placeholder="Select HTTP Method" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600">
          <SelectItem value="GET">GET</SelectItem>
          <SelectItem value="POST">POST</SelectItem>
          <SelectItem value="PUT">PUT</SelectItem>
          <SelectItem value="DELETE">DELETE</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL"
        className="bg-gray-700 text-white border-gray-600"
      />
      <Button onClick={generateFetchCode} className="bg-blue-600 text-white hover:bg-blue-700">
        Generate Fetch Code
      </Button>
      <Textarea
        value={fetchCode}
        readOnly
        className="h-48 font-mono bg-gray-800 text-white border-gray-700"
        placeholder="Generated fetch code will appear here"
      />
      <Button onClick={() => navigator.clipboard.writeText(fetchCode)} className="bg-green-600 text-white hover:bg-green-700">
        Copy Code
      </Button>
    </div>
  );
};

export default FetchApiHelper;