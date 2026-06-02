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
        'flex flex-col bg-surface gap-y-6 xl:gap-x-8 xl:flex xl:flex-row xl:rounded-xl xl:h-106 xl:-mx-[97px]',
        className,
      )}
    >
      <section className="relative h-64 flex flex-row justify-center xl:order-1 xl:h-full xl:w-1/2">
        <Image
          src={src}
          alt={alt}
          priority
          quality={100}
          fill
          className={imageClassName}
          sizes="(max-width: 1280px) 100vw, 50vw"
        />
      </section>
      <section
        className={classNames(
          'flex flex-col px-6 pb-6 xl:order-0 xl:py-20 xl:pl-20',
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
      </section>
    </section>
  );
};
