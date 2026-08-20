import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const problemsData = [
  {
    id: 0,
    title: 'Falta de Drenagem',
    subtitle: 'PROJETO 01',
    date: 'JAN 2, 2025',
    description: 'A ausência de um sistema eficiente de drenagem pluvial faz com que as águas das chuvas acumulem rapidamente nas vias, agravando os alagamentos nas regiões mais baixas de Caraguatatuba.',
    image: '/problems/img1.png',
    color: '#57BEE6', // Cyan
    textColor: '#1A1A1A',
    tags: ['INFRAESTRUTURA', '0 -> 1']
  },
  {
    id: 1,
    title: 'Solo Impermeável',
    subtitle: 'PROJETO 02',
    date: 'MAR 14, 2025',
    description: 'O crescimento urbano desordenado reduziu as áreas verdes, impermeabilizando o solo com asfalto e concreto, impedindo a absorção natural da água.',
    image: '/problems/img2.png',
    color: '#1A1A1A', // Dark
    textColor: '#FFFFFF',
    tags: ['URBANISMO', '1 -> 2']
  }
];

const getBodyRadius = (index) => {
  if (index === 0) return '0 24px 24px 24px';
  if (index === 1) return '24px 24px 24px 24px';
  if (index === 2) return '24px 0 24px 24px';
  return '24px';
};

const getTabStyle = (index, prob) => {
  const baseStyle = {
    backgroundColor: prob.color,
    color: prob.textColor,
    borderRadius: '24px 24px 0 0'
  };
  
  if (index === 0) {
    return { ...baseStyle, width: '33.5%', left: 0 };
  }
  if (index === 1) {
    return { ...baseStyle, width: '33.5%', left: '33.25%' };
  }
  return { ...baseStyle, width: '33.5%', right: 0 };
};

