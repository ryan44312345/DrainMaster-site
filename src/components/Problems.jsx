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
    tags: ['URBANISMO', '0 -> 1']
  },
  {
    id: 2,
    title: 'Assoreamento',
    subtitle: 'PROJETO 03',
    date: 'JUN 28, 2025',
    description: 'Os rios e canais que cortam a cidade sofrem com o assoreamento e o acúmulo de lixo irregular, reduzindo sua capacidade de escoamento e causando transbordamentos.',
    image: '/problems/img3.png',
    color: '#F1B434', // Yellow
    textColor: '#1A1A1A',
    tags: ['MEIO AMBIENTE', '0 -> 1']
  }
];

const clipPaths = [
  "polygon(0% 0%, 28% 0%, 31% 60px, 100% 60px, 100% 100%, 0% 100%)",
  "polygon(0% 60px, 31% 60px, 34% 0%, 61% 0%, 64% 60px, 100% 60px, 100% 100%, 0% 100%)",
  "polygon(0% 60px, 64% 60px, 67% 0%, 94% 0%, 97% 60px, 100% 60px, 100% 100%, 0% 100%)"
];

const tabPositions = [
  "left-[0%] w-[31%]",
  "left-[31%] w-[33%]",
  "left-[64%] w-[33%]"
];

const Problems = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = cardsRef.current;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=350%", // Increased scroll distance for smoother animation and longer hold
          scrub: true,
          pin: true,
        }
      });

      cards.forEach((card, index) => {
        if (index > 0) {
          // Set initial position completely off-screen
          gsap.set(card, { y: window.innerHeight });
          // Animate to perfectly overlap (y: 0)
          tl.to(card, {
            y: 0, 
            ease: "none",
            duration: 1
          });
        } else {
          gsap.set(card, { y: 0 });
        }
      });

      // Add a pause/hold at the end of the timeline
      // This ensures the cards stay perfectly stacked for a while before the section unpins
      tl.to({}, { duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problemas" ref={containerRef} className="relative h-screen bg-[#F7FAFC] overflow-hidden">
      
      <div className="absolute top-0 w-full pt-8 px-6 z-0 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-2 text-center tracking-tight">Problemas da Infraestrutura</h2>
      </div>

      <div className="relative w-full max-w-[90vw] h-[80vh] mx-auto mt-[15vh]">
        {problemsData.map((prob, index) => (
          <div 
            key={prob.id}
            ref={el => cardsRef.current[index] = el}
            className="absolute top-0 left-0 w-full h-full will-change-transform font-sans"
            style={{ 
              backgroundColor: prob.color, 
              color: prob.textColor,
              zIndex: index + 1,
              clipPath: clipPaths[index]
            }}
          >
            {/* Tab Label */}
            <div className={`absolute top-0 h-[60px] flex items-center justify-center ${tabPositions[index]}`}>
               <span className="font-bold text-xs md:text-sm tracking-widest flex items-center gap-2 uppercase">
                  <div className="w-3 h-3 bg-current" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 66% 0, 66% 33%, 33% 33%, 33% 66%, 0 66%)' }}></div>
                  {prob.subtitle}
               </span>
            </div>

            {/* Card Body */}
            <div className="absolute top-[60px] left-0 w-full h-[calc(100%-60px)] px-6 py-8 md:px-12 md:py-12 flex flex-col-reverse md:flex-row gap-8 items-stretch">
              
              {/* Left Column */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-wider">
                      <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                      {prob.date}
                   </div>
                   <h3 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight leading-none" style={{ color: prob.textColor }}>{prob.title}</h3>
                   <p className="max-w-md text-lg md:text-xl font-medium opacity-90 leading-relaxed mb-8">{prob.description}</p>
                   
                   <a href="#" className="inline-block font-bold text-sm tracking-widest border-b-2 border-current pb-1 w-max uppercase hover:opacity-70 transition-opacity">
                     Ver Detalhes ↗
                   </a>
                </div>

                {/* Bottom Tags */}
                <div className="flex gap-2 mt-8 hidden md:flex">
                  {prob.tags.map(tag => (
                     <div key={tag} className="bg-[#1A1A1A] text-[#F1B434] text-xs font-bold px-4 py-2 uppercase" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' }}>
                        {tag}
                     </div>
                  ))}
                </div>
              </div>

              {/* Right Column (Image) */}
              <div className="w-full md:flex-[1.2] h-[250px] md:h-full relative border-[3px] border-current p-1.5 md:p-3">
                 {/* Border Corner Accents */}
                 <div className="absolute top-[-5px] left-[-5px] w-2.5 h-2.5 border-[3px] border-current bg-transparent"></div>
                 <div className="absolute top-[-5px] right-[-5px] w-2.5 h-2.5 border-[3px] border-current bg-transparent"></div>
                 <div className="absolute bottom-[-5px] left-[-5px] w-2.5 h-2.5 border-[3px] border-current bg-transparent"></div>
                 <div className="absolute bottom-[-5px] right-[-5px] w-2.5 h-2.5 border-[3px] border-current bg-transparent"></div>
                 
                 <img 
                   src={prob.image} 
                   alt={prob.title} 
                   className="w-full h-full object-cover grayscale-[20%] contrast-125" 
                 />
                 <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-[#1A1A1A] text-[#F1B434] text-xs font-bold px-3 py-1.5 flex items-center gap-2">
                   <span className="border border-[#F1B434] px-1.5 py-0.5 text-[10px]">JPG</span> IMAGE.JPG
                 </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Problems;
