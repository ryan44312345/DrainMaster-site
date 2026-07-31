import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-brand-secondary text-white pt-24 px-6 md:px-12 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[20px] bg-brand-primary rounded-b-[50%]"></div>
      
      <div className="flex flex-col md:flex-row justify-between max-w-[1400px] mx-auto border-b border-white/10 pb-16 mb-8 gap-12">
        <div>
          <h2 className="text-4xl font-bold text-brand-primary mb-4">Caraguá Segura</h2>
          <p className="text-lg">Projeto de conscientização e infraestrutura.</p>
        </div>
        
        <div>
          <h4 className="text-brand-highlight text-xl font-semibold mb-6">Navegação</h4>
          <ul className="list-none">
            <li className="mb-3"><a href="#hero" className="text-white/80 no-underline hover:text-brand-primary transition-colors">Início</a></li>
            <li className="mb-3"><a href="#historia" className="text-white/80 no-underline hover:text-brand-primary transition-colors">1967</a></li>
            <li className="mb-3"><a href="#problemas" className="text-white/80 no-underline hover:text-brand-primary transition-colors">Problemas</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-brand-highlight text-xl font-semibold mb-6">Contato</h4>
          <ul className="list-none text-white/80">
            <li className="mb-3">Prefeitura de Caraguatatuba</li>
            <li className="mb-3">Defesa Civil: 199</li>
            <li className="mb-3">Bombeiros: 193</li>
          </ul>
        </div>
      </div>
      
      <div className="text-center text-white/60 text-base">
        <p>&copy; 2026 Caraguá Segura. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
