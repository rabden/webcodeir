import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormGenerator = () => {
  const [formFields, setFormFields] = useState([
    { type: 'text', label: 'Name', name: 'name' },
    { type: 'email', label: 'Email', name: 'email' },
  ]);

  const addField = () => {
    setFormFields([...formFields, { type: 'text', label: 'New Field', name: 'newField' }]);
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][key] = value;
    setFormFields(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const generateForm = () => {
    return `
<form>
${formFields.map(field => `  <div>
    <label for="${field.name}">${field.label}</label>
    <input type="${field.type}" id="${field.name}" name="${field.name}" required>
  </div>`).join('\n')}
  <button type="submit">Submit</button>
</form>
    `.trim();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Form Generator</h3>
      {formFields.map((field, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Select value={field.type} onValueChange={(value) => updateField(index, 'type', value)}>
            <SelectTrigger className="w-24 bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="password">Password</SelectItem>
              <SelectItem value="number">Number</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={field.label}
            onChange={(e) => updateField(index, 'label', e.target.value)}
            placeholder="Label"
            className="bg-gray-700 text-white border-gray-600"
          />
          <Input
            value={field.name}
            onChange={(e) => updateField(index, 'name', e.target.value)}
            placeholder="Name"
            className="bg-gray-700 text-white border-gray-600"
          />
          <Button onClick={() => removeField(index)} variant="destructive" size="icon">
            X
          </Button>
        </div>
      ))}
      <Button onClick={addField} className="bg-green-600 text-white hover:bg-green-700">
        Add Field
      </Button>
      <Button onClick={() => navigator.clipboard.writeText(generateForm())} className="bg-blue-600 text-white hover:bg-blue-700">
        Copy Form HTML
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto whitespace-pre-wrap">
        {generateForm()}
      </pre>
    </div>
  );
};

export default FormGenerator;