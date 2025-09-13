import { Project, BlogPost, User } from './types';

// Extend types for new sections
export interface Certification {
  id: string;
  title: string;
  organization: string;
  date_issued: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 1-100 scale
  category: string;
  created_at: string;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  proficiency: number; // 1-100 scale
  icon_url?: string;
  created_at: string;
}

// Client-side data fetching functions that call our API routes
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'A full-featured e-commerce platform built with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        date: '2025-01-15',
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'A productivity app for managing tasks and team collaboration',
        technologies: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
        date: '2025-03-22',
      },
      {
        id: '3',
        title: 'Weather Dashboard',
        description: 'Real-time weather dashboard with forecasting capabilities',
        technologies: ['React', 'Chart.js', 'OpenWeather API', 'Geolocation'],
        date: '2025-05-10',
      },
    ];
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error('Failed to fetch project');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    return undefined;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: 'Getting Started with Next.js',
        excerpt: 'A comprehensive guide to building your first Next.js application',
        content: 'Next.js is a powerful React framework that provides excellent features for building modern web applications...',
        date: '2025-04-12',
        tags: ['Next.js', 'React', 'Tutorial'],
      },
      {
        id: '2',
        title: 'Understanding TypeScript',
        excerpt: 'Why TypeScript is becoming essential for modern web development',
        content: 'TypeScript adds static typing to JavaScript, helping developers catch errors early...',
        date: '2025-05-18',
        tags: ['TypeScript', 'JavaScript'],
      },
      {
        id: '3',
        title: 'Building Responsive UIs with Tailwind CSS',
        excerpt: 'Learn how to create beautiful, responsive designs with Tailwind CSS',
        content: 'Tailwind CSS is a utility-first CSS framework that allows you to build designs directly in your markup...',
        date: '2025-06-30',
        tags: ['CSS', 'Tailwind', 'Design'],
      },
    ];
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  try {
    const response = await fetch(`/api/blog/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error('Failed to fetch blog post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return undefined;
  }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  // This would typically be handled by the login API endpoint
  // For now, we'll return undefined since we don't want to expose user data on the client
  return undefined;
}

// Site content functions
export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const response = await fetch('/api/site-content');
    if (!response.ok) {
      throw new Error('Failed to fetch site content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching site content:', error);
    // Return default content as fallback
    return {
      header_title: 'DevPortfolio',
      header_home: 'Home',
      header_projects: 'Projects',
      header_blog: 'Blog',
      header_certifications: 'Certifications',
      header_skills: 'Skills',
      header_programming_languages: 'Programming Languages',
      header_admin: 'Admin',
      hero_title: 'Hi, I\'m <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ismael Farah</span>',
      hero_subtitle: 'Full Stack Developer crafting modern web experiences with React, Node.js, and cutting-edge technologies.',
      hero_button_1: 'View My Work',
      hero_button_2: 'Read My Blog',
      skills_title: 'Technologies I Work With',
      skills_list: '["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "MongoDB", "GraphQL", "Docker"]',
      footer_copyright: '© {currentYear} Ismael Farah. All rights reserved.',
      footer_links: '["Twitter", "GitHub", "LinkedIn"]',
      projects_title: 'My Projects',
      projects_subtitle: 'A collection of my web development projects and applications.',
      projects_all_button: 'All Projects',
      blog_title: 'My Blog',
      blog_subtitle: 'Thoughts, tutorials, and insights on web development and technology.',
      blog_all_button: 'All Posts',
      certifications_title: 'My Certifications',
      certifications_subtitle: 'Professional certifications and achievements.',
      skills_page_title: 'My Skills',
      skills_page_subtitle: 'Technical skills and proficiency levels.',
      programming_languages_title: 'Programming Languages',
      programming_languages_subtitle: 'Languages I work with and my proficiency levels.',
      contact_email: 'ismael.farah@example.com',
      contact_phone: '+1 (123) 456-7890',
      contact_location: 'San Francisco, CA',
      personal_image: '/placeholder-personal-image.jpg',
    };
  }
}

export async function updateSiteContent(content: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetch('/api/site-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating site content:', error);
    return false;
  }
}

// Certifications functions
export async function getCertifications(): Promise<Certification[]> {
  try {
    const response = await fetch('/api/certifications');
    if (!response.ok) {
      throw new Error('Failed to fetch certifications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching certifications:', error);
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: 'AWS Certified Developer',
        organization: 'Amazon Web Services',
        date_issued: '2025-01-15',
        expiry_date: '2028-01-15',
        credential_id: 'AWS-DEV-123456',
        url: 'https://aws.amazon.com/certification/',
        created_at: '2025-01-15',
      },
      {
        id: '2',
        title: 'Google Professional Cloud Developer',
        organization: 'Google Cloud',
        date_issued: '2025-03-22',
        expiry_date: '2027-03-22',
        credential_id: 'GCP-DEV-789012',
        url: 'https://cloud.google.com/certification/',
        created_at: '2025-03-22',
      },
    ];
  }
}

export async function getCertificationById(id: string): Promise<Certification | undefined> {
  try {
    const response = await fetch(`/api/certifications/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error('Failed to fetch certification');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching certification:', error);
    return undefined;
  }
}

