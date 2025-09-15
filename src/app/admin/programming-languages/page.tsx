'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProgrammingLanguage } from '@/lib/types';

export default function ProgrammingLanguagesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      loadLanguages();
    }
  }, [router]);

  const loadLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/programming-languages');
      
      if (response.ok) {
        const data = await response.json();
        setLanguages(data);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to load programming languages');
      }
    } catch (err) {
      console.error('Load error:', err);
      setError('An error occurred while loading programming languages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programming language?')) {
      return;
    }
    
    try {
      setDeletingId(id);
      const response = await fetch(`/api/programming-languages/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the deleted language from state
        setLanguages(languages.filter(lang => lang.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete programming language');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the programming language');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Programming Languages</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your programming languages and proficiency levels
              </p>
            </div>
            <Link 
              href="/admin/programming-languages/new"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Add New Language
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : languages.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No programming languages found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding a new programming language.</p>
              <Link 
                href="/admin/programming-languages/new"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Add Programming Language
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Language</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proficiency</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {languages.map((language) => (
                    <tr key={language.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center">
                          {language.icon_url && (
                            <Image src={language.icon_url} alt={language.name} width={24} height={24} className="mr-3" />
                          )}
                          {language.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                              style={{ width: `${language.proficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{language.proficiency}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/admin/programming-languages/${language.id}`}
                            className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(language.id)}
                            disabled={deletingId === language.id}
                            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm disabled:opacity-50"
                          >
                            {deletingId === language.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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