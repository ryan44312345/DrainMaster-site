import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imgReservatorio from '../assets/Reservatório_02.jpg';
import imgJardim from '../assets/jardins-de-chuva-1024x683.webp';
import imgDesassoreamento from '../assets/desassoreamento-das-margens-do-Rio-Santo-Antonio-1.jpg';
import imgBgFloresta from '../assets/image.png';

gsap.registerPlugin(ScrollTrigger);

const CAROUSEL_CONFIG = {
  scale: { min: 0.85, max: 1, factor: 0.6 },
  opacity: { min: 0.4, max: 1, factor: 0.6 },
  animationDuration: 0.6,
  ease: "expo.out",
  textShowDelay: 0.1,
  textHideDuration: 0.3,
  cloneCount: 1,
  gap: 20,
  resetDelay: 600,
  initDelay: 100
};

const calculateEffectValues = (dist, windowWidth) => {
  const scale = Math.max(
    CAROUSEL_CONFIG.scale.min,
    Math.min(CAROUSEL_CONFIG.scale.max, 1 - (dist / windowWidth) * CAROUSEL_CONFIG.scale.factor)
  );

  const opacity = Math.max(
    CAROUSEL_CONFIG.opacity.min,
    Math.min(CAROUSEL_CONFIG.opacity.max, 1 - (dist / windowWidth) * CAROUSEL_CONFIG.opacity.factor)
  );

  return { scale, opacity };
};

