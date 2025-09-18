'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBlogPost } from '@/lib/data';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewBlogPost() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (!auth) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const success = await createBlogPost({
        title,
        excerpt,
        content,
        tags: tagsArray,
        imageUrl: imageUrl || undefined,
        linkUrl: linkUrl || undefined,
        date
      });
      
      if (success) {
        alert('Blog post created successfully!');
        router.push('/admin/blog');
      } else {
        alert('Failed to create blog post. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create blog post:', error);
      alert('An error occurred while creating the blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    // Also remove the cookie
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="py-6 mb-12 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DevPortfolio
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Blog Post Form */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Blog Post</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a new blog post with all the details</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Publication Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Excerpt
            </label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter a short excerpt for the post"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This will be displayed in the blog listing
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Content
            </label>
            <RichTextEditor
              initialValue="<p>اكتب محتوى المقال هنا...</p>"
              onEditorChange={(newContent) => setContent(newContent)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="tags" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="React, JavaScript, Tutorial"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separate tags with commas
              </p>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Featured Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="linkUrl" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              External Link URL (Optional)
            </label>
            <input
              type="url"
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="https://example.com/full-article"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a link to the full article if this is just a summary
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/admin/blog"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-lg transition-colors ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="py-10 mt-20 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Ismael Farah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}