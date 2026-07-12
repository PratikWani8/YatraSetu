import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });

  return keyframes;
};

const BlurText = ({
  text = "",
  delay = 80,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = [0.22, 1, 0.36, 1],
  onAnimationComplete,
  stepDuration = 0.25,
}) => {
  const elements =
    animateBy === "words" ? text.split(" ") : text.split("");

  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(6px)", opacity: 0, y: -40 }
        : { filter: "blur(6px)", opacity: 0, y: 40 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(2px)",
        opacity: 0.6,
        y: direction === "top" ? 4 : -4,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);

  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((segment, index) => {
        const keyframes = buildKeyframes(fromSnapshot, toSnapshots);

        return (
          <motion.span
            key={index}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={fromSnapshot}
            animate={inView ? keyframes : fromSnapshot}
            transition={{
              duration: totalDuration,
              times,
              ease: easing,
              delay: (index * delay) / 1000,
            }}
            onAnimationComplete={
              index === elements.length - 1
                ? onAnimationComplete
                : undefined
            }
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" &&
              index < elements.length - 1 &&
              "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;