const Solutions = () => {
  const cardsRef = useRef([]);
  const sliderRef = useRef(null);
  const nextBtnRef = useRef(null);
  const prevBtnRef = useRef(null);
  const sectionRef = useRef(null);

  const solutionsData = [
    {
      title: "Piscinões e Reservatórios",
      text: "Construção de reservatórios de detenção para conter o volume excessivo de água das chuvas temporariamente, liberando-a aos poucos.",
      bgImage: imgReservatorio,
      focus: 'FOCO 01'
    },
    {
      title: "Jardins de Chuva",
      text: "Implementação de áreas verdes estratégicas que absorvem a água da chuva, reduzindo o fluxo que vai para as galerias pluviais.",
      bgImage: imgJardim,
      focus: 'FOCO 02'
    },
    {
      title: "Desassoreamento",
      text: "Programa permanente de limpeza e desassoreamento de rios, canais e galerias, garantindo que o sistema funcione na sua capacidade máxima.",
      bgImage: imgDesassoreamento,
      focus: 'FOCO 03'
    }
  ];

  // Animação de Entrada (ScrollTrigger)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const title = section.querySelector('h2');
    const subtitle = section.querySelector('.subtitle');
    const sliderContainer = section.querySelector('#card-slider').parentElement;

    gsap.fromTo(title, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
    );

    gsap.fromTo(subtitle, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
    );

    gsap.fromTo(sliderContainer,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  // Efeito GSAP unificado (Desktop Accordion + Mobile 3D Carousel)
  useEffect(() => {
    const slider = sliderRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    const originalCards = cardsRef.current.filter(Boolean);
    
    if (!slider || !prevBtn || !nextBtn || originalCards.length === 0) return;

    let isMobile = window.innerWidth < 1024;
    
    // ==========================================
    // 1. Lógica Desktop (Hover Accordion Premium)
    // ==========================================
    const handleMouseEnter = function () {
      if (window.innerWidth < 1024) return;
      const subtitulo = this.querySelector(".subtitulos");
      const texto = this.querySelector(".texto");
      const bgImg = this.querySelector(".bg-image");
      const allSiblings = Array.from(this.parentElement.querySelectorAll('.cards'));
      
      gsap.killTweensOf([this, subtitulo, texto, bgImg, ...allSiblings]);
      
      // Card hovered expande, irmãos encolhem — tudo via flex, sem sair da linha
      gsap.to(this, { flex: 1.6, duration: 0.8, ease: "expo.out" });
      allSiblings.forEach(card => {
        if (card !== this) gsap.to(card, { flex: 0.8, duration: 0.8, ease: "expo.out" });
      });
      
      gsap.to(subtitulo, { y: -15, duration: 0.8, ease: "expo.out" });
      if(bgImg) gsap.to(bgImg, { scale: 1.1, duration: 3, ease: "power2.out" });
      gsap.to(texto, { height: "auto", opacity: 1, duration: 0.8, ease: "expo.out" });
    };

    const handleMouseLeave = function () {
      if (window.innerWidth < 1024) return;
      const subtitulo = this.querySelector(".subtitulos");
      const texto = this.querySelector(".texto");
      const bgImg = this.querySelector(".bg-image");
      const allSiblings = Array.from(this.parentElement.querySelectorAll('.cards'));
      
      gsap.killTweensOf([this, subtitulo, texto, bgImg, ...allSiblings]);
      
      // Todos voltam ao tamanho igual
      allSiblings.forEach(card => {
        gsap.to(card, { flex: 1, duration: 0.8, ease: "expo.out" });
      });
      
      gsap.to(subtitulo, { y: 0, duration: 0.8, ease: "expo.out" });
      if(bgImg) gsap.to(bgImg, { scale: 1, duration: 1.5, ease: "power2.out" });
      gsap.to(texto, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    originalCards.forEach(card => {
      card.style.pointerEvents = 'auto';
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    // ==========================================
    // 2. Lógica Mobile (3D Carousel + Swipe)
    // ==========================================
    let rafId3D = null;
    let currentIndex = 0;
    let isAnimating = false;
    let allCards = [...originalCards];
    const totalOriginalCards = originalCards.length;
    let clonesAdded = false;

    const apply3DEffect = (cardsToAnimate, sliderContainer, animate = true, targetX = null) => {
      if (rafId3D) cancelAnimationFrame(rafId3D);

      rafId3D = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const sliderRect = sliderContainer.getBoundingClientRect();

        const currentX = sliderRect.left;
        const deltaX = targetX !== null ? (targetX - gsap.getProperty(sliderContainer, "x")) : 0;

        cardsToAnimate.forEach(card => {
          const rect = card.getBoundingClientRect();
          const futureCardCenter = rect.left + rect.width / 2 + deltaX;
          const dist = Math.abs(centerX - futureCardCenter);

          const { scale, opacity } = calculateEffectValues(dist, window.innerWidth);

          if (animate) {
            gsap.to(card, {
              scale,
              opacity,
              duration: CAROUSEL_CONFIG.animationDuration,
              ease: CAROUSEL_CONFIG.ease,
              zIndex: Math.round(1000 - dist),
              force3D: true,
              overwrite: 'auto'
            });
          } else {
            gsap.set(card, {
              scale,
              opacity,
              zIndex: Math.round(1000 - dist),
              force3D: true
            });
          }
        });
        rafId3D = null;
      });
    };

    const updateCardTexts = (cardsToUpdate, activeIndex) => {
      cardsToUpdate.forEach((card, index) => {
        const text = card.querySelector('.texto');
        if (!text) return;

        if (index === activeIndex) {
          const fullHeight = text.scrollHeight;
          gsap.to(text, {
            maxHeight: fullHeight + 'px',
            opacity: 1,
            duration: CAROUSEL_CONFIG.animationDuration,
            delay: CAROUSEL_CONFIG.textShowDelay,
            ease: CAROUSEL_CONFIG.ease
          });
        } else {
          gsap.to(text, {
            maxHeight: 0,
            opacity: 0,
            duration: CAROUSEL_CONFIG.textHideDuration,
            ease: "power2.out"
          });
        }
      });
    };

    const cloneCards = () => {
      if (clonesAdded) return;
      for (let i = 0; i < CAROUSEL_CONFIG.cloneCount; i++) {
        const cloneStart = originalCards[totalOriginalCards - 1 - i].cloneNode(true);
        cloneStart.classList.add('clone');
        slider.insertBefore(cloneStart, slider.firstChild);

        const cloneEnd = originalCards[i].cloneNode(true);
        cloneEnd.classList.add('clone');
        slider.appendChild(cloneEnd);
      }
      clonesAdded = true;
      allCards = Array.from(slider.querySelectorAll('.cards'));
    };

    const removeClones = () => {
      if (!clonesAdded) return;
      const clones = slider.querySelectorAll('.clone');
      clones.forEach(clone => clone.remove());
      clonesAdded = false;
      allCards = [...originalCards];
    };

    const updateCarousel = (animate = true) => {
      if (!isMobile) return;
      const cardWidth = allCards[0].offsetWidth;
      const itemWidth = cardWidth + CAROUSEL_CONFIG.gap;
      const activeIndex = currentIndex + CAROUSEL_CONFIG.cloneCount;
      const containerWidth = slider.parentElement.offsetWidth;
      const centerOffset = (containerWidth - cardWidth) / 2;
      const x = -(activeIndex * itemWidth) + centerOffset;

      if (animate) {
        apply3DEffect(allCards, slider, true, x);
        gsap.to(slider, {
          x,
          duration: CAROUSEL_CONFIG.animationDuration,
          ease: CAROUSEL_CONFIG.ease
        });
      } else {
        gsap.set(slider, { x });
        apply3DEffect(allCards, slider, false, null);
      }

      updateCardTexts(allCards, activeIndex);
    };

    const navigate = (direction) => {
      if (!isMobile || isAnimating) return;
      isAnimating = true;

      currentIndex += direction;
      updateCarousel();

      const shouldReset = (direction > 0 && currentIndex >= totalOriginalCards) ||
                          (direction < 0 && currentIndex < 0);

      if (shouldReset) {
        setTimeout(() => {
          currentIndex = direction > 0 ? 0 : totalOriginalCards - 1;
          updateCarousel(false);
          isAnimating = false;
        }, CAROUSEL_CONFIG.resetDelay);
      } else {
        setTimeout(() => {
          isAnimating = false;
        }, CAROUSEL_CONFIG.resetDelay);
      }
    };

    const handleNext = () => navigate(1);
    const handlePrev = () => navigate(-1);

    // Suporte a Swipe para Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) handleNext();
      else if (touchEndX - touchStartX > 50) handlePrev();
    };

    const setupView = () => {
      isMobile = window.innerWidth < 1024;
      if (isMobile) {
        gsap.set(slider, { clearProps: "justifyContent,overflowX" });
        slider.style.flexWrap = "nowrap";
        cloneCards();
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchend', handleTouchEnd, { passive: true });
        setTimeout(() => updateCarousel(false), CAROUSEL_CONFIG.initDelay);
      } else {
        removeClones();
        slider.removeEventListener('touchstart', handleTouchStart);
        slider.removeEventListener('touchend', handleTouchEnd);
        gsap.set(slider, { clearProps: "x,transform" });
        gsap.set(allCards, { clearProps: "scale,opacity,zIndex,transform,width" });
        slider.style.flexWrap = "nowrap";
        
        allCards.forEach(card => {
          // Desktop: usar flex em vez de largura fixa
          card.style.flex = "1";
          card.style.flexShrink = "1";
          card.style.width = "auto";
          const text = card.querySelector('.texto');
          if (text) gsap.set(text, { maxHeight: 'none', height: 0, opacity: 0 });
        });
      }
    };

    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);
    window.addEventListener('resize', setupView, { passive: true });

    // Initial setup
    setupView();

    // Cleanup
    return () => {
      originalCards.forEach(card => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
      nextBtn.removeEventListener('click', handleNext);
      prevBtn.removeEventListener('click', handlePrev);
      window.removeEventListener('resize', setupView);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleTouchEnd);
      if (rafId3D) cancelAnimationFrame(rafId3D);
    };
  }, []);

  return (
    <section ref={sectionRef} id="solucoes" className="min-h-screen w-full flex flex-col py-16 lg:py-24 mt-12 relative overflow-hidden">
      
      {/* Imagem de fundo escura */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imgBgFloresta} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 px-6 lg:px-12">
        <h2 className="text-left text-white font-serif text-4xl md:text-6xl lg:text-7xl mb-4 font-bold tracking-tight">
          Como Resolvemos
        </h2>
        <div className="flex flex-col max-w-full gap-5 h-full">
          <p className="subtitle font-outfit text-gray-300 text-left text-base md:text-lg mb-8">
            Como podemos mitigar os impactos das chuvas e modernizar a cidade.
          </p>

          <div className="w-full overflow-hidden">
            <div
              id="card-slider"
              ref={sliderRef}
              className="flex gap-5 justify-start lg:justify-center mt-0 w-full relative"
              style={{ willChange: 'transform' }}
            >
              {solutionsData.map((item, index) => (
                <div
                  key={index}
                  ref={el => cardsRef.current[index] = el}
                  className="cards rounded-2xl w-[85vw] shrink-0 md:w-[400px] lg:w-auto lg:flex-1 lg:shrink aspect-[3/4] lg:aspect-auto h-auto lg:h-[500px] relative shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden group cursor-pointer"
                  style={{ willChange: 'transform, opacity, width', contain: 'layout style paint' }}
                >
                  <div 
                    className="bg-image h-full w-full bg-center bg-cover brightness-90 transition-transform duration-[3s]"
                    style={{ backgroundImage: `url(${item.bgImage})` }}
                  ></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-700 lg:group-hover:opacity-80"></div>
                  
                  <div className="card-content absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end z-10">
                    {/* Focus label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#ECA400]"></div>
                      <span className="text-[#ECA400] text-xs font-bold uppercase tracking-widest">{item.focus}</span>
                    </div>
                    <h3 className="subtitulos text-white font-outfit font-bold text-xl md:text-2xl mb-3 drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="texto text-gray-300 font-outfit text-sm md:text-base opacity-0 lg:h-0 overflow-hidden leading-relaxed drop-shadow-sm">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons for Mobile */}
          <div className="flex justify-center gap-4 mt-6 lg:hidden w-full z-10 px-6">
            <button
              ref={prevBtnRef}
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors font-bold text-2xl py-3 px-6 rounded-full shadow-lg z-20 border border-white/20"
            >
              &larr;
            </button>
            <button
              ref={nextBtnRef}
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors font-bold text-2xl py-3 px-6 rounded-full shadow-lg z-20 border border-white/20"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
