'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSiteContent, getSkills, getCertifications, getProjects } from '@/lib/data';
import { Skill, Certification, Project } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, skillsData, certificationsData, projectsData] = await Promise.all([
          getSiteContent(),
          getSkills(),
          getCertifications(),
          getProjects()
        ]);
        setSiteContent(content);
        setSkills(skillsData);
        setCertifications(certificationsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Parse skills list from JSON
  const skillsList = siteContent.skills_list 
    ? JSON.parse(siteContent.skills_list) 
    : ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB', 'GraphQL', 'Docker'];

  // Parse footer links from JSON
  const footerLinks = siteContent.footer_links 
    ? JSON.parse(siteContent.footer_links) 
    : ['Twitter', 'GitHub', 'LinkedIn'];

  // Replace {currentYear} with actual year
  const copyrightText = siteContent.footer_copyright 
    ? siteContent.footer_copyright.replace('{currentYear}', new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} Ismael Farah. All rights reserved.`;

  // Filter programming languages
  const programmingLanguages = skills.filter(skill => skill.category === 'Language');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-4">
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="text-2xl font-bold text-gradient"
            >
              {siteContent.header_title || 'DevPortfolio'}
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <Link href="/" className="px-4 py-2 rounded-lg font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30">Home</Link>
              <Link href="/projects" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Projects</Link>
              <Link href="/blog" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Blog</Link>
              <Link href="/certifications" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Certifications</Link>
              <Link href="/skills" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Skills</Link>
              <Link href="/programming-languages" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Languages</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Admin</Link>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1.5 rounded"></div>
              <div className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1.5 rounded"></div>
              <div className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded"></div>
            </button>
          </motion.div>
          
          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav 
                className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-2">
                  <Link href="/" className="px-4 py-2 rounded-lg font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30" onClick={() => setIsMenuOpen(false)}>Home</Link>
                  <Link href="/projects" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(false)}>Projects</Link>
                  <Link href="/blog" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                  <Link href="/certifications" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(false)}>Certifications</Link>
                  <Link href="/skills" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(false)}>Skills</Link>
                  <Link href="/programming-languages" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(false)}>Languages</Link>
                  <Link href="/login" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Hi, I'm <span className="text-gradient">Ismael Farah</span>
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {siteContent.hero_subtitle || 'Full Stack Developer crafting modern web experiences with React, Node.js, and cutting-edge technologies.'}
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Link 
                    href="/projects" 
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 glow"
                  >
                    {siteContent.hero_button_1 || 'View My Work'}
                  </Link>
                  <Link 
                    href="/blog" 
                    className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow hover:shadow-md"
                  >
                    {siteContent.hero_button_2 || 'Read My Blog'}
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2 flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative">
                  {siteContent.personal_image ? (
                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl glow">
                      <img 
                        src={siteContent.personal_image} 
                        alt="Ismael Farah" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-2xl glow"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center">
                          <div className="text-4xl font-bold text-gradient">IF</div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-yellow-400 shadow-lg animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-cyan-400 shadow-lg animate-pulse"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 bg-white dark:bg-gray-800/50 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{siteContent.skills_title || 'Technologies I Work With'}</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Tools and technologies I use to build modern web applications
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {skillsList.map((tech: string, index: number) => (
                <motion.div 
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gradient-border"
                  whileHover={{ y: -5, scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
                  </div>
                  <div className="text-lg font-semibold text-center">{tech}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex justify-between items-center mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{siteContent.certifications_title || 'My Certifications'}</h2>
                <p className="text-gray-600 dark:text-gray-400">Professional achievements and credentials</p>
              </div>
              <Link href="/certifications" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all glow">
                View All
              </Link>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {certifications.slice(0, 2).map((cert, index) => (
                <motion.div
                  key={cert.id}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 gradient-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold">{cert.title}</h3>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{cert.organization}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Date: {new Date(cert.date_issued).toLocaleDateString()}</span>
                    </div>
                    {cert.expiry_date && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Expiry: {new Date(cert.expiry_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills & Languages Section */}
        <section className="py-20 bg-white dark:bg-gray-800/50 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex justify-between items-center mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Skills & Proficiency</h2>
                <p className="text-gray-600 dark:text-gray-400">My technical skills and programming languages</p>
              </div>
              <Link href="/skills" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all glow">
                View All Skills
              </Link>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Skills */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 gradient-border">
                <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
                <div className="space-y-5">
                  {skills.slice(0, 4).map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{skill.name}</h4>
                        <span className="text-sm font-medium text-indigo-600">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <motion.div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, delay: 0.5 + 0.1 * index }}
                          viewport={{ once: true }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Programming Languages */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 gradient-border">
                <h3 className="text-2xl font-bold mb-6">Programming Languages</h3>
                <div className="space-y-5">
                  {programmingLanguages.slice(0, 4).map((language, index) => (
                    <motion.div
                      key={language.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{language.name}</h4>
                        <span className="text-sm font-medium text-indigo-600">{language.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <motion.div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${language.proficiency}%` }}
                          transition={{ duration: 1, delay: 0.5 + 0.1 * index }}
                          viewport={{ once: true }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex justify-between items-center mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Projects</h2>
                <p className="text-gray-600 dark:text-gray-400">Some of my recent work and accomplishments</p>
              </div>
              <Link href="/projects" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all glow">
                View All Projects
              </Link>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 gradient-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-white bg-black/20 rounded-full w-16 h-16 flex items-center justify-center">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 animated-gradient relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Interested in Working Together?</h2>
                <p className="text-indigo-100 mb-8 text-lg">
                  I'm always open to discussing new opportunities and interesting projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/projects" 
                    className="px-8 py-4 bg-white text-indigo-600 font-medium rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl glow"
                  >
                    View My Portfolio
                  </Link>
                  <Link 
                    href="/contact" 
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                  >
                    Get In Touch
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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