'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, getSiteContent } from '@/lib/data';
import { Project } from '@/lib/types';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [sortOption, setSortOption] = useState('date-desc');
  
  useEffect(() => {
    const fetchSiteContent = async () => {
      try {
        const content = await getSiteContent();
        setSiteContent(content);
      } catch (error) {
        console.error('Failed to fetch site content:', error);
      }
    };
    
    fetchSiteContent();
    
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    return Array.from(
      new Set(projects.flatMap(project => project.technologies))
    );
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }
    
    // Apply technology filter
    if (filter !== 'all') {
      result = result.filter(project => project.technologies.includes(filter));
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-desc':
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }
    
    return result;
  }, [projects, filter, searchQuery, sortOption]);

  // Replace {currentYear} with actual year
  const copyrightText = siteContent.footer_copyright 
    ? siteContent.footer_copyright.replace('{currentYear}', new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} Ismael Farah. All rights reserved.`;

  // Parse footer links from JSON
  const footerLinks = siteContent.footer_links 
    ? JSON.parse(siteContent.footer_links) 
    : ['Twitter', 'GitHub', 'LinkedIn'];

  // Calculate project statistics
  const projectStats = useMemo(() => {
    return {
      total: projects.length,
      withDemo: projects.filter(p => p.demoUrl).length,
      withGitHub: projects.filter(p => p.githubUrl).length,
      technologies: allTechnologies.length
    };
  }, [projects, allTechnologies]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading projects...</p>
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
              {siteContent.header_title || 'DevPortfolio'}
            </Link>
            <nav className="hidden md:flex space-x-1">
              <Link href="/" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Home</Link>
              <Link href="/projects" className="px-4 py-2 rounded-lg font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30">Projects</Link>
              <Link href="/blog" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Blog</Link>
              <Link href="/certifications" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Certifications</Link>
              <Link href="/skills" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Skills</Link>
              <Link href="/programming-languages" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Languages</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Projects Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{siteContent.projects_title || 'My Projects'}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            {siteContent.projects_subtitle || 'A collection of my web development projects and applications.'}
          </p>
          
          {/* Project Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{projectStats.total}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Projects</div>
            </motion.div>
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{projectStats.withDemo}</div>
              <div className="text-gray-600 dark:text-gray-400">Live Demos</div>
            </motion.div>
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{projectStats.withGitHub}</div>
              <div className="text-gray-600 dark:text-gray-400">Open Source</div>
            </motion.div>
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{projectStats.technologies}</div>
              <div className="text-gray-600 dark:text-gray-400">Technologies</div>
            </motion.div>
          </div>
        </motion.section>

        {/* Search and Filter Controls */}
        <motion.div 
          className="mb-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search projects by title, description, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Sort Select */}
            <div className="w-full md:w-48">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>
          
          {/* Technology Filter */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm flex items-center ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg glow'
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {siteContent.projects_all_button || 'All Projects'}
              {filter === 'all' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {allTechnologies.map((tech, index) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`px-4 py-2 rounded-full font-medium transition-all text-sm flex items-center ${
                  filter === tech
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg glow'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {tech}
                {filter === tech && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div 
          className="mb-6 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedProjects.length} of {projects.length} projects
          </p>
          {(filter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm"
            >
              Clear all filters
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>

        {/* Projects Grid */}
        {filteredAndSortedProjects.length === 0 ? (
          <motion.div 
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No projects match your search for "${searchQuery}". Try different keywords.` 
                : 'There are no projects matching the selected filter.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all glow"
              >
                View All Projects
              </button>
              <Link 
                href="/"
                className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 gradient-border flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                {project.imageUrl ? (
                  <div className="h-48 relative">
                    <Image 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                      width={400}
                      height={192}
                      unoptimized
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {project.demoUrl && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                          Demo
                        </span>
                      )}
                      {project.githubUrl && (
                        <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded-full">
                          GitHub
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative flex items-center justify-center">
                    <div className="text-4xl font-bold text-white bg-black/20 rounded-full w-16 h-16 flex items-center justify-center">
                      {project.title.charAt(0)}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {project.demoUrl && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                          Demo
                        </span>
                      )}
                      {project.githubUrl && (
                        <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded-full">
                          GitHub
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{project.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(project.date).toLocaleDateString()}
                    </span>
                    <Link 
                      href={`/projects/${project.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all glow"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-gradient mb-2">
                {siteContent.header_title || 'DevPortfolio'}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {copyrightText}
              </p>
            </div>
            <div className="flex space-x-6">
              {footerLinks.map((link: string, index: number) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}