'use client';

import { useState, useEffect } from 'react';

type FooterLink = {
  name: string;
  url: string;
};

interface FooterLinksEditorProps {
  value: string; // The JSON string from the database
  onChange: (value: string) => void; // Callback to update the parent component's state
}

export default function FooterLinksEditor({ value, onChange }: FooterLinksEditorProps) {
  const [links, setLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    try {
      const parsedLinks = JSON.parse(value);
      if (Array.isArray(parsedLinks)) {
        setLinks(parsedLinks);
      }
    } catch (error) {
      console.error("Failed to parse footer links:", error);
      setLinks([]);
    }
  }, [value]);

  const handleLinkChange = (index: number, field: 'name' | 'url', fieldValue: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: fieldValue };
    setLinks(newLinks);
    onChange(JSON.stringify(newLinks));
  };

  const addLink = () => {
    const newLinks = [...links, { name: '', url: '' }];
    setLinks(newLinks);
    onChange(JSON.stringify(newLinks));
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    onChange(JSON.stringify(newLinks));
  };

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            <input
              type="text"
              value={link.name}
              onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
              placeholder="Link Name (e.g. GitHub)"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              placeholder="URL (e.g. https://github.com/user)"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <button
            type="button"
            onClick={() => removeLink(index)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex-shrink-0"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addLink}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        + Add Link
      </button>
    </div>
  );
}
