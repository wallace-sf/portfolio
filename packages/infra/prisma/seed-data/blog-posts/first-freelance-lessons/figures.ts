const BASE =
  'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/blog/first-freelance-lessons';

/** Public URLs of the post's images in Supabase storage, shared by every locale. */
export const FIGURE = {
  cover: `${BASE}/cover.webp`,
  thumbnail: `${BASE}/thumbnail.webp`,
};

/** The fictional commercial proposal template, in each locale's language. */
export const PROPOSAL = {
  'pt-BR': {
    preview: `${BASE}/proposal-preview-pt-BR.webp`,
    pdf: `${BASE}/modelo-proposta-comercial-freelance.pdf`,
    docx: `${BASE}/modelo-proposta-comercial-freelance.docx`,
  },
  'en-US': {
    preview: `${BASE}/proposal-preview-en-US.webp`,
    pdf: `${BASE}/freelance-commercial-proposal-template.pdf`,
    docx: `${BASE}/freelance-commercial-proposal-template.docx`,
  },
  es: {
    preview: `${BASE}/proposal-preview-es.webp`,
    pdf: `${BASE}/modelo-propuesta-comercial-freelance.pdf`,
    docx: `${BASE}/modelo-propuesta-comercial-freelance.docx`,
  },
} as const;
