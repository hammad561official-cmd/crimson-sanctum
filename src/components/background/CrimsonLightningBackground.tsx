import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Point {
  x: number;
  y: number;
}

interface Bolt {
  points: Point[];
  branches: Point[][];
  intensity: number;
}

const COLORS = {
  core: 'rgba(245, 214, 218,',
  primary: 'rgba(220, 20, 60,',
  glow: 'rgba(139, 0, 0,',
  ambient: 'rgba(90, 0, 16,',
} as const;

function createBolt(width: number, height: number, isCompact: boolean): Bolt {
  const startsFromEdge = Math.random() > 0.3;
  const start: Point = {
    x: startsFromEdge ? -width * 0.08 : width * (0.2 + Math.random() * 0.6),
    y: height * (0.12 + Math.random() * 0.64),
  };
  const end: Point = {
    x: startsFromEdge ? width * (0.6 + Math.random() * 0.35) : width * (0.8 + Math.random() * 0.15),
    y: start.y + (Math.random() - 0.5) * height * 0.24,
  };
  const segments = isCompact ? 7 : 10 + Math.floor(Math.random() * 4);
  const points: Point[] = [start];

  for (let index = 1; index <= segments; index += 1) {
    const progress = index / segments;
    points.push({
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress + (Math.random() - 0.5) * height * 0.1,
    });
  }

  const branches = points.slice(2, -1).reduce<Point[][]>((result, point, index) => {
    if (result.length >= (isCompact ? 2 : 4) || Math.random() > 0.68) return result;

    const direction = index % 2 === 0 ? -1 : 1;
    const length = width * (isCompact ? 0.06 : 0.08 + Math.random() * 0.08);
    const branch: Point[] = [point, {
      x: point.x + length,
      y: point.y + direction * height * (0.06 + Math.random() * 0.1),
    }];

    if (!isCompact && Math.random() > 0.55) {
      const last = branch[1];
      if (last) {
        branch.push({ x: last.x + length * 0.35, y: last.y + direction * height * 0.035 });
      }
    }

    result.push(branch);
    return result;
  }, []);

  return { points, branches, intensity: 0.45 + Math.random() * 0.35 };
}

function drawPath(
  context: CanvasRenderingContext2D,
  points: Point[],
  color: string,
  alpha: number,
  width: number
) {
  const firstPoint = points[0];
  if (!firstPoint || points.length < 2) return;

  context.beginPath();
  context.moveTo(firstPoint.x, firstPoint.y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.strokeStyle = `${color}${alpha})`;
  context.lineWidth = width;
  context.stroke();
}

export function CrimsonLightningBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let isCompact = window.matchMedia('(max-width: 640px)').matches;
    let bolt: Bolt | null = null;
    let flash = 0;
    let nextStrike = performance.now() + 2800 + Math.random() * 5200;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      isCompact = window.matchMedia('(max-width: 640px)').matches;
      pixelRatio = Math.min(window.devicePixelRatio || 1, isCompact ? 1.25 : 1.5);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const drawAmbient = () => {
      context.clearRect(0, 0, width, height);
      const ambient = context.createRadialGradient(
        width * 0.54,
        height * 0.42,
        0,
        width * 0.54,
        height * 0.42,
        Math.max(width, height) * 0.72
      );
      ambient.addColorStop(0, 'rgba(90, 0, 16, 0.095)');
      ambient.addColorStop(0.55, 'rgba(90, 0, 16, 0.025)');
      ambient.addColorStop(1, 'rgba(12, 12, 12, 0)');
      context.fillStyle = ambient;
      context.fillRect(0, 0, width, height);
    };

    const draw = (time: number) => {
      drawAmbient();

      if (time >= nextStrike) {
        bolt = createBolt(width, height, isCompact);
        flash = bolt.intensity;
        nextStrike = time + 3600 + Math.random() * 7200;
      }

      if (bolt && flash > 0.01) {
        const activeBolt = bolt;
        const glowAlpha = Math.min(flash * 0.16, 0.1);
        const coreAlpha = Math.min(flash * 0.78, 0.68);
        context.shadowBlur = 22 * flash;
        context.shadowColor = `${COLORS.glow}${glowAlpha})`;
        drawPath(context, activeBolt.points, COLORS.glow, glowAlpha, isCompact ? 3 : 4);
        drawPath(context, activeBolt.points, COLORS.primary, coreAlpha, isCompact ? 1.1 : 1.5);
        drawPath(context, activeBolt.points, COLORS.core, Math.min(flash * 0.35, 0.32), 0.45);
        activeBolt.branches.forEach((branch) => {
          drawPath(context, branch, COLORS.primary, coreAlpha * 0.58, isCompact ? 0.8 : 1);
        });
        context.shadowBlur = 0;
        flash *= 0.88;
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    if (prefersReducedMotion) {
      drawAmbient();
    } else {
      animationFrame = window.requestAnimationFrame(draw);
    }

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-scene h-full w-full opacity-75"
    />
  );
}
