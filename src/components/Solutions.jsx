import React from 'react';
import { ShieldAlert, Droplets, Wrench } from 'lucide-react';

const Solutions = () => {
  return (
    <section id="solucoes" className="relative py-40 px-6 md:px-12 max-w-[1400px] mx-auto bg-[#F7FAFC]">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-[3.5rem] font-extrabold mb-6 text-brand-text leading-[1.2]">
          Soluções para <span className="text-brand-accent">Caraguá</span>
        </h2>
        <p className="text-xl">Como podemos mitigar os impactos das chuvas e modernizar a cidade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
        <div className="p-12 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] relative bg-white/30 hover:bg-white/50 hover:-translate-y-4 hover:shadow-[0_25px_45px_rgba(15,28,52,0.1)] rounded-[24px]">
          <div className="w-[80px] h-[80px] bg-brand-highlight rounded-[30%_70%_70%_30%/30%_30%_70%_70%] flex items-center justify-center mb-8 text-brand-secondary animate-morph shadow-[inset_5px_5px_10px_rgba(255,255,255,0.5)]">
            <ShieldAlert size={40} />
          </div>
          <h3 className="text-3xl font-bold mb-4">Piscinões e Reservatórios</h3>
          <p className="text-lg">Construção de reservatórios de detenção para conter o volume excessivo de água das chuvas temporariamente, liberando-a aos poucos.</p>
        </div>

        <div className="p-12 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] relative bg-white/30 hover:bg-white/50 hover:-translate-y-4 hover:shadow-[0_25px_45px_rgba(15,28,52,0.1)] rounded-[24px]">
          <div className="w-[80px] h-[80px] bg-brand-highlight rounded-[30%_70%_70%_30%/30%_30%_70%_70%] flex items-center justify-center mb-8 text-brand-secondary animate-morph shadow-[inset_5px_5px_10px_rgba(255,255,255,0.5)]">
            <Droplets size={40} />
          </div>
          <h3 className="text-3xl font-bold mb-4">Jardins de Chuva</h3>
          <p className="text-lg">Implementação de áreas verdes estratégicas que absorvem a água da chuva, reduzindo o fluxo que vai para as galerias pluviais.</p>
        </div>

        <div className="p-12 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] relative bg-white/30 hover:bg-white/50 hover:-translate-y-4 hover:shadow-[0_25px_45px_rgba(15,28,52,0.1)] rounded-[24px]">
          <div className="w-[80px] h-[80px] bg-brand-highlight rounded-[30%_70%_70%_30%/30%_30%_70%_70%] flex items-center justify-center mb-8 text-brand-secondary animate-morph shadow-[inset_5px_5px_10px_rgba(255,255,255,0.5)]">
            <Wrench size={40} />
          </div>
          <h3 className="text-3xl font-bold mb-4">Desassoreamento</h3>
          <p className="text-lg">Programa permanente de limpeza e desassoreamento de rios, canais e galerias, garantindo que o sistema funcione na sua capacidade máxima.</p>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
