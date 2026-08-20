import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router';

const Jogo = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen();
      } else if (gameContainerRef.current.webkitRequestFullscreen) {
        gameContainerRef.current.webkitRequestFullscreen();
      } else if (gameContainerRef.current.msRequestFullscreen) {
        gameContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col pt-8 pb-12 px-4 md:px-12 bg-blue-50/50">
      {/* Background organic blobs (matching the comp) */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[50vh] bg-blue-200/50 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[45vh] bg-orange-200/50 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[40vw] h-[40vh] bg-cyan-200/50 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between mb-8">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-white/60 transition-colors text-slate-800 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-display text-slate-800 absolute left-1/2 -translate-x-1/2">
          DrainMaster
        </h1>
        <div className="w-[100px] hidden md:block"></div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Game and Sidebar Container */}
        <div 
          ref={gameContainerRef}
          className={`flex flex-col md:flex-row gap-4 p-4 rounded-[28px] bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl transition-all duration-300 w-full ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-0 gap-0' : 'max-w-5xl'
          }`}
        >
          {/* Game Area */}
          <div className={`relative flex-1 rounded-[20px] overflow-hidden bg-slate-900 flex flex-col items-center justify-center ${isFullscreen ? 'rounded-none' : 'aspect-[16/9]'}`}>
            
            <iframe 
              src="/game/index.html" 
              title="DrainMaster Game"
              className="absolute inset-0 w-full h-full border-0 z-10"
              allow="fullscreen; autoplay; encrypted-media"
            ></iframe>

            {/* Fullscreen Toggle Button (Overlay) */}
            <button 
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full transition-all flex items-center justify-center shadow-lg border border-white/10"
              aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
            
            {/* Fallback visual state if game isn't loaded */}
            {!isFullscreen && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 pointer-events-none">
                <div className="w-10 h-10 border-4 border-slate-600 border-t-brand-accent rounded-full animate-spin mb-4"></div>
                <span className="font-semibold tracking-wide text-sm">Carregando Motor...</span>
              </div>
            )}
          </div>

          {/* Social / Action Sidebar (matches the reference comp) */}
          {!isFullscreen && (
            <div className="flex md:flex-col gap-3 justify-center items-center p-3 rounded-[20px] bg-white/40 backdrop-blur-md border border-white/50 min-w-[80px]">
              <a href="#" className="p-3 bg-white/60 hover:bg-white border border-white/80 text-slate-700 hover:text-blue-500 rounded-2xl shadow-sm transition-all">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="p-3 bg-white/60 hover:bg-white border border-white/80 text-slate-700 hover:text-blue-700 rounded-2xl shadow-sm transition-all">
                <FaFacebookF size={24} />
              </a>
              <a href="#" className="p-3 bg-white/60 hover:bg-white border border-white/80 text-slate-700 hover:text-pink-600 rounded-2xl shadow-sm transition-all">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="p-3 bg-white/60 hover:bg-white border border-white/80 text-slate-700 hover:text-red-600 rounded-2xl shadow-sm transition-all">
                <FaYoutube size={24} />
              </a>
            </div>
          )}
        </div>

        {/* Instructions Panel */}
        <div className="mt-8 w-full max-w-4xl p-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl text-slate-800">
          <h2 className="text-xl font-bold mb-3 tracking-wide text-slate-900">COMO JOGAR</h2>
          <p className="text-slate-700 mb-4 font-medium">
            Bem-vindo ao DrainMaster! Sua missão é projetar e construir o sistema de drenagem de água mais eficiente.
          </p>
          <ul className="space-y-2 text-slate-600 font-medium">
            <li>1. Arraste e solte os canos para conectar a fonte de água ao ralo.</li>
            <li>2. Use peças de junção especiais para otimizar o fluxo.</li>
            <li>3. Gerencie a pressão e evite vazamentos!</li>
          </ul>
          <p className="mt-4 text-slate-500 font-medium italic">
            Divertido e educativo para todas as idades.
          </p>
        </div>

      </main>
    </div>
  );
};

export default Jogo;
