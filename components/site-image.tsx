import NextImage, { type ImageProps } from 'next/image';

export default function Image({ src, ...props }: ImageProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const imageSource = typeof src === 'string' && src.startsWith('/images/') ? basePath + src : src;
  return <NextImage {...props} src={imageSource} />;
}
