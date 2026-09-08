/**
 * Shared domain types. Kept separate from component files so data
 * shapes (which JSON content must conform to) aren't tangled with any
 * one component's props.
 */

export interface EducationEntry {
  id: string;
  institution: string;
  program: string;
  specialization?: string;
  currentYear?: string;
  currentSemester?: string;
  expectedGraduation?: string;
  status: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  description: string;
  type: 'freelance' | 'speaking' | 'other';
  category?: 'formal' | 'practical';
}

export interface CertificateEntry {
  id: string;
  title: string;
  type?: string;
  issuer?: string;
  platform?: string;
  organizedBy?: string;
  inPartnershipWith?: string;
  institution?: string;
  topic?: string;
  description?: string;
  date: string;
  imagePath?: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  category: string;
  evidence: string;
}

export interface WorkEntry {
  id: string;
  title: string;
  track: 'current' | 'future';
  status: string;
  summary: string;
}

export interface FutureGoalEntry {
  id: string;
  title: string;
  status: string;
  detail: string;
}

export interface ContactContent {
  headline: string;
  availability: string;
  email?: string;
  github?: string;
  resumePath: string;
}

export interface SectionMeta {
  id: string;
  label: string;
}
