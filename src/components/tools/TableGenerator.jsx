import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TableGenerator = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [includeHeader, setIncludeHeader] = useState(true);

  const generateTable = () => {
    let tableHtml = '<table border="1">\n';
    
    if (includeHeader) {
      tableHtml += '  <thead>\n    <tr>\n';
      for (let i = 0; i < columns; i++) {
        tableHtml += `      <th>Header ${i + 1}</th>\n`;
      }
      tableHtml += '    </tr>\n  </thead>\n';
    }
    
    tableHtml += '  <tbody>\n';
    for (let i = 0; i < rows; i++) {
      tableHtml += '    <tr>\n';
      for (let j = 0; j < columns; j++) {
        tableHtml += `      <td>Row ${i + 1}, Col ${j + 1}</td>\n`;
      }
      tableHtml += '    </tr>\n';
    }
    tableHtml += '  </tbody>\n</table>';
    
    return tableHtml;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Table Generator</h3>
      <div className="flex items-center space-x-4">
        <div>
          <label className="text-sm font-medium text-white">Rows</label>
          <Input
            type="number"
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value)))}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-white">Columns</label>
          <Input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value)))}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="includeHeader"
          checked={includeHeader}
          onChange={(e) => setIncludeHeader(e.target.checked)}
          className="bg-gray-700 border-gray-600"
        />
        <label htmlFor="includeHeader" className="text-sm font-medium text-white">Include Header</label>
      </div>
      <Button onClick={() => navigator.clipboard.writeText(generateTable())} className="bg-blue-600 text-white hover:bg-blue-700">
        Copy Table HTML
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto whitespace-pre-wrap">
        {generateTable()}
      </pre>
    </div>
  );
};

export default TableGenerator;