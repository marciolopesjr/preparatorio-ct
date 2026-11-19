<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowRight, BookOpenCheck, QrCode, ShieldCheck, Zap } from 'lucide-vue-next'
import { HERO_GLASS_METRICS } from '../data/landing'

const metricIcons: Record<string, Component> = {
  QrCode,
  Zap,
  BookOpenCheck,
}
</script>

<template>
  <section class="bg-ice-white px-3 pt-3 pb-6 sm:px-5 sm:pt-5 sm:pb-10" aria-label="Preparatório para Conselheiros Tutelares">
    <div class="insuria-hero-canvas relative mx-auto w-full max-w-[1320px] overflow-hidden rounded-[26px] text-white sm:rounded-[34px]">
      <!-- Fundo fotográfico luminoso + marca d'água tipográfica sutil -->
      <div class="pointer-events-none absolute inset-0">
        <img
          src="/assets/insuria-hero.jpg"
          alt=""
          width="1600"
          height="900"
          class="h-full w-full object-cover object-right opacity-95"
          style="-webkit-mask-image: linear-gradient(90deg, transparent 44%, rgba(0,0,0,0.65) 56%, black 68%); mask-image: linear-gradient(90deg, transparent 44%, rgba(0,0,0,0.65) 56%, black 68%);"
        />
        <!-- Máscara mobile para legibilidade do texto -->
        <div
          class="absolute inset-0 lg:hidden"
          style="background: linear-gradient(180deg, rgba(5, 42, 131, 0.9) 0%, rgba(8, 120, 249, 0.85) 58%, rgba(5, 42, 131, 0.92) 100%);"
        />
        <span
          class="absolute top-12 left-10 hidden text-[10.5rem] font-extrabold tracking-[-0.05em] text-white/[0.05] select-none lg:block"
          aria-hidden="true"
        >
          proteção
        </span>
      </div>

      <!-- Conteúdo interno do Hero -->
      <div class="relative z-10 flex flex-col justify-between px-5 py-5 sm:px-9 sm:py-7 lg:min-h-[680px] lg:px-12 lg:py-9">
        <!-- Navbar flutuante estilo Insuria -->
        <header class="flex flex-wrap items-center justify-between gap-4">
          <a href="#" class="inline-flex items-center no-underline transition-transform duration-200 hover:scale-[1.02]">
            <img
              src="/assets/logo-mcp-3d.webp"
              alt="Método Construindo Pontes"
              width="180"
              height="60"
              class="h-11 w-auto drop-shadow-[0_4px_12px_rgba(2,11,58,0.45)] sm:h-13"
            />
          </a>

          <nav
            aria-label="Navegação principal"
            class="hidden items-center gap-6 rounded-full border border-white/25 bg-white/15 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-md md:flex"
          >
            <a href="#visao-geral" class="transition-opacity hover:opacity-75">Visão Geral</a>
            <a href="#metodologia" class="transition-opacity hover:opacity-75">Metodologia</a>
            <a href="#conteudo" class="transition-opacity hover:opacity-75">Módulos</a>
            <a href="#mentor" class="transition-opacity hover:opacity-75">Wagner Macedo</a>
          </nav>

          <a
            href="#oferta"
            class="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-navy-deep/35 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-colors duration-200 hover:border-cyan-glow hover:bg-navy-deep/55 sm:inline-flex"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>Garantir vaga</span>
          </a>
        </header>

        <!-- Bloco Central: Título limpo + 2 botões pílula -->
        <div class="my-10 max-w-[600px] lg:my-12">
          <h1 class="hero-stagger mb-5 text-[clamp(2.15rem,4.6vw,3.9rem)] font-bold leading-[1.07] tracking-[-0.03em] text-white">
            Preparatório para Conselheiros Tutelares, sem complicação.
          </h1>

          <p class="hero-stagger mb-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-light sm:text-sm">
            <ShieldCheck class="h-4 w-4 shrink-0 text-cyan-glow" aria-hidden="true" />
            <span>Edição Especial Dia do Conselheiro (18/11) · Por Wagner Macedo</span>
          </p>

          <p class="hero-stagger mb-8 max-w-[50ch] text-sm leading-relaxed text-white/90 sm:text-base">
            Domine o ECA (Lei nº 8.069/90), os limites do Art. 136 e a resolução de casos práticos para chegar seguro à prova — de <s class="opacity-75">R$ 99,90</s> por <strong class="text-white">R$ 29,90 no Pix</strong>.
          </p>

          <div class="hero-stagger flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#oferta"
              class="btn-mcp-convert btn-mcp-lg group whitespace-nowrap"
            >
              <span>Garantir vaga · R$ 29,90</span>
              <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>

            <a
              href="#conteudo"
              class="btn-mcp-glass btn-mcp-lg group"
            >
              <span>Ver grade do curso</span>
              <ArrowRight class="btn-mcp-icon-arrow h-4 w-4 text-cyan-glow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Rodapé interno do Hero: 3 Cards de Vidro Fosco estilo Insuria -->
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="text-xs font-medium text-white/85 sm:text-sm">
            <span class="block font-bold text-white">Formação · Capacitação · Resultados</span>
            <span>Pré-venda válida somente até hoje às 23:59 (18/11)</span>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[560px]">
            <div
              v-for="(metric, idx) in HERO_GLASS_METRICS"
              :key="metric.value"
              class="insuria-glass-card flex flex-col justify-between p-4"
              :class="idx === 1 ? 'animate-float-gentle-delayed' : 'animate-float-gentle'"
            >
              <div class="mb-2 flex items-center justify-between gap-2">
                <strong class="text-xl font-extrabold tracking-tight text-white tabular-nums sm:text-2xl">
                  {{ metric.value }}
                </strong>
                <component :is="metricIcons[metric.iconName]" class="h-4 w-4 shrink-0 text-cyan-glow" aria-hidden="true" />
              </div>
              <span class="text-[0.72rem] leading-snug font-medium text-white/85">
                {{ metric.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
