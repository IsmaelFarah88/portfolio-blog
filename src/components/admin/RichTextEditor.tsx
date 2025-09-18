'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  initialValue?: string;
  onEditorChange: (content: string) => void;
}

export default function RichTextEditor({ initialValue, onEditorChange }: RichTextEditorProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <Editor
      apiKey="ohlz8gpap02w1tf1sx5mrlnzgmyl4qzbnh1di752vw2qd792"
      initialValue={initialValue || '<p>اكتب المحتوى هنا...</p>'}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help | ltr rtl',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        skin: isDarkMode ? 'oxide-dark' : 'oxide',
        content_css: isDarkMode ? 'dark' : 'default',
        directionality: 'rtl', // Default to RTL for Arabic
        images_upload_handler: (blobInfo, _progress) => new Promise((resolve, reject) => {
          // This is a placeholder for image uploads.
          // For a real application, you would upload the blobInfo.blob() to a server and resolve with the URL.
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            // In a real app, you'd post this to a server.
            // For now, we'll just use a base64 data URL as a placeholder.
            resolve(`data:${blobInfo.blob().type};base64,${base64}`);
          };
          reader.onerror = error => reject(error);
          reader.readAsDataURL(blobInfo.blob());
        }),
      }}
      onEditorChange={(content, _editor) => {
        onEditorChange(content);
      }}
    />
  );
}
