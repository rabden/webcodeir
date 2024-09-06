import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EventListenerHelper = () => {
  const [eventType, setEventType] = useState('click');
  const [elementSelector, setElementSelector] = useState('');
  const [listenerCode, setListenerCode] = useState('');

  const generateListener = () => {
    const code = `
document.querySelector('${elementSelector}').addEventListener('${eventType}', (event) => {
  // Your event handling code here
  console.log('${eventType} event triggered on', event.target);
});`.trim();
    setListenerCode(code);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Event Listener Helper</h3>
      <Select value={eventType} onValueChange={setEventType}>
        <SelectTrigger className="bg-gray-700 text-white border-gray-600">
          <SelectValue placeholder="Select Event Type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600">
          <SelectItem value="click">Click</SelectItem>
          <SelectItem value="submit">Submit</SelectItem>
          <SelectItem value="change">Change</SelectItem>
          <SelectItem value="keyup">Keyup</SelectItem>
          <SelectItem value="mouseover">Mouseover</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={elementSelector}
        onChange={(e) => setElementSelector(e.target.value)}
        placeholder="Enter element selector (e.g., #myButton)"
        className="bg-gray-700 text-white border-gray-600"
      />
      <Button onClick={generateListener} className="bg-blue-600 text-white hover:bg-blue-700">
        Generate Event Listener
      </Button>
      <Textarea
        value={listenerCode}
        readOnly
        className="h-32 font-mono bg-gray-800 text-white border-gray-700"
        placeholder="Generated event listener code will appear here"
      />
      <Button onClick={() => navigator.clipboard.writeText(listenerCode)} className="bg-green-600 text-white hover:bg-green-700">
        Copy Code
      </Button>
    </div>
  );
};

export default EventListenerHelper;