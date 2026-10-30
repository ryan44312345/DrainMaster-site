import { useId } from 'react';
import './CurvedText.css';

export function CurvedText({
  text,
  radius = 150,
  fontSize = 28,
  spacing = 4,
  direction = 'up',
  mode = 'spacing',
  className = '',
  arcAngle = 180, // Angulo total: valores menores produzem uma curva suave.
  gradient, // Compatibilidade com o gradiente usado no login e cadastro.
}) {
  // IDs independentes permitem varias instancias na mesma pagina.
  const id = useId();
  const pathId = `curved-path-${id}`;
  const gradientId = `curved-gradient-${id}`;
  const angle = Math.max(1, Math.min(180, arcAngle));
  const halfAngle = (angle * Math.PI) / 360;
  const halfChord = radius * Math.sin(halfAngle);
  const rise = radius * (1 - Math.cos(halfAngle));
  const padding = fontSize * (angle < 180 ? 1.15 : 1.5);
  const horizontalPadding = angle < 180 ? fontSize * 0.2 : padding;
  const width = halfChord * 2 + horizontalPadding * 2;
  const height = rise + padding * 2;
  const down = direction === 'down';
  const cy = down ? padding + rise - radius : radius + padding;
  const cx = width / 2;
  const baseline = down ? padding : padding + rise;
  const path = `M ${horizontalPadding},${baseline} A ${radius},${radius} 0 0,${down ? 0 : 1} ${width - horizontalPadding},${baseline}`;

  // Segmenta caracteres visuais, mantendo acentos e emojis compostos juntos.
  const letters = Array.from(
    new Intl.Segmenter('pt-BR', { granularity: 'grapheme' }).segment(text),
    ({ segment }) => segment,
  );
  const middle = (letters.length - 1) / 2;

  // Converte tamanho + espacamento em graus. Limita o arco a 180 graus.
  const anglePerLetter = Math.min(
    ((fontSize * 0.65 + spacing) / radius) * (180 / Math.PI),
    letters.length > 1 ? angle / (letters.length - 1) : angle,
  );

  return (
    <svg className={`curved-text ${className}`} viewBox={`0 0 ${width} ${height}`}
      width="100%" overflow="visible" fill="currentColor" role="img" aria-label={text}
      style={gradient ? { fill: `url(#${gradientId})` } : undefined}>
      <defs>
        <path id={pathId} d={path} />
        {gradient && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        )}
      </defs>

      {mode === 'animated' ? (
        // O grupo externo posiciona; o interno anima sem apagar a rotacao.
        <g aria-hidden="true" fontSize={fontSize}>
          {letters.map((letter, index) => {
            const angle = (index - middle) * anglePerLetter;
            const radians = ((down ? 90 - angle : angle - 90) * Math.PI) / 180;
            const x = cx + radius * Math.cos(radians);
            const y = cy + radius * Math.sin(radians);
            return (
              <g key={index} transform={`translate(${x} ${y}) rotate(${down ? -angle : angle})`}>
                <g className="curved-text__entrance" style={{ '--letter-delay': `${index * 45}ms` }}>
                  <text className="curved-text__letter" textAnchor="middle" xmlSpace="preserve">{letter}</text>
                </g>
              </g>
            );
          })}
        </g>
      ) : (
        // Espacamento simples ou tspans independentes para estilos por letra.
        <text fontSize={fontSize} letterSpacing={spacing} aria-hidden="true" xmlSpace="preserve">
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {mode === 'styled'
              ? letters.map((letter, index) => (
                <tspan key={index} className={`curved-text__character curved-text__character--${index}`} data-letter-index={index}>{letter}</tspan>
              ))
              : text}
          </textPath>
        </text>
      )}
    </svg>
  );
}

// Exemplos:
// <CurvedText text="Caraguatatuba" mode="spacing" spacing={6} />
// <CurvedText text="Caraguatatuba" mode="styled" className="city-colors" />
// <CurvedText text="Caraguatatuba" mode="animated" direction="down" />
