import { ExperienceSkillDTO } from './ExperienceSkillDTO';

export type ExperienceDTO = {
  id: string;
  company: string;
  position: string;
  location: string;
  description?: string;
  logo?: { url: string; alt: string };
  employmentType: string;
  locationType: string;
  startAt: string;
  endAt?: string;
  skills: ExperienceSkillDTO[];
};
