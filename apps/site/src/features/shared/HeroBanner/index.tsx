import { FC } from 'react';

import { screens } from '@repo/tailwind-config/screens';
import classNames from 'classnames';
import Image, { StaticImageData } from 'next/image';

export interface IHeroBannerProps {
  src: string | StaticImageData;
  title: string;
  caption: string;
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
  alt,
  titleSize = 'lg',
  titleAs: TitleTag = 'h2',
  className = '',
  imageClassName = '',
  textColumnClassName = '',
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col bg-surface gap-y-6 rounded-xl lg:flex-row lg:gap-x-8 lg:h-106 2xl:-mx-[97px]',
        className,
      )}
    >
      <div className="relative flex h-64 flex-row justify-center lg:order-1 lg:h-full lg:w-1/2">
        <Image
          src={src}
          alt={alt}
          priority
          quality={100}
          fill
          className={imageClassName}
          sizes={`(max-width: ${screens.xl}) 100vw, 50vw`}
        />
      </div>
      <div
        className={classNames(
          'flex flex-col justify-center overflow-hidden px-6 pb-6 lg:py-10 lg:pr-0 lg:order-0 xl:pl-10 2xl:pl-20',
          textColumnClassName,
        )}
      >
        <TitleTag
          className={classNames('mb-3 line-clamp-2', {
            'text-heading-h2': titleSize === 'lg',
            'text-heading-h1': titleSize === 'xl',
          })}
        >
          {title}
        </TitleTag>
        <p className="text-sm text-content-secondary md:text-base lg:text-lg 2xl:text-2xl 2xl:leading-[33.6px]">
          {caption}
        </p>
      </div>
    </div>
  );
};
