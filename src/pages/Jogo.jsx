import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Check,
  Eye,
  Gamepad2,
  HeartHandshake,
  Lightbulb,
  Maximize,
  Minimize,
  MousePointerClick,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router';
import Footer from '../components/Footer';
import Header from '../components/Header';
import capa from '../assets/capa-jogo.jpeg';

/* ── Tokens visuais (referência: mock DrainMaster) ─────────────────── */
const INK = '#161B21';
const AMBER = '#ECA400';

const HOW_TO_PLAY = [
  { icon: Eye, text: 'Observe a situação da cidade durante os primeiros minutos.' },
  { icon: MousePointerClick, text: 'Clique nas opções para ver os detalhes e consequências.' },
  { icon: SlidersHorizontal, text: 'Escolha as melhorias adequadas para resolver cada situação.' },
  { icon: Trophy, text: 'Ganhe pontos e avance pelos níveis!' },
];

/* Valores ilustrativos — serão sincronizados com o jogo futuramente. */
const PROGRESS = [
  { icon: Star, value: '1250', label: 'Pontos' },
  { icon: BarChart3, value: '4', label: 'Fases Completas' },
  { icon: Trophy, value: '85%', label: 'Drenagem' },
];

const RANKING = [
  { position: 1, name: 'Ana P.', points: 2480 },
  { position: 2, name: 'Bruno S.', points: 2140 },
  { position: 3, name: 'Carla M.', points: 1875 },
  { position: 4, name: 'Diego F.', points: 1520 },
  { position: 5, name: 'Você', points: 1250, isYou: true },
];

const EXPLORE_CARDS = [
  {
    title: 'Entenda os Problemas',
    text: 'Descubra as principais causas de alagamentos e seus impactos na cidade.',
    image: '/problems/img1.png',
    alt: 'Rua alagada durante chuva forte',
    icon: AlertTriangle,
    href: '/#problemas',
  },
  {
    title: 'Conheça as Soluções',
    text: 'Veja como as obras de infraestrutura podem transformar nossa realidade.',
    image: '/problems/img2.png',
    alt: 'Água da chuva escorrendo pelo asfalto',
    icon: Lightbulb,
    href: '/#solucoes',
  },
  {
    title: 'Seja a Mudança',
    text: 'Cada pessoa pode fazer a diferença para uma Caraguatatuba melhor.',
    image: '/problems/img3.png',
    alt: 'Vista aérea de margem de rio em processo de erosão',
    icon: HeartHandshake,
    href: '/cadastro',
  },
];

/* ── Página ────────────────────────────────────────────────────────── */
const Jogo = () => {
  return (
    <div className="min-h-screen bg-[#F1F1EC]">
      <Header/>
      <main>
        {/* ── Desafios da Drenagem ──────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 py-16 md:py-24">
          {/* Fragmentos decorativos de fundo */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 top-48 hidden w-44 text-[#161B21] lg:block"
            style={{ opacity: 0.05 }}
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <polygon points="0,10 130,40 70,130 15,95" />
            <polygon points="150,140 190,120 200,180 140,190" />
          </svg>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-24 hidden w-56 text-[#161B21] lg:block"
            style={{ opacity: 0.05 }}
            viewBox="0 0 240 240"
            fill="currentColor"
          >
            <polygon points="40,0 240,30 170,140 90,90" />
            <polygon points="10,150 60,130 80,200 0,220" />
          </svg>

          <div className="relative mx-auto max-w-[1200px]">
            <div className="max-w-2xl">
              <p
                className="animate-fade-up text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: AMBER }}
              >
                Jogo Educativo
              </p>
              <h1
                className="animate-fade-up mt-3 font-serif text-4xl font-bold tracking-tight text-[#161B21] md:text-5xl"
                style={{ animationDelay: '0.08s' }}
              >
                Desafios da Drenagem
              </h1>
              <p
                className="animate-fade-up mt-4 max-w-xl text-base leading-relaxed text-[#4A5158] md:text-lg"
                style={{ animationDelay: '0.16s' }}
              >
                Ajude a manter a cidade segura. Faça as escolhas certas e evite
                enchentes, poluição e danos à infraestrutura.
              </p>
            </div>

            <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              {/* Coluna esquerda: jogo + ações */}
              <div className="animate-fade-up min-w-0" style={{ animationDelay: '0.24s' }}>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#161B21]/8 bg-[#F1F1EC] shadow-[0_14px_35px_-24px_rgba(22,27,33,0.35)]">
                  <img src={capa} alt="" />
                </div>
              </div>

              {/* Coluna direita: instruções e progresso */}
              <div className="flex flex-col gap-6">
                <div
                  className="animate-fade-up rounded-2xl border border-[#161B21]/8 bg-white p-6 shadow-[0_14px_35px_-24px_rgba(22,27,33,0.35)]"
                  style={{ animationDelay: '0.3s' }}
                >
                  <h2 className="text-lg font-extrabold text-[#161B21]">Como Jogar</h2>
                  <ul className="mt-5 space-y-4">
                    {HOW_TO_PLAY.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F1EC]"
                          style={{ color: INK }}
                        >
                          <step.icon size={17} aria-hidden="true" />
                        </span>
                        <p className="pt-1.5 text-sm leading-relaxed text-[#4A5158]">
                          {step.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="animate-fade-up rounded-2xl border border-[#161B21]/8 bg-white p-6 shadow-[0_14px_35px_-24px_rgba(22,27,33,0.35)]"
                  style={{ animationDelay: '0.38s' }}
                >
                  <h2 className="text-lg font-extrabold text-[#161B21]">Seu Progresso</h2>
                  <ul className="mt-5 space-y-4">
                    {PROGRESS.map((stat, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F1EC]"
                          style={{ color: INK }}
                        >
                          <stat.icon size={17} aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xl font-extrabold leading-none text-[#161B21] tabular-nums">
                            {stat.value}
                          </span>
                          <span className="mt-1 block text-xs font-medium text-[#6B7280]">
                            {stat.label}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-[#161B21]/8 pt-3 text-[11px] text-[#8A8F98]">
                    Valores de demonstração — em breve sincronizados com o jogo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cada Escolha Importa ──────────────────────────────────── */}
        <section className="bg-[#14181F] px-6 py-20 text-white md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <p
                className="animate-fade-up text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: AMBER }}
              >
                Aprenda e faça a diferença
              </p>
              <h2
                className="animate-fade-up mt-3 font-serif text-3xl font-bold tracking-tight md:text-5xl"
                style={{ animationDelay: '0.08s' }}
              >
                Cada Escolha Importa
              </h2>
              <p
                className="animate-fade-up mt-5 text-base leading-relaxed text-white/70"
                style={{ animationDelay: '0.16s' }}
              >
                As decisões que você toma no jogo refletem desafios reais que
                enfrentamos todos os dias em nossa cidade. Aprenda sobre drenagem
                urbana enquanto se diverte e descubra como pequenas ações podem
                transformar Caraguatatuba.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {EXPLORE_CARDS.map((card, index) => (
                <a
                  key={card.title}
                  href={card.href}
                  className={`animate-fade-up group overflow-hidden rounded-2xl border border-white/8 bg-[#1D232C] shadow-[0_20px_45px_-25px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/15 hover:shadow-[0_28px_55px_-25px_rgba(0,0,0,0.8)]`}
                  style={{ animationDelay: `${0.24 + index * 0.08}s` }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#1D232C] to-transparent"
                    />
                  </div>
                  <div className="p-6">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: AMBER, color: INK }}
                    >
                      <card.icon size={19} aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {card.text}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Rodapé ──────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default Jogo;
