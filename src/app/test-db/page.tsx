'use client';

import { useEffect, useState } from 'react';

export default function TestDBPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/test-db');
        const data = await response.json();
        setTables(data.tables);
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Tables</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div 
                key={table} 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h2 className="font-semibold text-lg">{table}</h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}