import React from 'react';
import { X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const Settings = ({ settings, setSettings, onClose }) => {
  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col md:inset-y-4 md:right-4 md:left-auto md:w-96 md:rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fontSize" className="text-sm font-medium text-white">Font Size</Label>
            <Input
              id="fontSize"
              type="number"
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              min="10"
              max="24"
              className="w-full bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave" className="text-sm font-medium text-white">Auto Save</Label>
            <Switch
              id="autoSave"
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleChange('autoSave', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tabSize" className="text-sm font-medium text-white">Tab Size</Label>
            <Input
              id="tabSize"
              type="number"
              value={settings.tabSize}
              onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
              min="2"
              max="8"
              className="w-full bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lineNumbers" className="text-sm font-medium text-white">Show Line Numbers</Label>
            <Switch
              id="lineNumbers"
              checked={settings.lineNumbers}
              onCheckedChange={(checked) => handleChange('lineNumbers', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="indentation" className="text-sm font-medium text-white">Indentation</Label>
            <Select value={settings.indentWithTabs ? 'tabs' : 'spaces'} onValueChange={(value) => handleChange('indentWithTabs', value === 'tabs')}>
              <SelectTrigger id="indentation" className="w-full bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select indentation" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="tabs">Tabs</SelectItem>
                <SelectItem value="spaces">Spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="highlightActiveLine" className="text-sm font-medium text-white">Highlight Active Line</Label>
            <Switch
              id="highlightActiveLine"
              checked={settings.highlightActiveLine}
              onCheckedChange={(checked) => handleChange('highlightActiveLine', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="matchBrackets" className="text-sm font-medium text-white">Match Brackets</Label>
            <Switch
              id="matchBrackets"
              checked={settings.matchBrackets}
              onCheckedChange={(checked) => handleChange('matchBrackets', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="layout" className="text-sm font-medium text-white">Layout</Label>
            <Select value={settings.layout} onValueChange={(value) => handleChange('layout', value)}>
              <SelectTrigger id="layout" className="w-full bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="stacked">Stacked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Settings;