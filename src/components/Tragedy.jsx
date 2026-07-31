import React from 'react';
import { CircularTestimonials } from './ui/circular-testimonials';

const slidesData = [
  {
    quote: "Em março de 1967, Caraguatatuba vivenciou uma das maiores catástrofes naturais da história do Brasil. Chuvas torrenciais ininterruptas provocaram a tromba d'água na Serra do Mar, desencadeando intensos deslizamentos de encosta. Centenas de moradias foram soterradas e vias de acesso ficaram totalmente bloqueadas.",
    name: "A TRAGÉDIA DE 1967",
    designation: "História & Memória",
    src: "/tragedia.jpg",
  },
  {
    quote: "O volume surreal de água fez o solo da serra liquefazer, arrastando rochas gigantescas, árvores centenárias e construções inteiras em direção ao mar. Com as estradas cortadas e a comunicação interrompida, a cidade ficou isolada do restante do estado por dias, exigindo missões de resgate.",
    name: "O IMPACTO E AS VÍTIMAS",
    designation: "Devastação & Isolamento",
    src: "/slide-2.jpg",
  },
  {
    quote: "Superando a dor da perda, a população de Caraguatatuba e voluntários de todo o país uniram forças para reconstruir as áreas urbanas devastadas. O evento transformou a engenharia civil e a conscientização sobre contenção de encostas no Brasil, tornando Caraguá um símbolo de resiliência.",
    name: "A RECONSTRUÇÃO DA CIDADE",
    designation: "União & Resiliência",
    src: "/slide-3.jpg",
  }
];

const Tragedy = () => {
  return (
    <section id="historia" className="relative bg-[#F7FAFC] py-24 md:py-36 px-6 md:px-16 overflow-hidden border-t-4 border-b-4 border-[#2C3A4E]">
      
      {/* Background SVG 1: Mountain slope & Landslide Crack Silhouette (Top Right) */}
      <svg 
        className="absolute top-0 right-0 w-[500px] h-[500px] text-[#253248]/50 pointer-events-none -z-0 translate-x-1/4 -translate-y-1/4"
        viewBox="0 0 500 500" 
        fill="currentColor"
      >
        <path d="M500,0 L350,150 L380,220 L280,310 L310,380 L180,500 L500,500 Z" />
        <path d="M300,100 L315,160 L270,220 L295,290 L240,360" stroke="#515964ff" strokeWidth="4" fill="none" strokeDasharray="8 6" />
      </svg>

      {/* Background SVG 2: Falling Rocks / Debris (Top Left) */}
      <svg 
        className="absolute top-12 left-10 w-48 h-48 text-[#2C3A4E]/40 pointer-events-none -z-0"
        viewBox="0 0 200 200" 
        fill="currentColor"
      >
        <polygon points="30,40 55,20 70,50 40,65" />
        <polygon points="120,70 145,55 160,85 130,100" />
        <polygon points="70,120 90,110 100,135 80,145" />
        <polygon points="15,150 35,140 45,160 25,170" />
        <line x1="45" y1="20" x2="25" y2="5" stroke="#475569" strokeWidth="3" />
        <line x1="135" y1="50" x2="115" y2="35" stroke="#475569" strokeWidth="3" />
        <line x1="80" y1="105" x2="65" y2="90" stroke="#475569" strokeWidth="2" />
      </svg>

      {/* Background SVG 3: Cracked Ground Fissure Line (Bottom) */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-24 text-[#2C3A4E]/60 pointer-events-none -z-0"
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3"
      >
        <path d="M0,100 L120,85 L200,105 L350,70 L480,95 L650,60 L800,100 L950,75 L1100,110 L1200,90" />
        <path d="M350,70 L380,115 M650,60 L630,110 M800,100 L825,120" strokeWidth="2" strokeDasharray="4 4" stroke="#3B4C66" />
      </svg>

      <div className="max-w-[1300px] mx-auto relative z-10 flex flex-col items-center justify-center">
        <CircularTestimonials
          testimonials={slidesData}
          autoplay={true}
          colors={{
            name: "#0a0a0a",
            designation: "#454545",
            testimony: "#171717",
            arrowBackground: "#141414",
            arrowForeground: "#F7FAFC",
            arrowHoverBackground: "#38BDF8",
          }}
          fontSizes={{
            name: "2rem",
            designation: "1rem",
            quote: "1.125rem",
          }}
        />
      </div>
    </section>
  );
};

export default Tragedy;

