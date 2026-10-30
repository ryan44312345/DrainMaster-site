import { useEffect, useMemo, useRef } from 'react';
import './CurvedTextInteractive.css';

export function CurvedTextInteractive({
  text,
  radius = 120,
  fontSize = 28,
  anglePerLetter = 10,
  mode = 'proximity',
  influence = 80,
  className = '',
}) {
  const svgRef = useRef(null);
  const groupRef = useRef(null);
  const circleRef = useRef(null);
  const letterRefs = useRef([]);
  const handlers = useRef({});
  const padding = fontSize * 1.5;
  const cx = radius + padding;
  const cy = radius + padding;
  const size = (radius + padding) * 2;

  // As letras so sao recalculadas quando o texto ou a geometria mudam.
  const letters = useMemo(() => {
    const characters = Array.from(
      new Intl.Segmenter('pt-BR', { granularity: 'grapheme' }).segment(text),
      ({ segment }) => segment,
    );
    const middle = (characters.length - 1) / 2;
    return characters.map((character, index) => {
      const angle = (index - middle) * anglePerLetter;
      const rad = ((angle - 90) * Math.PI) / 180;
      return { character, angle, x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
    });
  }, [text, radius, anglePerLetter, cx, cy]);

  useEffect(() => {
    const svg = svgRef.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    let lastTime = 0;
    let active = false;
    let angle = 0;
    let targetAngle = 0;
    const scales = letters.map(() => 1);
    const targets = letters.map(() => 1);
    const cursor = { x: cx, y: cy, targetX: cx, targetY: cy, vx: 0, vy: 0 };

    function paint() {
      letterRefs.current.forEach((node, index) => {
        if (node) node.style.transform = `scale(${scales[index] ?? 1})`;
      });
      groupRef.current?.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
      circleRef.current?.setAttribute('cx', String(cursor.x));
      circleRef.current?.setAttribute('cy', String(cursor.y));
      if (circleRef.current) circleRef.current.style.opacity = active && mode === 'follow' ? '0.2' : '0';
    }

    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = 0;
    }

    // Restauracao imediata tambem usada se movimento reduzido for ativado.
    function restore() {
      stop();
      active = false;
      angle = targetAngle = 0;
      scales.fill(1);
      targets.fill(1);
      Object.assign(cursor, { x: cx, y: cy, targetX: cx, targetY: cy, vx: 0, vy: 0 });
      paint();
    }

    function animate(time) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 1 / 30) : 1 / 60;
      lastTime = time;
      const blend = 1 - Math.exp(-12 * dt);
      let moving = false;

      scales.forEach((scale, index) => {
        scales[index] = scale + (targets[index] - scale) * blend;
        if (Math.abs(targets[index] - scales[index]) > 0.001) moving = true;
        else scales[index] = targets[index];
      });

      // Usa o menor percurso angular ao atravessar a fronteira de 180 graus.
      const delta = ((targetAngle - angle + 180) % 360 + 360) % 360 - 180;
      angle += delta * blend;
      if (Math.abs(delta) > 0.01) moving = true;
      else angle = targetAngle;

      // Mola amortecida sem biblioteca: aceleracao = deslocamento * k - velocidade * amortecimento.
      cursor.vx += ((cursor.targetX - cursor.x) * 150 - cursor.vx * 20) * dt;
      cursor.vy += ((cursor.targetY - cursor.y) * 150 - cursor.vy * 20) * dt;
      cursor.x += cursor.vx * dt;
      cursor.y += cursor.vy * dt;
      if (Math.hypot(cursor.targetX - cursor.x, cursor.targetY - cursor.y) > 0.1 || Math.hypot(cursor.vx, cursor.vy) > 0.1) moving = true;
      else Object.assign(cursor, { x: cursor.targetX, y: cursor.targetY, vx: 0, vy: 0 });

      paint();
      if (moving) frame = requestAnimationFrame(animate);
      else { frame = null; lastTime = 0; }
    }

    function start() {
      if (frame === null && !media.matches) frame = requestAnimationFrame(animate);
    }

    function move(event) {
      if (media.matches) return;
      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      let mouse;
      try { mouse = point.matrixTransform(matrix.inverse()); }
      catch { return; }
      if (!Number.isFinite(mouse.x) || !Number.isFinite(mouse.y)) return;
      active = true;

      if (mode === 'proximity') {
        letters.forEach((letter, index) => {
          const distance = Math.hypot(mouse.x - letter.x, mouse.y - letter.y);
          targets[index] = 1 + Math.max(0, 1 - distance / Math.max(1, influence)) * 0.35;
        });
      } else if (mode === 'rotate') {
        if (Math.hypot(mouse.x - cx, mouse.y - cy) > 0.1) {
          targetAngle = Math.atan2(mouse.y - cy, mouse.x - cx) * 180 / Math.PI + 90;
        }
      } else if (mode === 'follow') {
        cursor.targetX = mouse.x;
        cursor.targetY = mouse.y;
      }
      start();
    }

    function leave() {
      active = false;
      targets.fill(1);
      targetAngle = 0;
      cursor.targetX = cx;
      cursor.targetY = cy;
      if (media.matches) restore();
      else start();
    }

    restore();
    handlers.current = { move, leave };
    media.addEventListener('change', restore);
    return () => {
      stop();
      media.removeEventListener('change', restore);
      handlers.current = {};
    };
  }, [letters, mode, influence, cx, cy]);

  return (
    <svg ref={svgRef} className={`curved-text-interactive ${className}`}
      viewBox={`0 0 ${size} ${size}`} width="100%" overflow="visible"
      fill="currentColor" role="img" aria-label={text}
      onPointerMove={(event) => handlers.current.move?.(event)}
      onPointerLeave={() => handlers.current.leave?.()}
      onPointerCancel={() => handlers.current.leave?.()}>
      {/* Area transparente recebe o ponteiro tambem entre as letras. */}
      <rect width={size} height={size} fill="transparent" pointerEvents="all" aria-hidden="true" />
      <circle ref={circleRef} cx={cx} cy={cy} r={fontSize * 0.6}
        className="curved-text-interactive__cursor" opacity="0" aria-hidden="true" />
      <g ref={groupRef} aria-hidden="true" fontSize={fontSize}>
        {letters.map((letter, index) => (
          // Rotacao no grupo; escala no texto. As transformacoes nao se sobrescrevem.
          <g key={index} transform={`rotate(${letter.angle} ${letter.x} ${letter.y})`}>
            <text ref={(node) => { letterRefs.current[index] = node; }}
              className="curved-text-interactive__letter" x={letter.x} y={letter.y}
              textAnchor="middle" xmlSpace="preserve">{letter.character}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// <CurvedTextInteractive text="Caraguatatuba" mode="proximity" influence={100} />
// <CurvedTextInteractive text="Siga o cursor" mode="rotate" />
// <CurvedTextInteractive text="Ola, mundo!" mode="follow" />
