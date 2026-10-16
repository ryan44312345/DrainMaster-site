import React from 'react';
import imgBgFloresta from '../assets/image.png';

const Footer = () => {
  return (
    <footer id="contato" className="relative text-white pt-16 px-6 md:px-12 pb-0 overflow-hidden">
      
      {/* Imagem de fundo (mesma da seção Soluções) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imgBgFloresta} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between max-w-[1400px] mx-auto border-b border-white/15 pb-12 mb-6 gap-12">
        
        {/* Coluna 1 — Logo */}
        <div className="md:max-w-[280px]">
          <h2 className="text-3xl font-bold text-brand-accent italic mb-3 font-serif">DrainMaster</h2>
          <p className="text-white/70 text-sm">Projeto de conscientização e infraestrutura.</p>
        </div>
        
        {/* Coluna 2 — Navegação */}
        <div>
          <h4 className="text-brand-accent text-base font-semibold mb-5">Navegação</h4>
          <ul className="list-none space-y-3">
            <li><a href="#hero" className="text-white/70 text-sm no-underline hover:text-white transition-colors">Início</a></li>
            <li><a href="#historia" className="text-white/70 text-sm no-underline hover:text-white transition-colors">1967</a></li>
            <li><a href="#problemas" className="text-white/70 text-sm no-underline hover:text-white transition-colors">Problemas</a></li>
          </ul>
        </div>
        
        {/* Coluna 3 — Contato */}
        <div>
          <h4 className="text-brand-accent text-base font-semibold mb-5">Contato</h4>
          <ul className="list-none text-white/70 text-sm space-y-3">
            <li>Prefeitura de Caraguatatuba</li>
            <li>Defesa Civil: 199</li>
            <li>Bombeiros: 193</li>
          </ul>
        </div>

        {/* Coluna 4 — Redes + Newsletter */}
        <div className="md:max-w-[260px]">
          <h4 className="text-brand-accent text-base font-semibold mb-5">Redes</h4>
          <div className="flex items-center gap-4 mb-6">
            {/* Instagram */}
            <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* Threads / X */}
            <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Threads">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>

          <h4 className="text-brand-accent text-base font-semibold mb-3">Newsletter</h4>
          <div className="flex gap-2 mb-2">
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              className="flex-1 bg-transparent border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-brand-accent transition-colors"
            />
            <button className="bg-brand-accent cursor-pointer text-black font-bold text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Cadastrar
            </button>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">
            Receba atualizações sobre o projeto e ações de conscientização.
          </p>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="relative z-10 text-center text-white/50 text-sm pb-6">
        <p>&copy; 2026 drainmaster. Todos os direitos reservados.</p>
      </div>

      {/* Texto gigante DRAINMASTER */}
      <div className="relative z-10 w-full overflow-hidden select-none pointer-events-none" style={{ marginBottom: '-0.15em' }}>
        <h2 
          className="text-[13vw] font-bold leading-none tracking-tight text-center whitespace-nowrap font-serif text-white/90"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)'
          }}
        >
          DRAINMASTER
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
