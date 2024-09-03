import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const IconTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState([]);

  const searchIcons = async () => {
    // For this example, we'll use a mock array of icons
    const mockIcons = Array.from({ length: 60 }, (_, i) => ({
      name: `icon-${i + 1}`,
      svg: `<svg viewBox="0 0 24 24" width="24" height="24"><rect width="24" height="24" fill="white"/></svg>`
    }));
    setIcons(mockIcons);
  };

  useEffect(() => {
    searchIcons();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white">Icons from <span className="text-blue-400">Font Awesome</span>. Click to copy an inline &lt;svg&gt;</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
          className="flex-grow px-4 py-2 rounded bg-[#3a3a3a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchIcons}
          className="px-4 py-2 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a] transition-colors"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {icons.map((icon) => (
          <div
            key={icon.name}
            className="bg-[#3a3a3a] p-2 rounded cursor-pointer hover:bg-[#4a4a4a] transition-colors"
            onClick={() => navigator.clipboard.writeText(icon.svg)}
          >
            <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconTab;