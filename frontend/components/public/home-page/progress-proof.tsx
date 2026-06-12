
"use client";

import { useEffect, useRef, useState, type RefObject, type ReactElement } from "react";

type UseInViewOptions = {
  threshold?: number;
  triggerOnce?: boolean;
};

type CountUpProps = {
  end: number;
  isActive: boolean;
  duration?: number;
  decimals?: number;
  delay?: number;
  className?: string;
};

type AnimatedBarsProps = {
  bars: number[];
  isActive: boolean;
  barClassName: string;
  wrapperHeight?: string;
  duration?: number;
  stagger?: number;
  initialDelay?: number;
};

const useInView = (
  options: UseInViewOptions = { threshold: 0.28, triggerOnce: true }
): [RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);

          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold: options.threshold ?? 0.28 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce]);

  return [ref, isInView];
};

const CountUp = ({
  end,
  isActive,
  duration = 1800,
  decimals = 1,
  delay = 250,
  className = "",
}: CountUpProps): ReactElement => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number | undefined;
    let frameId = 0;
    let timeoutId: number | undefined;

    const animate = (time: number) => {
      if (startTime === undefined) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    timeoutId = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(animate);
    }, delay);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [end, isActive, duration, delay]);

  return <span className={className}>{value.toFixed(decimals)}</span>;
};

const AnimatedBars = ({
  bars,
  isActive,
  barClassName,
  wrapperHeight = "h-[100px]",
  duration = 1200,
  stagger = 140,
  initialDelay = 180,
}: AnimatedBarsProps): ReactElement => {
  return (
    <div className={`flex items-end justify-between gap-1 mt-6 ${wrapperHeight}`}>
      {bars.map((barHeight, index) => (
        <div
          key={index}
          className={`w-[18%] rounded-xs origin-bottom motion-reduce:transform-none ${barClassName}`}
          style={{
            height: `${barHeight}%`,
            transform: isActive ? "scaleY(1)" : "scaleY(0)",
            transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${
              initialDelay + index * stagger
            }ms`,
          }}
        />
      ))}
    </div>
  );
};

export const ProgressProof = (): ReactElement => {
  const [sectionRef, isVisible] = useInView({
    threshold: 0.28,
    triggerOnce: true,
  });

  const beforeBars: number[] = [65, 55, 75, 45, 70];
  const afterBars: number[] = [35, 45, 80, 58, 100];

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center justify-center w-full"
    >
      <div className="flex flex-col items-center text-center max-w-165">
        <h3 className="font-medium text-lg md:text-2xl">Customer Engagement Trends</h3>
        <p className="py-6">
          Examples of how businesses may improve customer engagement and review response activity over time when using organized feedback tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full max-w-300 justify-center items-center lg:items-stretch">
        <div className="flex flex-col w-full p-6 rounded-3xl shadow-sm border border-border-secondary  relative overflow-hidden">
          <div className="absolute top-0 right-0 w-45 h-45 rounded-full bg-muted opacity-60 blur-3xl -mr-[60px] -mt-[60px]" />

          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-wider text-destructive bg-destructive/10 rounded-full self-start">
            EARLIER ACTIVITY
          </span>

          <div className="flex items-baseline mb-2">
            <CountUp
              end={3.2}
              isActive={isVisible}
              decimals={1}
              duration={1600}
              delay={180}
              className="text-xl md:text-5xl font-bold text-foreground tabular-nums"
            />
            <span className="ml-3 text-lg md:text-[21px] text-muted-foreground">
              Avg. Rating
            </span>
          </div>

          <p className="text-lg md:text-[19px] text-muted-foreground font-medium leading-[1.3] mb-auto">
            Limited customer feedback activity
          </p>

          <AnimatedBars
            bars={beforeBars}
            isActive={isVisible}
            barClassName="bg-red-400"
            wrapperHeight="h-[80px]"
            duration={1050}
            stagger={120}
            initialDelay={120}
          />
        </div>

        <div className="flex flex-col w-full p-6 shadow-sm rounded-3xl border border-border-secondary relative overflow-hidden">
          <div className="absolute -top-10 -right-12.5 w-50 h-50 rounded-full bg-accent opacity-80 blur-[80px]" />

          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-wider text-leaf-dark bg-leaf-dark/20 rounded-full self-start">
            ONGOING ENGAGEMENT
          </span>

          <div className="flex items-baseline mb-2">
            <CountUp
              end={4.8}
              isActive={isVisible}
              decimals={1}
              duration={1750}
              delay={260}
              className="text-2xl md:text-5xl font-semibold text-mango-mid tabular-nums"
            />
            <span className="ml-3 text-lg md:text-[21px] text-muted-foreground">
              Avg. Rating
            </span>
          </div>

          <p className="text-lg md:text-[19px] text-muted-foreground font-medium leading-[1.3] mb-auto">
            Higher customer response participation
          </p>

          <AnimatedBars
            bars={afterBars}
            isActive={isVisible}
            barClassName="bg-leaf-dark"
            wrapperHeight="h-[100px]"
            duration={1150}
            stagger={130}
            initialDelay={220}
          />
        </div>
      </div>
    </div>
  );
};