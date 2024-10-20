'use client';

import { FC } from 'react';

import Image, { StaticImageData } from 'next/image';

export interface IHeroBannerProps {
  src: string | StaticImageData;
  title: string;
  caption: string;
  content: string;
  alt: string;
  imageClassName?: string;
}

export const HeroBanner: FC<IHeroBannerProps> = ({
  src,
  title,
  caption,
  content,
  alt,
  imageClassName = '',
}) => {
  return (
    <section className="flex flex-col bg-dark-300 gap-y-6 lg:gap-x-8 lg:flex lg:flex-row lg:rounded-xl lg:h-[424px]">
      <section className="flex flex-row justify-center lg:order-1 lg:w-1/2">
        <Image
          src={src}
          alt={alt}
          priority
          quality={100}
          className={imageClassName}
          sizes="100vw"
        />
      </section>
      <section className="flex flex-col px-6 pb-6 lg:order-0 lg:py-20 lg:pl-20 lg:w-1/2">
        <h1 className="text-body-lg !text-dark-900 pb-2">{title}</h1>
        <h2 className="text-body-xl !text-white !font-bold pb-8">{caption}</h2>
        <p className="text-body-sm !text-white">{content}</p>
      </section>
    </section>
  );
};
