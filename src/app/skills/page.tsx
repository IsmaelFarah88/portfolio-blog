'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSkills, getSiteContent } from '@/lib/data';
import { Skill } from '@/lib/types';
import { motion } from 'framer-motion';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, siteContentData] = await Promise.all([
          getSkills(),
          getSiteContent()
        ]);
        setSkills(skillsData);
        setSiteContent(siteContentData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {};
  skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });

  // Replace {currentYear} with actual year
  const copyrightText = siteContent.footer_copyright 
    ? siteContent.footer_copyright.replace('{currentYear}', new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} Ismael Farah. All rights reserved.`;

  // Parse footer links from JSON
  const footerLinks = siteContent.footer_links 
    ? JSON.parse(siteContent.footer_links) 
    : ['Twitter', 'GitHub', 'LinkedIn'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading skills...</p>
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
              <Link href="/blog" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Blog</Link>
              <Link href="/certifications" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Certifications</Link>
              <Link href="/skills" className="px-4 py-2 rounded-lg font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30">Skills</Link>
              <Link href="/programming-languages" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Languages</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Skills Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{siteContent.skills_page_title || 'My Skills'}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {siteContent.skills_page_subtitle || 'Technical skills and proficiency levels.'}
          </p>
        </motion.section>

        {/* Skills by Category */}
        <div className="space-y-16 max-w-6xl mx-auto">
          {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * categoryIndex }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-gradient">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill, skillIndex) => {
                  // Determine proficiency level
                  let proficiencyLevel = '';
                  let proficiencyColor = '';
                  if (skill.proficiency >= 90) {
                    proficiencyLevel = 'Expert';
                    proficiencyColor = 'from-green-500 to-emerald-500';
                  } else if (skill.proficiency >= 70) {
                    proficiencyLevel = 'Advanced';
                    proficiencyColor = 'from-blue-500 to-cyan-500';
                  } else if (skill.proficiency >= 50) {
                    proficiencyLevel = 'Intermediate';
                    proficiencyColor = 'from-yellow-500 to-amber-500';
                  } else {
                    proficiencyLevel = 'Beginner';
                    proficiencyColor = 'from-red-500 to-orange-500';
                  }

                  return (
                    <motion.div
                      key={skill.id}
                      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 gradient-border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * skillIndex }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{skill.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${proficiencyColor} text-white glow`}>
                          {proficiencyLevel}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Proficiency</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <motion.div 
                            className={`bg-gradient-to-r ${proficiencyColor} h-3 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: 0.5 + 0.05 * skillIndex }}
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Category: {skill.category}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
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