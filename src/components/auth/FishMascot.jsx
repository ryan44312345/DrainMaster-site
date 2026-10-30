import { useEffect, useId, useMemo, useRef } from 'react';
import fishSvg from '../../assets/auth/peixe-esqueleto-interativo.svg?raw';
import { FISH_EYES, getPupilOffset } from '../../lib/fish-tracking';

export function FishMascot({ className = '' }) {
  const svgRef = useRef(null);
  const mirrorRef = useRef(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // Conteudo vetorial local e confiavel; nunca recebe SVG enviado pela rede.
  // Prefixos evitam conflitos de gradientes e clipPaths entre instancias.
  const markup = useMemo(() => fishSvg
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    .replace(/id="([^"]+)"/g, (_, value) => `id="${id}-${value}"`)
    .replace(/href="#([^"]+)"/g, (_, value) => `href="#${id}-${value}"`)
    .replace(/url\(#([^)]+)\)/g, (_, value) => `url(#${id}-${value})`), [id]);

  useEffect(() => {
    const svg = svgRef.current;
    const mirror = mirrorRef.current;
    const pupils = Array.from(mirror.querySelectorAll('[data-fish-pupil]'));
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    let previousTime = 0;
    let pointer = null;
    const eyes = pupils.map((node, index) => ({ node, geometry: FISH_EYES[index], x: 0, y: 0, targetX: 0, targetY: 0 }));

    function paint() {
      eyes.forEach((eye) => eye.node.setAttribute('transform', `translate(${eye.x} ${eye.y})`));
    }
    function updateTargets() {
      if (!pointer) return;
      // Recalcula enquanto nada: a matriz inclui a posicao atual da flutuacao.
      const matrix = mirror.getScreenCTM();
      if (!matrix) return;
      const point = svg.createSVGPoint();
      point.x = pointer.x;
      point.y = pointer.y;
      let local;
      try { local = point.matrixTransform(matrix.inverse()); }
      catch { return; }
      if (!Number.isFinite(local.x) || !Number.isFinite(local.y)) return;
      eyes.forEach((eye) => {
        const target = getPupilOffset(local.x, local.y, eye.geometry);
        eye.targetX = target.x;
        eye.targetY = target.y;
      });
    }
    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = 0;
    }
    function animate(time) {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 1 / 30) : 1 / 60;
      previousTime = time;
      const blend = 1 - Math.exp(-14 * dt);
      updateTargets();
      let moving = false;
      eyes.forEach((eye) => {
        eye.x += (eye.targetX - eye.x) * blend;
        eye.y += (eye.targetY - eye.y) * blend;
        if (Math.hypot(eye.targetX - eye.x, eye.targetY - eye.y) < 0.01) {
          eye.x = eye.targetX;
          eye.y = eye.targetY;
        } else moving = true;
      });
      if (moving || pointer) frame = requestAnimationFrame(animate);
      else stop();
      paint();
    }
    function start() {
      if (frame === null) frame = requestAnimationFrame(animate);
    }
    function reset() {
      pointer = null;
      eyes.forEach((eye) => { eye.targetX = eye.targetY = 0; });
      if (media.matches) { stop(); eyes.forEach((eye) => { eye.x = eye.y = 0; }); paint(); }
      else start();
    }
    function updateMotionPreference() {
      // SMIL controla so as barbatanas; a flutuacao externa continua no CSS.
      svg.setCurrentTime(0);
      if (media.matches) svg.pauseAnimations();
      else svg.unpauseAnimations();
      reset();
    }
    function move(event) {
      if (media.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      start();
    }

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointercancel', reset);
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('pointerleave', reset);
    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);
    return () => {
      stop();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointercancel', reset);
      window.removeEventListener('blur', reset);
      document.documentElement.removeEventListener('pointerleave', reset);
      media.removeEventListener('change', updateMotionPreference);
    };
  }, [markup]);

  return (
    <svg ref={svgRef} className={className} viewBox="140 20 395 620"
      width="100%" aria-hidden="true" focusable="false">
      {/* Espelha em torno do centro horizontal do viewBox, sem mover o painel. */}
      <g ref={mirrorRef} transform="translate(675 0) scale(-1 1)"
        dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  );
}
