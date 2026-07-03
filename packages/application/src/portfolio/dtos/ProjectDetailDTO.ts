import { ProjectSummaryDTO } from './ProjectSummaryDTO';

export type ProjectDetailDTO = ProjectSummaryDTO & {
  content: string;
  summary?: string;
  objectives?: string;
  role?: string;
  repositoryUrl?: string;
  projectUrl?: string;
  period: { startAt: string; endAt?: string };
  relatedProjects: ProjectSummaryDTO[];
};
