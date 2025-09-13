'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProgrammingLanguage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 50,
    icon_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      
      return true;
    };
    
    const auth = checkAuth();
    if (auth) {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/programming-languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/admin/programming-languages');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create programming language');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An error occurred while creating the programming language');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</p>
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
              <Link href="/admin/programming-languages" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Back to Languages
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('isAuthenticated');
                  document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  router.push('/login');
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Add New Programming Language</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add a new programming language to your portfolio
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Language Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="e.g., JavaScript, Python, Java"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="icon_url" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Icon URL (Optional)
                  </label>
                  <input
                    type="text"
                    id="icon_url"
                    name="icon_url"
                    value={formData.icon_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="e.g., /icons/javascript.svg"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="proficiency" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Proficiency: {formData.proficiency}%
                  </label>
                  <input
                    type="range"
                    id="proficiency"
                    name="proficiency"
                    min="1"
                    max="100"
                    value={formData.proficiency}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Link 
                  href="/admin/programming-languages"
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Language'}
                </button>
              </div>
            </form>
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