export async function createCertification(certification: Omit<Certification, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const response = await fetch('/api/certifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certification),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating certification:', error);
    return false;
  }
}

export async function updateCertification(id: string, certification: Partial<Certification>): Promise<boolean> {
  try {
    const response = await fetch(`/api/certifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certification),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating certification:', error);
    return false;
  }
}

export async function deleteCertification(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/certifications/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting certification:', error);
    return false;
  }
}

// Skills functions
export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await fetch('/api/skills');
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    // Return mock data as fallback
    return [
      { id: '1', name: 'React', proficiency: 95, category: 'Frontend', created_at: '2025-01-01' },
      { id: '2', name: 'Next.js', proficiency: 90, category: 'Frontend', created_at: '2025-01-01' },
      { id: '3', name: 'TypeScript', proficiency: 85, category: 'Language', created_at: '2025-01-01' },
      { id: '4', name: 'Node.js', proficiency: 80, category: 'Backend', created_at: '2025-01-01' },
      { id: '5', name: 'Tailwind CSS', proficiency: 90, category: 'Styling', created_at: '2025-01-01' },
      { id: '6', name: 'MongoDB', proficiency: 75, category: 'Database', created_at: '2025-01-01' },
      { id: '7', name: 'GraphQL', proficiency: 70, category: 'API', created_at: '2025-01-01' },
      { id: '8', name: 'Docker', proficiency: 65, category: 'DevOps', created_at: '2025-01-01' },
      { id: '9', name: 'AWS', proficiency: 70, category: 'Cloud', created_at: '2025-01-01' },
      { id: '10', name: 'Python', proficiency: 60, category: 'Language', created_at: '2025-01-01' },
    ];
  }
}

export async function getSkillById(id: string): Promise<Skill | undefined> {
  try {
    const response = await fetch(`/api/skills/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error('Failed to fetch skill');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching skill:', error);
    return undefined;
  }
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const response = await fetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating skill:', error);
    return false;
  }
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<boolean> {
  try {
    const response = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating skill:', error);
    return false;
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting skill:', error);
    return false;
  }
}

// Admin functions for creating/updating/deleting data
export async function createProject(project: Omit<Project, 'id'>): Promise<boolean> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating project:', error);
    return false;
  }
}

export async function updateProject(id: string, project: Partial<Project>): Promise<boolean> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<boolean> {
  try {
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return false;
  }
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<boolean> {
  try {
    const response = await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return false;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/blog/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

// Programming Languages functions
export async function getProgrammingLanguages(): Promise<ProgrammingLanguage[]> {
  try {
    const response = await fetch('/api/programming-languages');
    if (!response.ok) {
      throw new Error('Failed to fetch programming languages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching programming languages:', error);
    // Return mock data as fallback
    return [
      { id: '1', name: 'JavaScript', proficiency: 95, icon_url: '/icons/javascript.svg', created_at: '2025-01-01' },
      { id: '2', name: 'TypeScript', proficiency: 85, icon_url: '/icons/typescript.svg', created_at: '2025-01-01' },
      { id: '3', name: 'Python', proficiency: 80, icon_url: '/icons/python.svg', created_at: '2025-01-01' },
      { id: '4', name: 'Java', proficiency: 75, icon_url: '/icons/java.svg', created_at: '2025-01-01' },
      { id: '5', name: 'C++', proficiency: 70, icon_url: '/icons/cpp.svg', created_at: '2025-01-01' },
      { id: '6', name: 'Go', proficiency: 65, icon_url: '/icons/go.svg', created_at: '2025-01-01' },
      { id: '7', name: 'Rust', proficiency: 60, icon_url: '/icons/rust.svg', created_at: '2025-01-01' },
    ];
  }
}

export async function getProgrammingLanguageById(id: string): Promise<ProgrammingLanguage | undefined> {
  try {
    const response = await fetch(`/api/programming-languages/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error('Failed to fetch programming language');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching programming language:', error);
    return undefined;
  }
}

export async function createProgrammingLanguage(language: Omit<ProgrammingLanguage, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const response = await fetch('/api/programming-languages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(language),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating programming language:', error);
    return false;
  }
}

export async function updateProgrammingLanguage(id: string, language: Partial<ProgrammingLanguage>): Promise<boolean> {
  try {
    const response = await fetch(`/api/programming-languages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(language),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating programming language:', error);
    return false;
  }
}

export async function deleteProgrammingLanguage(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/programming-languages/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting programming language:', error);
    return false;
  }
}