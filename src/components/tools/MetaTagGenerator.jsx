import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MetaTagGenerator = () => {
  const [metaTags, setMetaTags] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    viewport: 'width=device-width, initial-scale=1.0',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetaTags({ ...metaTags, [name]: value });
  };

  const generateMetaTags = () => {
    let tags = '';
    if (metaTags.title) tags += `<title>${metaTags.title}</title>\n`;
    if (metaTags.description) tags += `<meta name="description" content="${metaTags.description}">\n`;
    if (metaTags.keywords) tags += `<meta name="keywords" content="${metaTags.keywords}">\n`;
    if (metaTags.author) tags += `<meta name="author" content="${metaTags.author}">\n`;
    if (metaTags.viewport) tags += `<meta name="viewport" content="${metaTags.viewport}">\n`;
    if (metaTags.ogTitle) tags += `<meta property="og:title" content="${metaTags.ogTitle}">\n`;
    if (metaTags.ogDescription) tags += `<meta property="og:description" content="${metaTags.ogDescription}">\n`;
    if (metaTags.ogImage) tags += `<meta property="og:image" content="${metaTags.ogImage}">\n`;
    return tags.trim();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Meta Tag Generator</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Title</label>
        <Input
          name="title"
          value={metaTags.title}
          onChange={handleChange}
          placeholder="Page Title"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Description</label>
        <Textarea
          name="description"
          value={metaTags.description}
          onChange={handleChange}
          placeholder="Page Description"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Keywords</label>
        <Input
          name="keywords"
          value={metaTags.keywords}
          onChange={handleChange}
          placeholder="keyword1, keyword2, keyword3"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Author</label>
        <Input
          name="author"
          value={metaTags.author}
          onChange={handleChange}
          placeholder="Author Name"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Viewport</label>
        <Input
          name="viewport"
          value={metaTags.viewport}
          onChange={handleChange}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">OG Title</label>
        <Input
          name="ogTitle"
          value={metaTags.ogTitle}
          onChange={handleChange}
          placeholder="Open Graph Title"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">OG Description</label>
        <Textarea
          name="ogDescription"
          value={metaTags.ogDescription}
          onChange={handleChange}
          placeholder="Open Graph Description"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">OG Image URL</label>
        <Input
          name="ogImage"
          value={metaTags.ogImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <Button onClick={() => navigator.clipboard.writeText(generateMetaTags())} className="bg-blue-600 text-white hover:bg-blue-700">
        Copy Meta Tags
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto whitespace-pre-wrap">
        {generateMetaTags()}
      </pre>
    </div>
  );
};

export default MetaTagGenerator;