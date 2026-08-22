/**
 * Shared domain types. Kept separate from component files so data
 * shapes (which JSON content must conform to) aren't tangled with any
 * one component's props.
 */

export interface EducationEntry {
  id: string;
  institution: string;
  program: string;
  status: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  description: string;
  type: 'freelance' | 'speaking' | 'other';
}

export interface CertificateEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface SectionMeta {
  id: string;
  label: string;
}
