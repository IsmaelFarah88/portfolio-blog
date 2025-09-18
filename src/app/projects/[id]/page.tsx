'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getSiteContent } from '@/lib/data';
import { Project } from '@/lib/types';
import { motion } from 'framer-motion';
import Project3DVisualization from '@/components/Project3DVisualization';
import DOMPurify from 'dompurify';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        const [projectData, siteContentData] = await Promise.all([
          getProjectById(id),
          getSiteContent()
        ]);

        if (!projectData) {
          router.push('/projects');
          return;
        }

        setProject(projectData);
        setSiteContent(siteContentData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, router]);

  const copyrightText = siteContent.footer_copyright
    ? siteContent.footer_copyright.replace('{currentYear}', new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} Ismael Farah. All rights reserved.`;

  const footerLinks: { name: string, url: string }[] = siteContent.footer_links
    ? JSON.parse(siteContent.footer_links)
    : [];

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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Project Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/projects"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all glow inline-block"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            href="/projects"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Projects
          </Link>
        </motion.div>

        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 gradient-border overflow-hidden"
          >
            {project.imageUrl ? (
              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  fill
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h1>
                  <p className="text-indigo-200">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative h-64 md:h-80 w-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-end">
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h1>
                  <p className="text-indigo-200">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                  <div className="text-5xl font-bold bg-black/20 rounded-full w-24 h-24 flex items-center justify-center">
                    {project.title.charAt(0)}
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex flex-wrap gap-4">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center glow"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium rounded-lg hover:from-gray-900 hover:to-black transition-all shadow-md hover:shadow-lg flex items-center glow"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub Repository
                  </a>
                )}
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === 'overview'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('technologies')}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === 'technologies'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Technologies
                </button>
                <button
                  onClick={() => setActiveTab('visualization')}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === 'visualization'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  3D Visualization
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'overview' && (
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/2">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Project Description</h2>
                    <div
                      className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-8"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description) }}
                    />

                    <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-bold mb-3 text-indigo-800 dark:text-indigo-200">Project Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                          <p className="font-medium">{new Date(project.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Technologies</p>
                          <p className="font-medium">{project.technologies.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-1/2">
                    {project.imageUrl && (
                      <div className="rounded-xl overflow-hidden shadow-lg mb-8">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-auto"
                          width={600}
                          height={400}
                          unoptimized
                        />
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">Quick Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Live Demo
                          </a>
                        ) : (
                          <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            No Demo Available
                          </span>
                        )}
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0018 12.017C18 6.484 13.522 2 8 2z" clipRule="evenodd" />
                            </svg>
                            GitHub Repo
                          </a>
                        ) : (
                          <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0018 12.017C18 6.484 13.522 2 8 2z" clipRule="evenodd" />
                            </svg>
                            No GitHub Repo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technologies' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Technologies Used</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {project.technologies.map((tech: string, index: number) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                          <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{tech}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Technology</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'visualization' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Interactive 3D Visualization</h2>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
                    <div className="h-96 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                      <Project3DVisualization technologies={project.technologies} />
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
                      Interactive 3D visualization of project technologies. Drag to rotate, scroll to zoom.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
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
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
