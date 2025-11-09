import { IKImage } from 'imagekitio-react';

const IKImageWrapper = ({ src, className, w, h, alt }) => {
  const isFullUrl = src?.startsWith('http');

  // ถ้าไม่มี src ให้แสดง avatar ตัวอักษรแทน
  if (!src) {
    const initial = alt ? alt.charAt(0).toUpperCase() : 'U';
    return (
      <div
        className={`${className} bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold min-w-[40px] min-h-[40px]`}
      >
        {initial}
      </div>
    );
  }

  if (isFullUrl) {
    return (
      <img
        src={src}
        className={className}
        alt={alt}
        width={w}
        height={h}
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      path={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default IKImageWrapper