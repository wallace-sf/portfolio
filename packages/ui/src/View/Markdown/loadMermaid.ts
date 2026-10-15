const MERMAID_CDN =
  'https://cdn.jsdelivr.net/npm/mermaid@11.15.0/dist/mermaid.min.js';

export interface MermaidAPI {
  initialize(config: { startOnLoad: boolean; theme: string }): void;
  render(id: string, text: string): Promise<{ svg: string }>;
}

let scriptPromise: Promise<MermaidAPI> | null = null;

export const loadMermaid = (): Promise<MermaidAPI> => {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<MermaidAPI>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = MERMAID_CDN;
    script.onload = () => {
      if (window.mermaid) resolve(window.mermaid);
      else reject(new Error('mermaid not on window after load'));
    };
    script.onerror = () => reject(new Error('Failed to load mermaid from CDN'));
    document.head.appendChild(script);
  });

  return scriptPromise;
};
