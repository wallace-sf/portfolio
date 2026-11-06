const BASE =
  'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/blog/first-freelance-lessons';

/** Public URLs of the post's files in Supabase storage, shared by every locale. */
export const FIGURE = {
  cover: `${BASE}/cover.webp`,
  thumbnail: `${BASE}/thumbnail.webp`,
  proposalPages: `${BASE}/proposal-pages.webp`,
  /** Sample MVP proposal (draft, English only). */
  proposalPdf: `${BASE}/sample-mvp-proposal.pdf`,
};
