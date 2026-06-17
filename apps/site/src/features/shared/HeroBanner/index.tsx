'use client';

import { FC } from 'react';

import classNames from 'classnames';
import Image, { StaticImageData } from 'next/image';

export interface IHeroBannerProps {
  src: string | StaticImageData;
  title: string;
  caption: string;
  content: string;
  alt: string;
  titleSize?: 'lg' | 'xl';
  titleAs?: 'h1' | 'h2';
  className?: string;
  imageClassName?: string;
  textColumnClassName?: string;
}

export const HeroBanner: FC<IHeroBannerProps> = ({
  src,
  title,
  caption,
  content,
  alt,
  titleSize = 'lg',
  titleAs: TitleTag = 'h2',
  className = '',
  imageClassName = '',
  textColumnClassName = '',
}) => {
  return (
    <section
      className={classNames(
        'flex flex-col bg-surface gap-y-6 lg:flex-row lg:gap-x-8 lg:rounded-xl lg:h-106 xl:-mx-[97px] shadow-drop-md',
        className,
      )}
    >
      <div className="relative h-64 flex flex-row justify-center lg:order-1 lg:h-full lg:w-1/2">
        <Image
          src={src}
          alt={alt}
          priority
          quality={100}
          fill
          className={imageClassName}
          sizes="(max-width: 1280px) 100vw, 50vw"
        />
      </div>
      <div
        className={classNames(
          'flex flex-col px-6 pb-6 lg:order-0 lg:py-20 lg:pl-20',
          textColumnClassName,
        )}
      >
        <p className="text-body-xl text-content-secondary pb-2">{title}</p>
        <TitleTag
          className={classNames(
            'text-content-primary font-bold mb-8 line-clamp-2',
            {
              'text-[40px] leading-[56px]': titleSize === 'lg',
              'text-5xl leading-[67.2px]': titleSize === 'xl',
            },
          )}
        >
          {caption}
        </TitleTag>
        <p className="text-body-sm text-content-primary line-clamp-3">
          {content}
        </p>
      </div>
    </section>
  );
};
