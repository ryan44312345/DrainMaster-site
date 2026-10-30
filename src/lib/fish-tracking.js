// Limita a pupila a uma elipse dentro do olho, em unidades do SVG.
export const FISH_EYES = [
  // O peixe e espelhado: deslocamento local negativo aponta a direita da tela.
  { cx: 355, cy: 225, maxX: 18, maxLeft: 28, maxY: 17 },
  { cx: 500, cy: 188, maxX: 4, maxLeft: 12, maxY: 7 },
];

export function getPupilOffset(x, y, eye = FISH_EYES[0]) {
  const dx = x - eye.cx;
  const dy = y - eye.cy;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { x: 0, y: 0 };
  const strength = Math.min(1, distance / 160);
  const horizontalLimit = dx < 0 ? eye.maxLeft : eye.maxX;
  return { x: (dx / distance) * horizontalLimit * strength, y: (dy / distance) * eye.maxY * strength };
}
