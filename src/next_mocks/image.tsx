
import React from 'react';
export default function NextImage(props) {
  const { src, width, height, alt, ...rest } = props;
  return <img src={src} width={width} height={height} alt={alt} {...rest} />;
}
