import { ProjectList, ProjectSummary } from '~features/home/ProjectsSection';

interface ProjectsSectionProps {
  projects: ProjectSummary[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return <ProjectList projects={projects} className="py-8 xl:py-20" />;
}
