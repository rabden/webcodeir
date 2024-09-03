import React from 'react';
import { ChevronDown } from 'lucide-react';

const FontTab = () => {
  const popularFonts = [
    'Lato', 'Open Sans', 'Roboto', 'Merriweather', 'Montserrat', 'Raleway'
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white">Some popular fonts from <span className="text-blue-400">Google Fonts</span>.</h2>
      <div className="space-y-2">
        {popularFonts.map((font) => (
          <div key={font} className="bg-[#2d2d2d] p-4 rounded">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: font }}>{font}</h3>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-300 mt-2" style={{ fontFamily: font }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontTab;