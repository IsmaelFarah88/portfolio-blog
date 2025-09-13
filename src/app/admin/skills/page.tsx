'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSkills } from '@/lib/data';

export default function SkillsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
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
      
      return true;
    };
    
    const auth = checkAuth();
    if (auth) {
      setIsAuthenticated(true);
      loadSkills();
    }
  }, [router]);

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove from local state
        setSkills(skills.filter(skill => skill.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete skill');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete skill');
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
              <Link href="/admin" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Back to Dashboard
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Skills</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your technical skills and proficiencies
            </p>
          </div>
          <Link 
            href="/admin/skills/new"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Add New Skill
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Skill Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Proficiency
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {skills.map((skill) => (
                    <tr key={skill.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{skill.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                          {skill.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                              style={{ width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{skill.proficiency}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/admin/skills/${skill.id}`}
                            className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            disabled={deletingId === skill.id}
                            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm disabled:opacity-50"
                          >
                            {deletingId === skill.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {skills.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No skills</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding a new skill.</p>
                <Link 
                  href="/admin/skills/new"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Add Skill
                </Link>
              </div>
            )}
          </div>
        )}
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