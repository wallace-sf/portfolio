import { ProjectSummaryDTO } from '~/portfolio/dtos/ProjectSummaryDTO';

export type ProjectDetailDTO = ProjectSummaryDTO & {
  content: string;
  summary?: string;
  objectives?: string;
  role?: string;
  period: { startAt: string; endAt?: string };
  relatedProjects: ProjectSummaryDTO[];
};
