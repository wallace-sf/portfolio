import { Fragment, type ReactNode } from 'react';

import { MermaidBlock } from '@repo/ui/View/MermaidBlock';
import {
  type IZoomableImageProps,
  ZoomableImage,
} from '@repo/ui/View/ZoomableImage';
import classNames from 'classnames';
import { type Components, toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { jsx, jsxs } from 'react/jsx-runtime';

import {
  DEFAULT_ZOOMABLE_IMAGE_LABELS,
  type ZoomableImageLabels,
} from '../ZoomableImage/labels';
import { markdownToHast } from './pipeline';
import { MERMAID_TAG } from './rehypeMermaid';
import { ZOOMABLE_IMAGE_TAG } from './rehypeZoomableImages';

/** The client islands the trusted transforms emit, by tag. */
const componentsFor = (imageLabels: ZoomableImageLabels) =>
  ({
    [MERMAID_TAG]: MermaidBlock,
    [ZOOMABLE_IMAGE_TAG]: (props: IZoomableImageProps) => (
      <ZoomableImage {...props} labels={imageLabels} />
    ),
  }) as Partial<Components>;

export interface IMarkdownProps {
  content: string;
  /** Extra classes for the `.markdown-body` container (e.g. text colour). */
  className?: string;
  /** Localized labels for the image zoom viewer; English by default. */
  imageLabels?: ZoomableImageLabels;
}

/**
 * Renders Markdown on the server inside the `.markdown-body` container, the
 * site's single Markdown typography (GitHub's stylesheet + design-token
 * overrides in `globals.css`). Mermaid diagrams and zoomable images are the
 * client islands, each imported through its own `'use client'` entry so the
 * boundary survives bundling.
 */
export async function Markdown({
  content,
  className,
  imageLabels = DEFAULT_ZOOMABLE_IMAGE_LABELS,
}: IMarkdownProps): Promise<ReactNode> {
  const body = toJsxRuntime(await markdownToHast(content), {
    Fragment,
    jsx,
    jsxs,
    components: componentsFor(imageLabels),
  });

  return <div className={classNames('markdown-body', className)}>{body}</div>;
}

export { markdownHeadings, type MarkdownHeading } from './headings';
export type { ZoomableImageLabels } from '../ZoomableImage/labels';
