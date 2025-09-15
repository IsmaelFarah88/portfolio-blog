export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  imageUrl?: string;
  linkUrl?: string;
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
}

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