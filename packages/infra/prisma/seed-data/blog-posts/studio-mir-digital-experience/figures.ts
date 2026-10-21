// The storage folder keeps the post's original (pt-BR) slug; the images were
// uploaded before the slug changed, and the path is not user-facing.
const BASE =
  'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/blog/studio-mir-experiencia-digital';

/** Public URLs of the post's images in Supabase storage, shared by every locale. */
export const FIGURE = {
  cover: `${BASE}/cover.webp`,
  thumbnail: `${BASE}/thumbnail-v4.webp`,
  homeLoad: `${BASE}/fig-1-home-load.gif`,
  oversizedImage: `${BASE}/fig-2-oversized-image.webp`,
  portfolioGrid: `${BASE}/fig-3-portfolio-grid.webp`,
  titlesDesktopVsMobile: `${BASE}/fig-4-titles-desktop-vs-mobile.webp`,
};
