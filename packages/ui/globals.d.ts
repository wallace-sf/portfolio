import type { MermaidAPI } from './src/View/Markdown/loadMermaid';

declare global {
  interface Window {
    mermaid?: MermaidAPI;
  }
}
