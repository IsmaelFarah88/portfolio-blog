'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSiteContent, updateSiteContent } from '@/lib/data';

export default function SiteContentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const localStorageAuth = localStorage.getItem('isAuthenticated') === 'true';
      const cookieAuth = document.cookie.split(';').some((item) => item.trim().startsWith('isAuthenticated=true'));
      
      if (!localStorageAuth && !cookieAuth) {
        router.push('/login');
        return false;
      }
      
      // Sync localStorage and cookie if they're out of sync
      if (localStorageAuth && !cookieAuth) {
        document.cookie = "isAuthenticated=true; path=/; max-age=3600";
      } else if (!localStorageAuth && cookieAuth) {
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return true;
    };
    
    const auth = checkAuth();
    if (auth) {
      setIsAuthenticated(true);
      loadContent();
    }
  }, [router]);

  const loadContent = async () => {
    try {
      const siteContent = await getSiteContent();
      setContent(siteContent);
    } catch (error) {
      console.error('Failed to load site content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (id: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateSiteContent(content);
      if (success) {
        alert('Site content updated successfully!');
      } else {
        alert('Failed to update site content. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update site content:', error);
      alert('An error occurred while updating site content. Please try again.');
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading site content...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 mb-12">
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
      </header>

      {/* Site Content Form */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Site Content</h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Header Content</h2>
          
          <div className="mb-6">
            <label htmlFor="header_title" className="block text-gray-700 dark:text-gray-300 mb-2">
              Site Title
            </label>
            <input
              type="text"
              id="header_title"
              value={content.header_title || ''}
              onChange={(e) => handleContentChange('header_title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter site title"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="header_home" className="block text-gray-700 dark:text-gray-300 mb-2">
                Home Link
              </label>
              <input
                type="text"
                id="header_home"
                value={content.header_home || ''}
                onChange={(e) => handleContentChange('header_home', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter home link text"
              />
            </div>
            
            <div>
              <label htmlFor="header_projects" className="block text-gray-700 dark:text-gray-300 mb-2">
                Projects Link
              </label>
              <input
                type="text"
                id="header_projects"
                value={content.header_projects || ''}
                onChange={(e) => handleContentChange('header_projects', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter projects link text"
              />
            </div>
            
            <div>
              <label htmlFor="header_blog" className="block text-gray-700 dark:text-gray-300 mb-2">
                Blog Link
              </label>
              <input
                type="text"
                id="header_blog"
                value={content.header_blog || ''}
                onChange={(e) => handleContentChange('header_blog', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter blog link text"
              />
            </div>
            
            <div>
              <label htmlFor="header_admin" className="block text-gray-700 dark:text-gray-300 mb-2">
                Admin Link
              </label>
              <input
                type="text"
                id="header_admin"
                value={content.header_admin || ''}
                onChange={(e) => handleContentChange('header_admin', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter admin link text"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Hero Section</h2>
          
          <div className="mb-6">
            <label htmlFor="hero_title" className="block text-gray-700 dark:text-gray-300 mb-2">
              Hero Title
            </label>
            <textarea
              id="hero_title"
              value={content.hero_title || ''}
              onChange={(e) => handleContentChange('hero_title', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter hero title (HTML allowed)"
            ></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              HTML is allowed. Use &lt;span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"&gt; for gradient text.
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="hero_subtitle" className="block text-gray-700 dark:text-gray-300 mb-2">
              Hero Subtitle
            </label>
            <textarea
              id="hero_subtitle"
              value={content.hero_subtitle || ''}
              onChange={(e) => handleContentChange('hero_subtitle', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter hero subtitle"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hero_button_1" className="block text-gray-700 dark:text-gray-300 mb-2">
                First Button Text
              </label>
              <input
                type="text"
                id="hero_button_1"
                value={content.hero_button_1 || ''}
                onChange={(e) => handleContentChange('hero_button_1', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter first button text"
              />
            </div>
            
            <div>
              <label htmlFor="hero_button_2" className="block text-gray-700 dark:text-gray-300 mb-2">
                Second Button Text
              </label>
              <input
                type="text"
                id="hero_button_2"
                value={content.hero_button_2 || ''}
                onChange={(e) => handleContentChange('hero_button_2', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter second button text"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Skills Section</h2>
          
          <div className="mb-6">
            <label htmlFor="skills_title" className="block text-gray-700 dark:text-gray-300 mb-2">
              Skills Section Title
            </label>
            <input
              type="text"
              id="skills_title"
              value={content.skills_title || ''}
              onChange={(e) => handleContentChange('skills_title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter skills section title"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="skills_list" className="block text-gray-700 dark:text-gray-300 mb-2">
              Skills List (JSON)
            </label>
            <textarea
              id="skills_list"
              value={content.skills_list || ''}
              onChange={(e) => handleContentChange('skills_list', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
              placeholder='Enter skills as JSON array, e.g., ["React", "Next.js", "TypeScript"]'
            ></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter as a valid JSON array of strings
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Footer Content</h2>
          
          <div className="mb-6">
            <label htmlFor="footer_copyright" className="block text-gray-700 dark:text-gray-300 mb-2">
              Copyright Text
            </label>
            <input
              type="text"
              id="footer_copyright"
              value={content.footer_copyright || ''}
              onChange={(e) => handleContentChange('footer_copyright', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter copyright text"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use {'{currentYear}'} to display the current year
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="footer_links" className="block text-gray-700 dark:text-gray-300 mb-2">
              Footer Links (JSON)
            </label>
            <textarea
              id="footer_links"
              value={content.footer_links || ''}
              onChange={(e) => handleContentChange('footer_links', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
              placeholder='Enter footer links as JSON array, e.g., ["Twitter", "GitHub", "LinkedIn"]'
            ></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter as a valid JSON array of strings
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact_email" className="block text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="contact_email"
                value={content.contact_email || ''}
                onChange={(e) => handleContentChange('contact_email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label htmlFor="contact_phone" className="block text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="contact_phone"
                value={content.contact_phone || ''}
                onChange={(e) => handleContentChange('contact_phone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label htmlFor="contact_location" className="block text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                id="contact_location"
                value={content.contact_location || ''}
                onChange={(e) => handleContentChange('contact_location', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter location"
              />
            </div>
            
            <div>
              <label htmlFor="personal_image" className="block text-gray-700 dark:text-gray-300 mb-2">
                Personal Image URL
              </label>
              <input
                type="text"
                id="personal_image"
                value={content.personal_image || ''}
                onChange={(e) => handleContentChange('personal_image', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter personal image URL"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Projects Page</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projects_title" className="block text-gray-700 dark:text-gray-300 mb-2">
                Projects Page Title
              </label>
              <input
                type="text"
                id="projects_title"
                value={content.projects_title || ''}
                onChange={(e) => handleContentChange('projects_title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter projects page title"
              />
            </div>
            
            <div>
              <label htmlFor="projects_subtitle" className="block text-gray-700 dark:text-gray-300 mb-2">
                Projects Page Subtitle
              </label>
              <input
                type="text"
                id="projects_subtitle"
                value={content.projects_subtitle || ''}
                onChange={(e) => handleContentChange('projects_subtitle', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter projects page subtitle"
              />
            </div>
            
            <div>
              <label htmlFor="projects_all_button" className="block text-gray-700 dark:text-gray-300 mb-2">
                "All Projects" Button Text
              </label>
              <input
                type="text"
                id="projects_all_button"
                value={content.projects_all_button || ''}
                onChange={(e) => handleContentChange('projects_all_button', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter 'All Projects' button text"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Blog Page</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="blog_title" className="block text-gray-700 dark:text-gray-300 mb-2">
                Blog Page Title
              </label>
              <input
                type="text"
                id="blog_title"
                value={content.blog_title || ''}
                onChange={(e) => handleContentChange('blog_title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter blog page title"
              />
            </div>
            
            <div>
              <label htmlFor="blog_subtitle" className="block text-gray-700 dark:text-gray-300 mb-2">
                Blog Page Subtitle
              </label>
              <input
                type="text"
                id="blog_subtitle"
                value={content.blog_subtitle || ''}
                onChange={(e) => handleContentChange('blog_subtitle', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter blog page subtitle"
              />
            </div>
            
            <div>
              <label htmlFor="blog_all_button" className="block text-gray-700 dark:text-gray-300 mb-2">
                "All Posts" Button Text
              </label>
              <input
                type="text"
                id="blog_all_button"
                value={content.blog_all_button || ''}
                onChange={(e) => handleContentChange('blog_all_button', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter 'All Posts' button text"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-3 rounded-lg transition-colors ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Ismael Farah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}