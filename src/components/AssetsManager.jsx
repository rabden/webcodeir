import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const AssetsManager = ({ assets, setAssets, onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Assets Manager</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div key={index} className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={asset.enabled}
                  onChange={() => toggleAsset(index)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span>{asset.name}</span>
              </label>
              <button onClick={() => removeAsset(index)} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={newAssetUrl}
            onChange={(e) => setNewAssetUrl(e.target.value)}
            placeholder="Enter asset URL"
            className="flex-grow px-2 py-1 bg-gray-700 text-white rounded"
          />
          <select
            value={newAssetType}
            onChange={(e) => setNewAssetType(e.target.value)}
            className="px-2 py-1 bg-gray-700 text-white rounded"
          >
            <option value="link">Link</option>
            <option value="script">Script</option>
          </select>
          <button onClick={addNewAsset} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetsManager;