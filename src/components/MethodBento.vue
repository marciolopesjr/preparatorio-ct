<script setup lang="ts">
import type { Component } from 'vue'
import { ref } from 'vue'
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Calendar,
  Compass,
  FileCheck2,
  QrCode,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'
import { BENTO_CARDS, OVERVIEW_SPECS, STAGGERED_STEPS } from '../data/landing'

const activeStep = ref<string>('03')
const specIcons = [Compass, Award, Calendar, QrCode]

const circleIcons: Record<string, Component> = {
  Compass,
  BookOpenCheck,
  ShieldCheck,
  Award,
}

const bentoIcons: Record<string, Component> = {
  Scale,
  FileCheck2,
  Sparkles,
}
</script>

<template>
  <div>
    <!-- PARTE A: Visão Geral Editorial com Pílulas no Título + Visual da Marca + Tabela -->
    <section id="visao-geral" class="bg-gradient-to-b from-[#e4efff] via-ice-white to-ice-white px-5 pt-14 pb-14 text-navy-deep lg:pt-20 lg:pb-16">
      <div class="mx-auto w-full max-w-[1160px]">
        <h2 class="mb-10 max-w-[820px] text-[clamp(2rem,4.1vw,3.35rem)] font-semibold leading-[1.16] tracking-[-0.03em] text-navy-deep">
          Zero decoreba exige
          <span class="insuria-pill-highlight">método claro</span>
          e
          <span class="insuria-pill-highlight">prática real</span>
        </h2>

        <div class="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <!-- Esquerda: Bloco visual da marca (elimina o vazio branco) -->
          <figure class="flex min-w-0 flex-col justify-between overflow-hidden rounded-[26px] border border-cobalt/20 bg-navy-deep text-white shadow-[0_24px_48px_-16px_rgba(2,11,58,0.28)] lg:col-span-5">
            <img
              src="/assets/hero-bridge-shield.jpg"
              alt="Escudo da Confiança e Ponte do Método Construindo Pontes"
              width="1200"
              height="900"
              loading="lazy"
              class="block aspect-[16/10] w-full object-cover"
            />
            <figcaption class="flex flex-1 flex-col justify-between gap-4 p-6">
              <div>
                <span class="inline-block rounded-full bg-cobalt px-3 py-1 text-[0.7rem] font-extrabold tracking-wider text-cyan-glow uppercase">
                  Arquitetura MCP
                </span>
                <p class="mt-3 text-base font-bold leading-snug text-white">
                  Da letra da Lei nº 8.069/90 à segurança na decisão do dia a dia.
                </p>
              </div>
              <div class="flex flex-wrap gap-2 text-[0.72rem] font-bold text-cyan-light">
                <span class="rounded-full border border-cyan-glow/30 bg-cobalt/60 px-3 py-1">Confiança</span>
                <span class="rounded-full border border-cyan-glow/30 bg-cobalt/60 px-3 py-1">Proteção</span>
                <span class="rounded-full border border-cyan-glow/30 bg-cobalt/60 px-3 py-1">Conexão</span>
              </div>
            </figcaption>
          </figure>

          <!-- Direita: Contexto + Tabela de especificações em painel elevado -->
          <div class="flex min-w-0 flex-col justify-between lg:col-span-7">
            <p class="mb-6 text-base leading-relaxed text-ink-muted sm:text-lg">
              Estudar pelo texto seco do ECA sem saber como as bancas municipais cobram as atribuições do Conselho Tutelar gera insegurança na prova. Estruturamos cada aula para transformar o artigo de lei em decisão prática.
            </p>

            <dl class="divide-y divide-navy-deep/10 rounded-[24px] border border-cobalt/15 bg-white px-5 py-2 shadow-sm sm:px-7">
              <div
                v-for="(row, idx) in OVERVIEW_SPECS"
                :key="row.label"
                class="grid gap-1.5 py-4 sm:grid-cols-[0.38fr_0.62fr] sm:items-center sm:gap-4"
              >
                <dt class="inline-flex items-center gap-2.5 text-sm font-bold text-cobalt">
                  <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ice-tint text-blue-electric">
                    <component :is="specIcons[idx]" class="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{{ row.label }}</span>
                </dt>
                <dd class="text-sm font-semibold text-navy-deep sm:text-right sm:text-[0.95rem]">{{ row.value }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- PARTE B: Travessia Interativa em 4 Etapas com Ponte SVG (Alto Contraste MCP) -->
    <section id="metodologia" class="bg-ice-white px-3 py-6 sm:px-5 lg:py-10">
      <div
        class="relative mx-auto w-full max-w-[1320px] overflow-hidden rounded-[28px] px-5 py-14 text-white shadow-[0_32px_64px_-20px_rgba(2,11,58,0.28)] sm:rounded-[34px] sm:px-9 lg:px-12 lg:py-20"
        style="background: linear-gradient(135deg, #020b3a 0%, #052a83 52%, #0878f9 100%);"
      >
        <!-- Arco ponte SVG decorativo conectando os 4 pilares -->
        <svg
          class="pointer-events-none absolute top-36 right-0 left-0 hidden h-64 w-full opacity-35 lg:block"
          viewBox="0 0 1200 220"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 80 155 Q 320 20 600 135 T 1120 75"
            stroke="#17DDF2"
            stroke-width="2"
            stroke-dasharray="6 6"
          />
        </svg>

        <div class="relative z-10 mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-6">
          <div>
            <h2 class="text-[clamp(1.8rem,3.2vw,2.65rem)] font-bold tracking-[-0.03em] text-white">
              Como construímos sua aprovação em <span class="text-cyan-glow">4 etapas</span>
            </h2>
            <p class="mt-2 max-w-[54ch] text-sm text-white/80 sm:text-base">
              Passe o mouse ou clique em cada etapa para visualizar a travessia do Método Construindo Pontes.
            </p>
          </div>
          <span class="rounded-full border border-cyan-glow/40 bg-navy-deep/70 px-4 py-1.5 text-xs font-extrabold tracking-wider text-cyan-glow uppercase">
            Método Construindo Pontes
          </span>
        </div>

        <div class="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/15">
          <button
            v-for="step in STAGGERED_STEPS"
            :key="step.number"
            type="button"
            class="group flex min-w-0 cursor-pointer flex-col justify-between text-left lg:px-6"
            @mouseenter="activeStep = step.number"
            @click="activeStep = step.number"
          >
            <!-- Círculo flutuante com deslocamento alternado -->
            <div class="mb-7 flex justify-center" :class="step.offsetClass">
              <div
                class="flex h-44 w-44 flex-col items-center justify-center rounded-full border p-5 text-center transition-all duration-300 sm:h-48 sm:w-48"
                :class="
                  activeStep === step.number
                    ? 'scale-105 border-cyan-glow bg-white text-navy-deep shadow-[0_24px_48px_-12px_rgba(2,11,58,0.45)]'
                    : 'border-white/25 bg-white/12 text-white backdrop-blur-md hover:border-cyan-glow/60 hover:bg-white/20'
                "
              >
                <span
                  class="mb-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                  :class="activeStep === step.number ? 'bg-blue-electric text-white' : 'bg-navy-deep/70 text-cyan-glow'"
                >
                  <component :is="circleIcons[step.iconName]" class="h-4 w-4" aria-hidden="true" />
                </span>
                <span
                  class="text-[0.68rem] font-extrabold tracking-widest uppercase tabular-nums"
                  :class="activeStep === step.number ? 'text-blue-electric' : 'text-cyan-glow'"
                >
                  Etapa {{ step.number }}
                </span>
                <strong
                  class="mt-1 text-sm font-extrabold leading-snug"
                  :class="activeStep === step.number ? 'text-navy-deep' : 'text-white'"
                >
                  {{ step.title }}
                </strong>
                <span
                  class="mt-0.5 text-[0.72rem] font-semibold"
                  :class="activeStep === step.number ? 'text-ink-muted' : 'text-cyan-light'"
                >
                  {{ step.subtitle }}
                </span>
              </div>
            </div>

            <div
              class="rounded-2xl border p-4 transition-colors duration-200"
              :class="
                activeStep === step.number
                  ? 'border-cyan-glow/55 bg-navy-deep/75 text-white'
                  : 'border-white/15 bg-white/8 text-white/85'
              "
            >
              <p class="text-xs leading-relaxed sm:text-sm">
                {{ step.description }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- PARTE C: Estrutura Assimétrica Clara + Mockup da Plataforma + Bento Insuria -->
    <section class="bg-ice-white px-5 py-16 text-navy-deep lg:py-24">
      <div class="mx-auto w-full max-w-[1160px]">
        <!-- Cabeçalho + Mockup em perspectiva -->
        <div class="mb-14 grid items-center gap-10 lg:grid-cols-12">
          <div class="min-w-0 lg:col-span-6">
            <h2 class="mb-5 text-[clamp(1.85rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-navy-deep">
              Estudo estruturado e <strong class="font-extrabold">sem ruído</strong> para o dia da prova
            </h2>
            <ul class="space-y-2.5 text-sm leading-relaxed text-ink-muted sm:text-base">
              <li class="flex items-start gap-2.5">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-electric" aria-hidden="true" />
                <span><strong class="text-navy-deep">Plataforma direta ao ponto:</strong> videoaulas e PDFs organizados por artigo do ECA.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-electric" aria-hidden="true" />
                <span><strong class="text-navy-deep">Contraste de atribuições:</strong> entenda os limites entre Conselho, MP e Judiciário.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-electric" aria-hidden="true" />
                <span><strong class="text-navy-deep">Acesso no celular ou notebook:</strong> estude entre turnos ou após o expediente.</span>
              </li>
            </ul>
          </div>

          <figure class="min-w-0 overflow-hidden rounded-[28px] border border-cobalt/15 bg-navy-deep shadow-[0_24px_48px_-16px_rgba(2,11,58,0.2)] lg:col-span-6">
            <img
              src="/assets/brazil-platform-mockup.jpg"
              alt="Plataforma do preparatório no notebook e celular com material de apoio"
              width="1408"
              height="792"
              loading="lazy"
              class="block aspect-video w-full object-cover"
            />
          </figure>
        </div>

        <!-- Grid Bento Claro estilo Insuria (Foto + Cards azul-gelo + Card destaque azul royal) -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          <figure class="overflow-hidden rounded-[28px] bg-white shadow-sm lg:col-span-4">
            <img
              src="/assets/family-protection.jpg"
              alt="Atendimento qualificado na rede de proteção integral"
              width="1200"
              height="900"
              loading="lazy"
              class="block h-full min-h-[260px] w-full object-cover"
            />
          </figure>

          <article
            v-for="card in BENTO_CARDS"
            :key="card.id"
            class="insuria-soft-card flex flex-col justify-between p-7 lg:col-span-4"
          >
            <div>
              <div class="mb-6 flex items-start justify-between gap-4">
                <h3 class="text-xl font-bold leading-snug text-navy-deep">
                  {{ card.title }}
                </h3>
                <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-deep text-white">
                  <component :is="bentoIcons[card.iconName]" class="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <p class="mb-8 text-sm leading-relaxed text-ink-muted">
                {{ card.description }}
              </p>
            </div>

            <a
              :href="card.href"
              class="btn-mcp-bento-link group"
            >
              <span>{{ card.ctaLabel }}</span>
              <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--navy">
                <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          </article>

          <!-- Card Destaque Azul Royal (últimas 3 colunas no desktop, ou full width) -->
          <div class="flex min-w-0 flex-col justify-between rounded-[28px] bg-gradient-to-br from-blue-electric to-cobalt p-7 text-white shadow-lg md:col-span-2 lg:col-span-12 lg:flex-row lg:items-center lg:gap-8 lg:p-9">
            <div class="max-w-[660px]">
              <h3 class="mb-2 text-xl font-bold text-white sm:text-2xl">
                Condição exclusiva do Dia do Conselheiro: de R$ 99,90 por R$ 29,90 no Pix
              </h3>
              <p class="text-sm leading-relaxed text-white/85 sm:text-base">
                Garanta sua vaga antecipada na pré-venda com R$ 70,00 de desconto antes do encerramento às 23:59 de hoje (18/11).
              </p>
            </div>
            <a
              href="#oferta"
              class="btn-mcp-convert btn-mcp-lg group mt-5 shrink-0 whitespace-nowrap lg:mt-0"
            >
              <span>Garantir R$ 29,90 no Pix</span>
              <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
