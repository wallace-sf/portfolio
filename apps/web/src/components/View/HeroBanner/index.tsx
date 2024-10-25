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
  className?: string;
  imageClassName?: string;
}

export const HeroBanner: FC<IHeroBannerProps> = ({
  src,
  title,
  caption,
  content,
  alt,
  className = '',
  imageClassName = '',
}) => {
  return (
    <section
      className={classNames(
        'flex flex-col bg-dark-300 gap-y-6 xl:gap-x-8 xl:flex xl:flex-row xl:rounded-xl xl:h-[424px]',
        className,
      )}
    >
      <section className="flex flex-row justify-center xl:order-1 xl:w-1/2">
        <Image
          src={src}
          alt={alt}
          priority
          quality={100}
          className={imageClassName}
          sizes="100vw"
        />
      </section>
      <section className="flex flex-col px-6 pb-6 xl:order-0 xl:py-20 xl:pl-20 xl:w-1/2">
        <h1 className="text-body-xl !text-dark-900 pb-2">{title}</h1>
        <h2 className="text-body-xl !text-white !font-bold pb-8">{caption}</h2>
        <p className="text-body-sm !text-white">{content}</p>
      </section>
    </section>
  );
};
