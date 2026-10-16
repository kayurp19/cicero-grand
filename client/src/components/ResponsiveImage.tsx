import type { ImgHTMLAttributes } from 'react';
import manifest from '@shared/image-manifest.json';

type ImageInfo = { width: number; height: number; variants: Array<{src: string; width: number}> };
export function ResponsiveImage({ src = '', sizes = '100vw', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const info = (manifest as Record<string, ImageInfo>)[src];
  if (!info) return <img src={src} sizes={sizes} {...props} />;
  const largest = info.variants.at(-1);
  return <img
    src={largest?.src ?? src}
    srcSet={info.variants.map(v => `${v.src} ${v.width}w`).join(', ') || undefined}
    sizes={sizes}
    width={info.width}
    height={info.height}
    decoding="async"
    {...props}
  />;
}
