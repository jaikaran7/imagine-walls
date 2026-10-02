"use client";

import { useEffect } from "react";

let locks = 0;
let saved: {
  scrollY: number;
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyPaddingRight: string;
} | null = null;

/**
 * Locks page scroll while `active`.
 * Freezes body position with fixed top offset to 100% prevent any viewport
 * scrolling on desktop, trackpads, and mobile devices while overlay is open.
 * Restores exact scroll position when released.
 * Ref-counted so stacked overlays don't unlock each other prematurely.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;

    if (locks++ === 0) {
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollBarWidth = window.innerWidth - html.clientWidth;

      saved = {
        scrollY: currentScrollY,
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
        bodyPosition: body.style.position,
        bodyTop: body.style.top,
        bodyLeft: body.style.left,
        bodyRight: body.style.right,
        bodyWidth: body.style.width,
        bodyPaddingRight: body.style.paddingRight,
      };

      html.setAttribute("data-scroll-locked", "true");
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${currentScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }

    return () => {
      if (--locks === 0 && saved) {
        const targetScrollY = saved.scrollY;
        html.removeAttribute("data-scroll-locked");
        html.style.overflow = saved.htmlOverflow;
        body.style.overflow = saved.bodyOverflow;
        body.style.position = saved.bodyPosition;
        body.style.top = saved.bodyTop;
        body.style.left = saved.bodyLeft;
        body.style.right = saved.bodyRight;
        body.style.width = saved.bodyWidth;
        body.style.paddingRight = saved.bodyPaddingRight;
        saved = null;

        window.scrollTo(0, targetScrollY);
      }
    };
  }, [active]);
}
