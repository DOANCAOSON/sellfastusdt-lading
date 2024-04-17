import { useEffect, useRef, useState } from "preact/compat";

export const useIntersectionObserver = <T extends Element>(
  externalRef: React.MutableRefObject<T | null>,
  options?: IntersectionObserverInit
): [boolean] => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { ...options }
    );

    if (externalRef.current) {
      observer.observe(externalRef.current);
    }

    return () => {
      if (externalRef.current) {
        observer.unobserve(externalRef.current);
      }
    };
  }, [externalRef, options]);

  return [inView];
};

type AnimationType =
  | "fadeIn"
  | "slideIn"
  | "slideInFromLeft"
  | "slideInFromRight";

interface MotionProps {
  animationName: AnimationType;
  children: React.ReactNode;
  className?: string;
  id?: string;
  duration?: number;
  inViewDefault?: boolean;
  key?: string | number;
  width?: string;
  style?: any;
}
export const Animation = (props: MotionProps) => {
  const {
    children,
    animationName,
    className = "",
    duration = 0.5,
    key,
    inViewDefault,
    width = "100%",
    ...rest
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [inView] = useIntersectionObserver<HTMLDivElement>(ref, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  useEffect(() => {
    const current = ref.current;
    if (current && (inViewDefault || inView)) {
      current.classList.add(animationName);
      current.style.visibility = "visible";
    }
  }, [inView, inViewDefault]);

  const containerStyle = {
    width,
    visibility: !inViewDefault ? "hidden" : "visible",
    animationDuration: `${duration}s`,
  };

  return (
    <div
      {...rest}
      className={`animation ${className}`}
      style={containerStyle}
      ref={ref}
      key={key}
    >
      {children}
    </div>
  );
};
