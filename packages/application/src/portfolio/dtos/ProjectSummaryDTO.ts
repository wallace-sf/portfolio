export type SkillSummary = { name: string; icon: string };

export type ProjectSummaryDTO = {
  id: string;
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: SkillSummary[];
  publishedAt: string;
};