const SVGNoise = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none mix-blend-overlay z-0" style={{ borderRadius: 'inherit' }}>
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const Problems = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const dotsRef = useRef([]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const dots = dotsRef.current.filter(Boolean);
      
      const updateDots = (activeIdx) => {
        dots.forEach((dot, i) => {
          if (i === activeIdx) {
            gsap.to(dot, { opacity: 1, scale: 1.3, duration: 0.3, ease: "power2.out" });
          } else {
            gsap.to(dot, { opacity: 0.3, scale: 1, duration: 0.3, ease: "power2.out" });
          }
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=350%",
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        }
      });

      tl.add(() => updateDots(0), 0);

      cards.forEach((card, index) => {
        if (index > 0) {
          gsap.set(card, { y: window.innerHeight, transformOrigin: 'top center' });
          
          tl.to(card, {
            y: 0, 
            ease: "none",
            duration: 1,
            onStart: () => updateDots(index),
            onReverseComplete: () => updateDots(index - 1)
          });

          for (let i = 0; i < index; i++) {
             tl.to(cards[i], {
                y: -((index - i) * 40),
                ease: "none",
                duration: 1
             }, "<");
             
             tl.to(cards[i].querySelectorAll('.card-overlay'), {
                opacity: (index - i) * 0.3,
                ease: "none",
                duration: 1
             }, "<");
          }
        } else {
          gsap.set(card, { y: 0, transformOrigin: 'top center' });
        }
      });

      tl.to({}, { duration: 1.5 });

    }, containerRef);

    // Força o ScrollTrigger recalcular após imagens/fontes carregarem
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    // Fallback: recalcula após um pequeno delay caso 'load' já tenha disparado
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section id="problemas" ref={containerRef} className="relative h-screen bg-[#F7FAFC] overflow-hidden pb-5">
      
      {/* Side Progress Indicator */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {[0, 1, 2].map((i) => (
          <div 
            key={`dot-${i}`}
            ref={el => dotsRef.current[i] = el}
            className="w-3 h-3 rounded-full bg-[#1A1A1A] transition-all"
            style={{ opacity: i === 0 ? 1 : 0.3, transform: i === 0 ? 'scale(1.3)' : 'scale(1)' }}
          />
        ))}
      </div>

      <div className="absolute top-0 w-full pt-8 px-6 z-0 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-2 text-center tracking-tight">Problemas da Infraestrutura</h2>
      </div>

      <div className="relative w-full max-w-[90vw] h-[80vh] mx-auto mt-[15vh]">
        {/* Cards 1 e 2 — gerados a partir do JSON */}
        {problemsData.map((prob, index) => (
          <div 
            key={prob.id}
            ref={el => cardsRef.current[index] = el}
            className="absolute top-0 left-0 w-full h-full will-change-transform flex flex-col"
            style={{ 
              zIndex: index + 1
            }}
          >
            
            {/* Tab Label */}
            <div className="h-[60px] w-full relative z-10 pointer-events-none">
              <div 
                className="absolute bottom-0 h-full flex items-center justify-center shadow-[0_-15px_30px_rgba(0,0,0,0.15)] pointer-events-auto"
                style={getTabStyle(index, prob)}
              >
                 <SVGNoise />
                 <div className="card-overlay absolute inset-0 bg-black pointer-events-none z-0" style={{ opacity: 0, borderRadius: 'inherit' }}></div>
                 <span className="font-bold text-xs md:text-sm tracking-widest flex items-center gap-2 uppercase relative z-10">
                    <div className="w-3 h-3 bg-current" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 66% 0, 66% 33%, 33% 33%, 33% 66%, 0 66%)' }}></div>
                    {prob.subtitle}
                 </span>
              </div>
            </div>

            {/* Card Body */}
            <div 
              className="flex-1 w-full relative px-6 py-8 md:px-12 md:py-12 flex flex-col-reverse md:flex-row gap-8 items-stretch shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
              style={{
                backgroundColor: prob.color,
                color: prob.textColor,
                borderRadius: getBodyRadius(index)
              }}
            >
              <SVGNoise />
              <div className="card-overlay absolute inset-0 bg-black pointer-events-none z-0" style={{ opacity: 0, borderRadius: 'inherit' }}></div>
              
              {/* Giant Ghost Number */}
              <div 
                className="absolute bottom-4 left-8 md:bottom-10 md:left-12 text-[12rem] md:text-[20rem] font-bold leading-none pointer-events-none tracking-tighter"
                style={{ opacity: 0.05, color: prob.textColor, zIndex: 1 }}
              >
                0{index + 1}
              </div>

              {/* Left Column */}
              <div className="flex-1 flex flex-col justify-between relative z-20">
                <div>
                   <div className="flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-wider">
                      <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                      {prob.date}
                   </div>
                   <h3 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight leading-none" style={{ color: prob.textColor }}>{prob.title}</h3>
                   <p className="max-w-md text-lg md:text-xl font-medium opacity-90 leading-relaxed mb-8">{prob.description}</p>
                </div>

                {/* Footer Status Bar */}
                <div className="mt-8 hidden md:flex items-center gap-4">
                  <div 
                    className="text-xs font-bold px-4 py-2 uppercase rounded-full"
                    style={{ backgroundColor: prob.textColor, color: prob.color }}
                  >
                    {prob.tags[0]}
                  </div>
                  
                  {/* Progress Bar Line */}
                  <div className="flex-1 max-w-[200px] h-1 bg-current opacity-20 rounded-full relative">
                     <div className="absolute left-0 top-0 h-full bg-current opacity-100 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                     {prob.tags[1]}
                  </span>
                </div>
              </div>

              {/* Right Column (Image) */}
              <div 
                className="w-full md:flex-[1.2] h-[250px] md:h-full relative rounded-[20px] overflow-hidden border"
                style={{ borderColor: prob.textColor, borderWidth: '1px', zIndex: 20 }}
              >
                 <img 
                   src={prob.image} 
                   alt={prob.title} 
                   className="w-full h-full object-cover grayscale-[20%] contrast-125 relative z-0" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none z-10"></div>
              </div>

            </div>
          </div>
        ))}

        {/* Card 3 — PROJETO 03 — escrito diretamente no JSX, sem JSON */}
        <div 
          ref={el => cardsRef.current[2] = el}
          className="absolute top-0 left-0 w-full h-auto will-change-transform flex flex-col"
          style={{ zIndex: 3 }}
        >
          {/* Tab Label */}
          <div className="h-[60px] w-full relative z-10 pointer-events-none">
            <div 
              className="absolute bottom-0 h-full flex items-center justify-center shadow-[0_-15px_30px_rgba(0,0,0,0.15)] pointer-events-auto"
              style={{
                backgroundColor: '#EAD4A7',
                color: '#1A1A1A',
                borderRadius: '24px 24px 0 0',
                width: '33.5%',
                right: 0
              }}
            >
               <SVGNoise />
               <div className="card-overlay absolute inset-0 bg-black pointer-events-none z-0" style={{ opacity: 0, borderRadius: 'inherit' }}></div>
               <span className="font-bold text-xs md:text-sm tracking-widest flex items-center gap-2 uppercase relative z-10">
                  <div className="w-3 h-3 bg-current" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 66% 0, 66% 33%, 33% 33%, 33% 66%, 0 66%)' }}></div>
                  PROJETO 03
               </span>
            </div>
          </div>

          {/* Card Body */}
          <div 
            className="flex-1 w-full relative px-6 py-8 md:px-12 md:py-12 flex flex-col-reverse md:flex-row gap-8 items-stretch shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
            style={{
              backgroundColor: '#EAD4A7',
              color: '#1A1A1A',
              borderRadius: '24px 0 24px 24px'
            }}
          >
            <SVGNoise />
            <div className="card-overlay absolute inset-0 bg-black pointer-events-none z-0" style={{ opacity: 0, borderRadius: 'inherit' }}></div>
            
            {/* Giant Ghost Number */}
            <div 
              className="absolute bottom-4 left-8 md:bottom-10 md:left-12 text-[12rem] md:text-[20rem] font-bold leading-none pointer-events-none tracking-tighter"
              style={{ opacity: 0.05, color: '#1A1A1A', zIndex: 1 }}
            >
              03
            </div>

            {/* Left Column */}
            <div className="flex-1 flex flex-col justify-between relative z-20">
              <div>
                 <div className="flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-wider">
                    <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                    JUN 28, 2025
                 </div>
                 <h3 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight leading-none" style={{ color: '#1A1A1A' }}>Assoreamento</h3>
                 <p className="max-w-md text-lg md:text-xl font-medium opacity-90 leading-relaxed mb-8">Os rios e canais que cortam a cidade sofrem com o assoreamento e o acúmulo de lixo irregular, reduzindo sua capacidade de escoamento e causando transbordamentos.</p>
              </div>

              {/* Footer Status Bar */}
              <div className="mt-8 hidden md:flex items-center gap-4">
                <div 
                  className="text-xs font-bold px-4 py-2 uppercase rounded-full"
                  style={{ backgroundColor: '#1A1A1A', color: '#EAD4A7' }}
                >
                  MEIO AMBIENTE
                </div>
                
                {/* Progress Bar Line */}
                <div className="flex-1 max-w-[200px] h-1 bg-current opacity-20 rounded-full relative">
                   <div className="absolute left-0 top-0 h-full bg-current opacity-100 rounded-full" style={{ width: '50%' }}></div>
                </div>
                
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                   2 -&gt; 3
                </span>
              </div>
            </div>

            {/* Right Column (Image) */}
            <div 
              className="w-full md:flex-[1.2] h-[250px] md:h-full relative rounded-[20px] overflow-hidden border"
              style={{ borderColor: '#1A1A1A', borderWidth: '1px', zIndex: 20 }}
            >
               <img 
                 src="/problems/img3.png" 
                 alt="Assoreamento" 
                 className="w-full h-full object-cover grayscale-[20%] contrast-125 relative z-0" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none z-10"></div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Problems;
