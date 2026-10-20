"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

/*
  This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.
*/
function horizontalLoop(items: any[], config: any) {
  items = gsap.utils.toArray(items);
  config = config || {};
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  });
  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: any[] = [];
  const widths: any[] = [];
  const xPercents: any[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap = config.snap === false ? (v: any) => v : gsap.utils.snap(config.snap || 1);
  let totalWidth, curX, distanceToStart, distanceToLoop, item, i;

  gsap.set(items, {
    xPercent: (i, el) => {
      const w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
        (gsap.getProperty(el, "xPercent") as number)
      );
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });

  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth * (gsap.getProperty(items[length - 1], "scaleX") as number) +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
        {
          xPercent: xPercents[i],
          duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index: number, vars: any) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  const customTl = tl as any;
  customTl.next = (vars: any) => toIndex(curIndex + 1, vars);
  customTl.previous = (vars: any) => toIndex(curIndex - 1, vars);
  customTl.current = () => curIndex;
  customTl.toIndex = (index: number, vars: any) => toIndex(index, vars);
  customTl.times = times;
  customTl.progress(1, true).progress(0, true);

  if (config.reversed) {
    if (customTl.vars.onReverseComplete) {
      customTl.vars.onReverseComplete();
    }
    customTl.reverse();
  }
  return customTl;
}

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  paddingRight?: number;
}

export default function Marquee({
  children,
  speed = 0.2,
  className = "",
  paddingRight = 30,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rail = containerRef.current?.querySelector(".rail");
      if (!rail) return;

      const items = gsap.utils.toArray(rail.children) as HTMLElement[];
      if (items.length === 0) return;

      const tl = horizontalLoop(items, {
        repeat: -1,
        speed: speed,
        paddingRight: paddingRight,
      });

      Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        onChangeY(self) {
          let factor = 2.5;
          if (self.deltaY < 0) {
            factor *= -1;
          }
          gsap
            .timeline({
              defaults: {
                ease: "none",
              },
            })
            .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
            .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
        },
      });

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`scrolling-text overflow-hidden w-full flex items-center ${className}`}
    >
      <div className="rail flex will-change-transform">
        {children}
      </div>
    </div>
  );
}
