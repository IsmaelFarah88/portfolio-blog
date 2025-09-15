'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getBlogPosts, getCertifications, getSkills } from '@/lib/data';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projectsCount, setProjectsCount] = useState(0);
  const [blogPostsCount, setBlogPostsCount] = useState(0);
  const [certificationsCount, setCertificationsCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);
  const [loading, setLoading] = useState(true);
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
      loadData();
    }
  }, [router]);

  const loadData = async () => {
    try {
      const [projectsData, blogPostsData, certificationsData, skillsData] = await Promise.all([
        getProjects(),
        getBlogPosts(),
        getCertifications(),
        getSkills()
      ]);
      
      setProjectsCount(projectsData.length);
      setBlogPostsCount(blogPostsData.length);
      setCertificationsCount(certificationsData.length);
      setSkillsCount(skillsData.length);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    // Also remove the cookie
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading dashboard...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gradient">
              DevPortfolio
            </Link>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-gray-700 dark:text-gray-300">
                Admin Dashboard
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all aspects of your portfolio website
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 gradient-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Projects</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {loading ? '...' : projectsCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 gradient-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Blog Posts</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {loading ? '...' : blogPostsCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 gradient-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Certifications</h3>
                <p className="text-3xl font-bold text-cyan-600">
                  {loading ? '...' : certificationsCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 gradient-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Skills</h3>
                <p className="text-3xl font-bold text-amber-600">
                  {loading ? '...' : skillsCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Content Management */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 gradient-border">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Content Management</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Projects</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href="/admin/projects"
                    className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                  >
                    View
                  </Link>
                  <Link 
                    href="/admin/projects/new"
                    className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
                  >
                    Add
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Blog Posts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your blog content</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href="/admin/blog"
                    className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                  >
                    View
                  </Link>
                  <Link 
                    href="/admin/blog/new"
                    className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
                  >
                    Add
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Certifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your professional credentials</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href="/admin/certifications"
                    className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                  >
                    View
                  </Link>
                  <Link 
                    href="/admin/certifications/new"
                    className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
                  >
                    Add
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Skills</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your technical skills</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href="/admin/skills"
                    className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                  >
                    View
                  </Link>
                  <Link 
                    href="/admin/skills/new"
                    className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
                  >
                    Add
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Programming Languages</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your programming languages</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href="/admin/programming-languages"
                    className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                  >
                    View
                  </Link>
                  <Link 
                    href="/admin/programming-languages/new"
                    className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
                  >
                    Add
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Site Configuration */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 gradient-border">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Site Configuration</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Site Content</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Edit all text content on your site</p>
                </div>
                <Link 
                  href="/admin/site-content"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm"
                >
                  Edit
                </Link>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Appearance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customize site design and layout</p>
                </div>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-not-allowed text-sm">
                  Coming Soon
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">SEO Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Optimize for search engines</p>
                </div>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-not-allowed text-sm">
                  Coming Soon
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track site performance and visitors</p>
                </div>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-not-allowed text-sm">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 gradient-border">
          <h2 className="text-2xl font-bold mb-6 text-gradient">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/admin/projects/new"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-800/30 dark:hover:to-indigo-700/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-center">New Project</span>
            </Link>
            
            <Link 
              href="/admin/blog/new"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="font-medium text-center">New Blog Post</span>
            </Link>
            
            <Link 
              href="/admin/certifications/new"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-xl hover:from-cyan-100 hover:to-cyan-200 dark:hover:from-cyan-800/30 dark:hover:to-cyan-700/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-medium text-center">New Certification</span>
            </Link>
            
            <Link 
              href="/admin/skills/new"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-800/30 dark:hover:to-amber-700/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-medium text-center">New Skill</span>
            </Link>
            
            <Link 
              href="/admin/programming-languages/new"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="font-medium text-center">New Language</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-12 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Ismael Farah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}