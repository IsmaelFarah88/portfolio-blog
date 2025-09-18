'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getSiteContent } from '@/lib/data';
import { BlogPost } from '@/lib/types';
import { motion } from 'framer-motion';

export default function BlogPage() {
  const [filter, setFilter] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  
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
    
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogPosts();
        setBlogPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(blogPosts.flatMap(post => post.tags))
  );

  // Filter posts based on selected tag
  const filteredPosts = filter === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.tags.includes(filter));

  // Replace {currentYear} with actual year
  const copyrightText = siteContent.footer_copyright 
    ? siteContent.footer_copyright.replace('{currentYear}', new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} Ismael Farah. All rights reserved.`;

  // Parse footer links from JSON
  const footerLinks: { name: string, url: string }[] = siteContent.footer_links
    ? JSON.parse(siteContent.footer_links) 
    : [];

  // Calculate reading time (approx. 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading blog posts...</p>
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
              <Link href="/projects" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Projects</Link>
              <Link href="/blog" className="px-4 py-2 rounded-lg font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30">Blog</Link>
              <Link href="/certifications" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Certifications</Link>
              <Link href="/skills" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Skills</Link>
              <Link href="/programming-languages" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Languages</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Blog Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{siteContent.blog_title || 'My Blog'}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {siteContent.blog_subtitle || 'Thoughts, tutorials, and insights on web development and technology.'}
          </p>
        </motion.section>

        {/* Filter */}
        <motion.div 
          className="mb-12 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg glow'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {siteContent.blog_all_button || 'All Posts'}
          </button>
          {allTags.map((tag, index) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                filter === tag
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg glow'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Blog Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 gradient-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              {post.imageUrl ? (
                <div className="h-48 relative">
                  <Image 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                    fill
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white bg-black/20 rounded-full w-16 h-16 flex items-center justify-center">
                      {post.title.charAt(0)}
                    </div>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>{calculateReadingTime(post.content)} min read</span>
                </div>
                <motion.h3 
                  className="text-xl font-bold mb-3"
                  whileHover={{ color: "#8b5cf6" }}
                >
                  {post.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
                  whileHover={{ color: "#a78bfa" }}
                >
                  {post.excerpt}
                </motion.p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-sm rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * tagIndex }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
                <motion.div 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all glow"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={`/blog/${post.id}`}
                    className="flex items-center"
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
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
              {footerLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all transform hover:-translate-y-1"
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