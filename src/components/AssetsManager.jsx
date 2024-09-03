import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const popularAssets = [
  { name: 'Bootstrap CSS', type: 'link', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', enabled: false },
  { name: 'Bootstrap JS', type: 'script', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', enabled: false },
  { name: 'Font Awesome', type: 'link', url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', enabled: false },
  { name: 'jQuery', type: 'script', url: 'https://code.jquery.com/jquery-3.6.0.min.js', enabled: false },
  { name: 'Animate.css', type: 'link', url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', enabled: false },
];

const AssetsManager = ({ assets, setAssets }) => {
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
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-white">Assets Manager</h3>
      <div className="space-y-2">
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
  );
};

export default AssetsManager;