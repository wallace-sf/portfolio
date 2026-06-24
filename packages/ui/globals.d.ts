import type { MermaidAPI } from './src/View/TextRich/lib/loadMermaid';

declare global {
  interface Window {
    mermaid?: MermaidAPI;
  }
}
