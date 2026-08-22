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
  width: number;
}

const crimson = 'rgba(179, 24, 58,';

function createBolt(width: number, height: number): Bolt {
  const fromLeft = Math.random() > 0.42;
  const start: Point = {
    x: fromLeft ? -width * 0.08 : width * (0.2 + Math.random() * 0.6),
    y: height * (0.18 + Math.random() * 0.58),
  };
  const end: Point = {
    x: fromLeft ? width * (0.62 + Math.random() * 0.34) : width * (0.82 + Math.random() * 0.14),
    y: start.y + (Math.random() - 0.5) * height * 0.3,
  };
  const points: Point[] = [start];
  const segments = 7 + Math.floor(Math.random() * 5);

  for (let index = 1; index <= segments; index += 1) {
    const progress = index / segments;
    points.push({
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress + (Math.random() - 0.5) * height * 0.12,
    });
  }

  const branches = points.slice(2, -1).reduce<Point[][]>((result, point, index) => {
    if (Math.random() > 0.62) return result;

    const branch: Point[] = [point];
    const direction = index % 2 === 0 ? -1 : 1;
    const length = width * (0.06 + Math.random() * 0.12);
    branch.push({
      x: point.x + length * (0.45 + Math.random() * 0.55),
      y: point.y + direction * height * (0.06 + Math.random() * 0.12),
    });
    if (Math.random() > 0.45) {
      const last = branch[1];
      if (last) {
        branch.push({ x: last.x + length * 0.3, y: last.y + direction * height * 0.04 });
      }
    }
    result.push(branch);
    return result;
  }, []);

  return {
    points,
    branches,
    intensity: 0.35 + Math.random() * 0.45,
    width: 0.7 + Math.random() * 1.1,
  };
}

function drawPath(context: CanvasRenderingContext2D, points: Point[], alpha: number, width: number) {
  const firstPoint = points[0];
  if (!firstPoint || points.length < 2) return;
  context.beginPath();
  context.moveTo(firstPoint.x, firstPoint.y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.strokeStyle = `${crimson} ${alpha})`;
  context.lineWidth = width;
  context.stroke();
}

export function AboutAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let bolt: Bolt | null = null;
    let glow = 0;
    let nextStrike = performance.now() + 1600 + Math.random() * 4200;

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const ambient = context.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.72);
      ambient.addColorStop(0, 'rgba(83, 8, 28, 0.12)');
      ambient.addColorStop(0.58, 'rgba(42, 5, 16, 0.045)');
      ambient.addColorStop(1, 'rgba(10, 9, 8, 0)');
      context.fillStyle = ambient;
      context.fillRect(0, 0, width, height);

      if (prefersReducedMotion) return;

      if (time >= nextStrike) {
        bolt = createBolt(width, height);
        glow = bolt.intensity;
        nextStrike = time + 2600 + Math.random() * 6800;
      }

      if (glow > 0.01 && bolt) {
        const activeBolt = bolt;
        const fade = Math.min(glow, 0.035);
        glow -= fade;
        context.shadowBlur = 18 * glow;
        context.shadowColor = `${crimson} ${glow})`;
        drawPath(context, activeBolt.points, glow * 0.8, activeBolt.width + 2);
        drawPath(context, activeBolt.points, Math.min(glow + 0.18, 0.7), activeBolt.width);
        activeBolt.branches.forEach((branch) => drawPath(context, branch, glow * 0.62, activeBolt.width * 0.7));
        context.shadowBlur = 0;
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    if (prefersReducedMotion) {
      draw(0);
    } else {
      animationFrame = window.requestAnimationFrame(draw);
    }

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90" />;
}