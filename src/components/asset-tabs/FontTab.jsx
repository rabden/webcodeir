import React from 'react';

const FontTab = () => {
  const popularFonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald',
    'Source Sans Pro', 'Raleway', 'Nunito', 'Poppins', 'Playfair Display'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Popular Google Fonts</h3>
      <div className="grid grid-cols-2 gap-4">
        {popularFonts.map((font) => (
          <div key={font} className="bg-gray-800 p-4 rounded">
            <h4 className="text-lg font-semibold text-white mb-2">{font}</h4>
            <p className="text-gray-300" style={{ fontFamily: font }}>
              The quick brown fox jumps over the lazy dog.
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(`@import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap');`)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Copy Import
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontTab;