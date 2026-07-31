import React, { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full px-6 md:px-20 py-8 flex justify-between items-center z-50 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'bg-white/10 backdrop-blur-md py-4 border-b border-white/20 text-slate-900' : 'text-white'}`}>
      <div className="font-extrabold text-2xl tracking-wide flex-1">
        DrainMaster
      </div>
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex list-none gap-8">
          <li><a href="#hero" className="font-medium text-sm hover:opacity-70 transition-opacity">Início</a></li>
          <li><a href="#historia" className="font-medium text-sm hover:opacity-70 transition-opacity">História</a></li>
          <li><a href="#problemas" className="font-medium text-sm hover:opacity-70 transition-opacity">Problemas</a></li>
          <li><a href="#solucoes" className="font-medium text-sm hover:opacity-70 transition-opacity">Soluções</a></li>
        </ul>
      </nav>
      <div className="flex-1 flex justify-end">
        <a href="#contato" className={`px-6 py-2 backdrop-blur-md border rounded-full font-semibold text-sm transition-colors ${scrolled ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' : 'bg-white/10 border-white/30 text-white hover:bg-white/30'}`}>
          Contatos
        </a>
      </div>
    </header>
  );
};

export default Header;
