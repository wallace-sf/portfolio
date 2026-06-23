'use client';

import { useEffect, useId, useRef } from 'react';

interface IMermaidBlockProps {
  chart: string;
}

export const MermaidBlock = ({ chart }: IMermaidBlockProps) => {
  const id = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    let cancelled = false;

    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled) return;
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      mermaid.render(`mermaid-${id}`, chart.trim()).then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return <div ref={ref} className="my-4 flex justify-center overflow-x-auto" />;
};
