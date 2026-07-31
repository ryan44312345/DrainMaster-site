import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const bgRef = useRef(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Entry Animation (text coming from bottom to top)
      gsap.from(".hero-elem", {
        y: 80,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2
      });

      // 2. Initial Zoom Out Animation on the background
      gsap.fromTo(bgRef.current, 
        { scale: 1.15 },
        {
          scale: 1,
          duration: 4,
          ease: 'power3.out'
        }
      );

      // 3. Parallax effect on scroll
      gsap.to(bgRef.current, {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 4. Fade out text on scroll
      gsap.to(textContainerRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative h-screen flex flex-col justify-end px-4 md:px-12 pb-8 md:pb-12 overflow-hidden">
      {/* Background Image (First Panorama) */}
      <div 
        ref={bgRef}
        className="absolute -top-[25%] left-0 w-full h-[150%] -z-20 bg-cover bg-center origin-center"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/9/93/Caraguatatuba_panorama.JPG')" }}
      ></div>

      {/* Gray Gradient going from bottom to top */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-transparent pointer-events-none"></div>
      
      {/* Container for Texts */}
      <div ref={textContainerRef} className="w-full relative z-10 flex flex-col items-center">
        
        {/* Top small texts (Left and Right aligned) */}
        <div className="flex justify-between items-end w-full mb-1 md:mb-2 px-2 md:px-8">
          <p className="hero-elem text-white font-semibold text-xs md:text-lg max-w-[200px] md:max-w-sm" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Infraestrutura resiliente contra alagamentos
          </p>
          <p className="hero-elem text-white font-bold text-xs md:text-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Prevenção, Memória
          </p>
        </div>

        {/* Massive Serif Title */}
        <h1 
          className="hero-elem w-full text-center font-serif text-white uppercase leading-none" 
          style={{ 
            fontSize: 'clamp(3.5rem, 14vw, 20rem)', 
            textShadow: '0 10px 30px rgba(0,0,0,0.4), 0 2px 10px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}
        >
          DRAINMASTER
        </h1>
      </div>
    </section>
  );
};

export default Hero;
