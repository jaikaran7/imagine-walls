"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import clsx from "clsx";

export function MediaImage({ className, onLoad, onError, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  const markLoaded = () => setLoaded(true);

  return (
    <Image
      {...props}
      onLoad={(event) => {
        markLoaded();
        onLoad?.(event);
      }}
      onError={(event) => {
        markLoaded();
        onError?.(event);
      }}
      className={clsx(
        "bg-surface transition-[opacity,filter] duration-700 ease-editorial",
        loaded ? "opacity-100 blur-0" : "opacity-70 blur-[2px]",
        className
      )}
    />
  );
}
