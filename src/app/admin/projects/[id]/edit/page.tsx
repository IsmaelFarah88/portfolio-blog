'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjectById, updateProject } from '@/lib/data';

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const loadProject = useCallback(async () => {
    try {
      // Unwrap the params promise
      const { id } = await params;
      const project = await getProjectById(id);
      if (project) {
        setTitle(project.title);
        setDescription(project.description);
        setTechnologies(project.technologies.join(', '));
        setImageUrl(project.imageUrl || '');
        setDemoUrl(project.demoUrl || '');
        setGithubUrl(project.githubUrl || '');
        setDate(project.date);
      } else {
        // Project not found
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      router.push('/admin/projects');
    } finally {
      setLoading(false);
    }
  }, [params, router]);

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (!auth) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      loadProject();
    }
  }, [router, loadProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Unwrap the params promise
      const { id } = await params;
      const technologiesArray = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
      
      const success = await updateProject(id, {
        title,
        description,
        technologies: technologiesArray,
        imageUrl: imageUrl || undefined,
        demoUrl: demoUrl || undefined,
        githubUrl: githubUrl || undefined,
        date
      });
      
      if (success) {
        alert('Project updated successfully!');
        router.push('/admin/projects');
      } else {
        alert('Failed to update project. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('An error occurred while updating the project. Please try again.');
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading project...</p>
        </div>
      </div>
    );
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
              <Link href="/admin" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Project Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/admin/projects" 
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Projects
            </Link>
            <h1 className="text-3xl font-bold">Edit Project</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Update your project details
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 gradient-border">
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Enter project description"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="technologies" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Technologies
              </label>
              <input
                type="text"
                id="technologies"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Enter technologies (comma separated)"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separate technologies with commas (e.g., React, Node.js, MongoDB)
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="imageUrl" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="demoUrl" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Demo URL (Optional)
                </label>
                <input
                  type="url"
                  id="demoUrl"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter demo URL"
                />
              </div>
              
              <div>
                <label htmlFor="githubUrl" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  GitHub URL (Optional)
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter GitHub URL"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="date" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Link 
                href="/admin/projects"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-center font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center ${
                  saving 
                    ? 'bg-indigo-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {saving ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Update Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Ismael Farah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}