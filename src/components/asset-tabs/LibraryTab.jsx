import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const LibraryTab = ({ assets, setAssets }) => {
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetType, setNewAssetType] = useState('link');

  const toggleAsset = (index) => {
    const updatedAssets = [...assets];
    updatedAssets[index].enabled = !updatedAssets[index].enabled;
    setAssets(updatedAssets);
  };

  const addNewAsset = () => {
    if (newAssetUrl) {
      setAssets([...assets, { name: newAssetUrl, type: newAssetType, url: newAssetUrl, enabled: true }]);
      setNewAssetUrl('');
    }
  };

  const removeAsset = (index) => {
    const updatedAssets = assets.filter((_, i) => i !== index);
    setAssets(updatedAssets);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {assets.map((asset, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={asset.enabled}
                onChange={() => toggleAsset(index)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span>{asset.name}</span>
            </label>
            <button onClick={() => removeAsset(index)} className="text-red-500 hover:text-red-700">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newAssetUrl}
          onChange={(e) => setNewAssetUrl(e.target.value)}
          placeholder="Enter asset URL"
          className="flex-grow px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newAssetType}
          onChange={(e) => setNewAssetType(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="link">Link</option>
          <option value="script">Script</option>
        </select>
        <button onClick={addNewAsset} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default LibraryTab;