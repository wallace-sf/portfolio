import type { BlogPostImageDTO } from '@repo/application/blog';
import { screens } from '@repo/tailwind-config/screens';
import Image from 'next/image';

export interface IPostCoverProps {
  image: BlogPostImageDTO;
}

export function PostCover({ image }: IPostCoverProps) {
  return (
    <div className="relative h-56 overflow-hidden rounded-card bg-surface-sunken md:h-80">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        priority
        className="object-cover"
        sizes={`(min-width: ${screens.lg}) 48rem, 100vw`}
      />
    </div>
  );
}
