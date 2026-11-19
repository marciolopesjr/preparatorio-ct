<script setup lang="ts">
import type { Component } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  Gift,
  HeartHandshake,
  Layers,
  Lightbulb,
  Lock,
  Map,
  MessageCircle,
  Scale,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Waypoints,
} from 'lucide-vue-next'
import PixEmvCheckoutModal from '../PixEmvCheckoutModal.vue'
import type { CheckoutPlanOption } from '../PixEmvCheckoutModal.vue'
import ProtectedPreviewCanvas from './ProtectedPreviewCanvas.vue'
import { buildWhatsAppLink } from '../../utils/pixEmv'
import { publicAsset } from '../../utils/publicAsset'
import { COMPANY_INFO, WAGNER_PROFILE } from '../../data/landing'
import {
  KIT_BONUSES,
  KIT_FAQS,
  KIT_HERO_HIGHLIGHTS,
  KIT_MODULES,
  KIT_STUDY_BENEFITS,
  KIT_TARGET_GOALS,
  KIT_TIERS,
  REAL_PAGE_PREVIEWS,
} from '../../data/kit2027'

const selectedKitId = ref<'basico' | 'premium'>('premium')
const isCheckoutModalOpen = ref(false)
const openFaqId = ref<string>(KIT_FAQS[0].id)
const heroDeckIndex = ref(0)
const isHeroDeckPaused = ref(false)
let deckTimer: ReturnType<typeof setInterval> | null = null
let deckResumeTimer: ReturnType<typeof setTimeout> | null = null

const deckCards = REAL_PAGE_PREVIEWS
const electionDate = new Date(2027, 9, 3)
const secondsUntilElection = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const electionCountdown = computed(() => {
  const days = Math.floor(secondsUntilElection.value / 86400)
  const hours = Math.floor((secondsUntilElection.value % 86400) / 3600)
  const minutes = Math.floor((secondsUntilElection.value % 3600) / 60)
  const seconds = secondsUntilElection.value % 60

  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
})

function updateElectionCountdown() {
  secondsUntilElection.value = Math.max(
    0,
    Math.floor((electionDate.getTime() - Date.now()) / 1000),
  )
}

function stepHeroDeck(delta: number) {
  const len = deckCards.length
  heroDeckIndex.value = (heroDeckIndex.value + delta + len) % len
}

function focusHeroCard(idx: number) {
  if (idx !== heroDeckIndex.value) {
    heroDeckIndex.value = idx
  }
}

function getHeroCardSlotClass(idx: number) {
  const len = deckCards.length
  const rel = (idx - heroDeckIndex.value + len) % len
  if (rel === 0) {
    return 'z-30 translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100 border-cyan-glow shadow-[0_30px_60px_-15px_rgba(2,11,58,0.85)]'
  }
  if (rel === 1) {
    return 'z-20 translate-x-[28%] sm:translate-x-[42%] translate-y-2 scale-[0.84] rotate-[7deg] opacity-95 border-cyan-glow/55 shadow-2xl cursor-pointer hover:border-cyan-glow'
  }
  if (rel === len - 1) {
    return 'z-20 -translate-x-[28%] sm:-translate-x-[42%] translate-y-2 scale-[0.84] -rotate-[7deg] opacity-95 border-cyan-glow/55 shadow-2xl cursor-pointer hover:border-cyan-glow'
  }
  return 'z-10 translate-x-0 -translate-y-2 scale-[0.74] rotate-0 opacity-0 pointer-events-none border-cyan-glow/30'
}

function pauseHeroDeckTemporarily() {
  isHeroDeckPaused.value = true
  if (deckResumeTimer) clearTimeout(deckResumeTimer)
  deckResumeTimer = setTimeout(() => {
    isHeroDeckPaused.value = false
  }, 4500)
}

onMounted(() => {
  updateElectionCountdown()
  countdownTimer = setInterval(updateElectionCountdown, 1000)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return
  deckTimer = setInterval(() => {
    if (!isHeroDeckPaused.value) {
      stepHeroDeck(1)
    }
  }, 3400)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (deckTimer) clearInterval(deckTimer)
  if (deckResumeTimer) clearTimeout(deckResumeTimer)
})

const selectedKit = computed(
  () => KIT_TIERS.find((k) => k.id === selectedKitId.value) ?? KIT_TIERS[1],
)

const whatsappReceiptMessage = computed(
  () =>
    `Olá! Acabei de pagar o Pix de R$ ${selectedKit.value.priceFormatted} referente ao ${selectedKit.value.name} (Kit Conselheiro Tutelar 2027). Segue o comprovante para liberação do PDF.`,
)

const whatsappKitHref = computed(() =>
  buildWhatsAppLink('555185716039', whatsappReceiptMessage.value),
)

function buildCheckoutPlan(kit: (typeof KIT_TIERS)[number]): CheckoutPlanOption {
  return {
    id: kit.id,
    name: kit.name,
    price: kit.price,
    priceFormatted: kit.priceFormatted,
    txid: kit.id === 'premium' ? 'KIT2027PREM' : 'KIT2027BAS',
    description: kit.name,
    whatsappMessage: `Olá! Acabei de pagar o Pix de R$ ${kit.priceFormatted} referente ao ${kit.name} (Kit Conselheiro Tutelar 2027). Segue o comprovante para liberação do PDF.`,
  }
}

const activeCheckoutPlan = computed<CheckoutPlanOption>(() => buildCheckoutPlan(selectedKit.value))

const alternateCheckoutPlan = computed<CheckoutPlanOption | null>(() => {
  if (selectedKitId.value === 'basico') {
    const prem = KIT_TIERS.find((k) => k.id === 'premium')
    return prem ? buildCheckoutPlan(prem) : null
  }
  return null
})

function selectKitAndScroll(kitId: 'basico' | 'premium') {
  selectedKitId.value = kitId
  isCheckoutModalOpen.value = true
}

function handleSwitchModalPlan(planId: string) {
  if (planId === 'basico' || planId === 'premium') {
    selectedKitId.value = planId
  }
}

function toggleFaq(id: string) {
  openFaqId.value = openFaqId.value === id ? '' : id
}

const highlightIcons: Record<string, Component> = {
  Layers,
  FileText,
  Smartphone,
}

const moduleIcons: Record<string, Component> = {
  BookOpen,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Users,
  Waypoints,
  Lightbulb,
  FileCheck2,
}

const benefitIcons: Record<string, Component> = {
  Layers,
  Eye,
  Lightbulb,
  Smartphone,
}

const bonusIcons: Record<string, Component> = {
  CalendarDays,
  Map,
  CheckSquare,
}
</script>

<template>
  <div class="min-h-screen bg-ice-white pb-20 text-navy-deep md:pb-0">
    <!-- Faixa superior -->
    <div class="bg-navy-deep px-4 py-2 text-center text-xs font-semibold text-white">
      <div class="mx-auto flex max-w-[1260px] flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:justify-between">
        <span class="inline-flex items-center gap-2">
          <Sparkles class="h-3.5 w-3.5 shrink-0 text-cyan-glow" aria-hidden="true" />
          <span>Kit Conselheiro Tutelar 2027 · Material visual em PDF</span>
        </span>
        <span
          class="inline-flex items-center gap-1.5 text-cyan-light tabular-nums"
          role="timer"
          aria-label="Contagem regressiva até a data nacional de escolha do Conselho Tutelar em 3 de outubro de 2027"
        >
          <Clock class="h-3.5 w-3.5 shrink-0 text-cyan-glow" aria-hidden="true" />
          <span>Faltam <strong class="text-white">{{ electionCountdown }}</strong> para 3 de outubro de 2027</span>
        </span>
      </div>
    </div>

    <main>
      <!-- HERO LUMINOSO + LEQUE PROTEGIDO EM CANVAS -->
      <section class="bg-ice-white px-3 pt-3 pb-8 sm:px-5 sm:pt-5 lg:pb-12">
        <div class="insuria-hero-canvas relative mx-auto w-full max-w-[1320px] overflow-hidden rounded-[26px] px-5 py-6 text-white sm:rounded-[34px] sm:px-10 sm:py-8 lg:px-12 lg:py-10">
          <!-- Navbar flutuante -->
          <header class="mb-5 flex flex-wrap items-center justify-between gap-4 sm:mb-9">
            <a href="#" class="inline-flex items-center no-underline transition-transform duration-200 hover:scale-[1.02]">
              <img
                :src="publicAsset('/assets/logo-mcp-3d.webp')"
                alt="Método Construindo Pontes"
                width="180"
                height="60"
                class="h-11 w-auto drop-shadow-[0_4px_12px_rgba(2,11,58,0.45)] sm:h-13"
              />
            </a>

            <nav
              aria-label="Atalhos do Kit 2027"
              class="hidden items-center gap-6 rounded-full border border-white/25 bg-white/15 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-md md:flex"
            >
              <a href="#por-dentro" class="transition-opacity hover:opacity-75">Amostra Visual</a>
              <a href="#modulos-kit" class="transition-opacity hover:opacity-75">8 Módulos</a>
              <a href="#bonus-kit" class="transition-opacity hover:opacity-75">Bônus</a>
              <a href="#kits" class="transition-opacity hover:opacity-75">Escolher Kit</a>
            </nav>

            <a
              href="#kits"
              class="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-navy-deep/35 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-colors duration-200 hover:border-cyan-glow hover:bg-navy-deep/55 sm:inline-flex"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>Ver Kits</span>
            </a>
          </header>

          <!-- Conteúdo Hero (No mobile: Cartas animadas no topo -> Título + CTA -> 3 cartões com ícones) -->
          <div class="grid items-center gap-7 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-4">
            <!-- Bloco de texto e CTA principal -->
            <div class="order-2 min-w-0 lg:order-none lg:col-span-6 lg:row-span-2 lg:row-start-1 lg:self-center">
              <h1 class="mb-4 text-[clamp(1.85rem,4.2vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:mb-5">
                Conselho Tutelar 2027: estude o ECA de forma visual.
              </h1>

              <p class="mb-5 text-sm leading-relaxed text-white/90 sm:mb-6 sm:text-base">
                Organize sua preparação com 8 módulos visuais, situações práticas e mapas de revisão. Acesse os PDFs pelo celular ou imprima para estudar onde preferir.
              </p>

              <ul class="mb-6 grid gap-2 text-sm font-medium text-white sm:mb-7 sm:gap-2.5">
                <li
                  v-for="item in KIT_HERO_HIGHLIGHTS"
                  :key="item.text"
                  class="flex items-center gap-3"
                >
                  <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-cyan-glow">
                    <component :is="highlightIcons[item.iconName]" class="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{{ item.text }}</span>
                </li>
              </ul>

              <div class="flex flex-col items-start gap-3">
                <a
                  href="#kits"
                  class="btn-mcp-convert btn-mcp-lg group w-full whitespace-nowrap sm:w-auto"
                >
                  <span>Ver opções do Kit</span>
                  <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                    <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </a>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-white/85">
                  <span class="inline-flex items-center gap-1.5">
                    <CheckCircle2 class="h-3.5 w-3.5 shrink-0 text-cyan-glow" aria-hidden="true" />
                    Acesso digital imediato
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <ShieldCheck class="h-3.5 w-3.5 shrink-0 text-cyan-glow" aria-hidden="true" />
                    7 dias de garantia
                  </span>
                </div>
              </div>
            </div>

            <!-- Carrossel / Leque de cartas animadas (PRIMEIRO NO MOBILE para prender atenção) -->
            <div class="order-1 min-w-0 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1">
              <div
                class="relative mx-auto flex max-w-[560px] flex-col items-center"
                @mouseenter="isHeroDeckPaused = true"
                @mouseleave="isHeroDeckPaused = false"
              >
                <div
                  class="relative flex h-[296px] w-full items-center justify-center sm:h-[385px]"
                  @touchstart.passive="pauseHeroDeckTemporarily"
                >
                  <div
                    v-for="(card, idx) in deckCards"
                    :key="card.id"
                    class="absolute w-[198px] overflow-hidden rounded-2xl border-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[252px]"
                    :class="getHeroCardSlotClass(idx)"
                    @click="focusHeroCard(idx)"
                  >
                    <ProtectedPreviewCanvas
                      :src="card.image"
                      :alt="`Amostra protegida: ${card.moduleLabel} — ${card.title}`"
                      :mask-bottom="true"
                      :watermark="true"
                      :interactive="idx === heroDeckIndex"
                    />
                  </div>
                </div>

                <!-- Controles táteis do baralho -->
                <div class="mt-2 flex items-center gap-2 rounded-full border border-white/25 bg-navy-deep/45 px-2.5 py-1.5 text-[0.7rem] font-semibold text-white/90 backdrop-blur-md">
                  <button
                    type="button"
                    aria-label="Carta anterior"
                    class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-cyan-glow hover:text-navy-deep"
                    @click="pauseHeroDeckTemporarily(); stepHeroDeck(-1)"
                  >
                    <ChevronLeft class="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <div class="flex items-center gap-1.5 px-1">
                    <button
                      v-for="(card, idx) in deckCards"
                      :key="card.id"
                      type="button"
                      :aria-label="`Mostrar carta ${idx + 1}: ${card.title}`"
                      class="h-2 cursor-pointer rounded-full transition-all duration-300"
                      :class="idx === heroDeckIndex ? 'w-5 bg-cyan-glow' : 'w-2 bg-white/35 hover:bg-white/65'"
                      @click="pauseHeroDeckTemporarily(); focusHeroCard(idx)"
                    />
                  </div>

                  <button
                    type="button"
                    aria-label="Próxima carta"
                    class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-cyan-glow hover:text-navy-deep"
                    @click="pauseHeroDeckTemporarily(); stepHeroDeck(1)"
                  >
                    <ChevronRight class="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Painel de destaque com ícones visíveis no mobile e desktop -->
            <div class="order-3 min-w-0 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-2">
              <div class="mx-auto grid w-full max-w-[560px] grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                <a
                  href="#por-dentro"
                  class="group flex items-center justify-between gap-3 rounded-2xl border border-white/25 bg-navy-deep/55 px-4 py-3 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_14px_30px_-14px_rgba(2,11,58,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/45 hover:bg-navy-deep/70 sm:flex-col sm:items-stretch sm:justify-between sm:gap-2.5 sm:py-3.5"
                >
                  <div class="flex items-center gap-2.5 sm:justify-between">
                    <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/14 text-cyan-glow sm:order-2 sm:h-7 sm:w-7 sm:rounded-full">
                      <FileText class="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    </span>
                    <span class="whitespace-nowrap text-[0.68rem] font-bold tracking-[0.06em] text-cyan-light uppercase sm:order-1">Conteúdo A4</span>
                  </div>
                  <div class="text-right sm:text-left">
                    <strong class="block text-xl font-extrabold tracking-tight text-white tabular-nums">50+ págs</strong>
                    <span class="block text-[0.72rem] leading-tight text-white/80">PDF ilustrado A4</span>
                  </div>
                </a>

                <button
                  type="button"
                  class="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/25 bg-navy-deep/55 px-4 py-3 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_14px_30px_-14px_rgba(2,11,58,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/45 hover:bg-navy-deep/70 sm:flex-col sm:items-stretch sm:justify-between sm:gap-2.5 sm:py-3.5"
                  @click="selectKitAndScroll('basico')"
                >
                  <div class="flex items-center gap-2.5 sm:justify-between">
                    <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/14 text-cyan-glow sm:order-2 sm:h-7 sm:w-7 sm:rounded-full">
                      <Layers class="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    </span>
                    <span class="text-[0.68rem] font-bold tracking-[0.08em] text-cyan-light uppercase sm:order-1">Kit Básico</span>
                  </div>
                  <div class="text-right sm:text-left">
                    <strong class="block text-xl font-extrabold tracking-tight text-white tabular-nums">R$ 15,00</strong>
                  </div>
                </button>

                <button
                  type="button"
                  class="group relative flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-cyan-glow/65 bg-gradient-to-br from-navy-deep/85 via-navy-deep/75 to-cobalt/80 px-4 py-3 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(23,221,242,0.35),0_16px_34px_-14px_rgba(2,11,58,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-glow sm:flex-col sm:items-stretch sm:justify-between sm:gap-2.5 sm:py-3.5"
                  @click="selectKitAndScroll('premium')"
                >
                  <div class="flex items-center gap-2.5 sm:justify-between">
                    <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-glow/20 text-cyan-glow sm:order-2 sm:h-7 sm:w-7 sm:rounded-full">
                      <Sparkles class="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    </span>
                    <span class="inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold tracking-[0.08em] text-cyan-glow uppercase sm:order-1">
                      <span class="h-1.5 w-1.5 rounded-full bg-cyan-glow" aria-hidden="true" />
                      Kit Premium
                    </span>
                  </div>
                  <div class="text-right sm:text-left">
                    <strong class="block text-xl font-extrabold tracking-tight text-white tabular-nums">R$ 27,90</strong>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 2: RASPADINHA INTERATIVA EM CANVAS (Essencial direto ao ponto) -->
      <section id="por-dentro" class="bg-ice-white px-5 py-12 text-navy-deep lg:py-20">
        <div class="mx-auto w-full max-w-[1200px]">
          <div class="mb-7 flex flex-col justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
            <div>
              <h2 class="mb-2 text-[clamp(1.75rem,3.6vw,2.85rem)] font-bold leading-[1.12] tracking-[-0.03em] text-navy-deep">
                Veja como o material é <span class="insuria-pill-highlight">por dentro</span>
              </h2>
              <p class="max-w-[62ch] text-sm text-ink-muted sm:text-base">
                <strong>Raspadinha interativa:</strong> passe o dedo ou mouse abaixo para revelar temporariamente as páginas (fecha após 2,5s).
              </p>
            </div>
            <a
              href="#kits"
              class="btn-mcp-convert group hidden shrink-0 self-start text-sm lg:inline-flex"
            >
              <span>Desbloquear material completo</span>
              <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          </div>

          <!-- Apenas 4 amostras protegidas renderizadas em <canvas> com efeito raspadinha -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <article
              v-for="page in REAL_PAGE_PREVIEWS"
              :key="page.id"
              class="flex flex-col overflow-hidden rounded-2xl border border-cobalt/15 bg-white shadow-sm"
            >
              <div class="relative bg-navy-deep">
                <ProtectedPreviewCanvas
                  :src="page.image"
                  :alt="`${page.pageLabel} — ${page.title}`"
                  :mask-bottom="true"
                  :watermark="true"
                  :interactive="true"
                />
                <span class="pointer-events-none absolute right-3 bottom-3 left-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-cyan-glow/40 bg-navy-deep/85 px-3 py-1.5 text-[0.68rem] font-bold text-cyan-glow backdrop-blur-sm">
                  <Lock class="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>Passe para raspar · PDF completo</span>
                </span>
              </div>
              <div class="p-3.5 sm:p-4">
                <span class="block text-[0.68rem] font-extrabold text-blue-electric uppercase">
                  {{ page.moduleLabel }}
                </span>
                <strong class="mt-0.5 block text-sm font-bold leading-snug text-navy-deep">
                  {{ page.title }}
                </strong>
              </div>
            </article>
          </div>

          <!-- CTA aparece após o usuário interagir com as raspadinhas no mobile -->
          <div class="mt-7 text-center lg:hidden">
            <a
              href="#kits"
              class="btn-mcp-convert btn-mcp-lg group w-full text-sm sm:w-auto"
            >
              <span>Desbloquear material completo</span>
              <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 3: OS 8 MÓDULOS COMPLETOS (Compacto e escaneável no mobile) -->
      <section id="modulos-kit" class="bg-white px-5 py-12 text-navy-deep lg:py-20">
        <div class="mx-auto w-full max-w-[1180px]">
          <div class="mx-auto mb-8 max-w-[760px] text-center lg:mb-12">
            <h2 class="mb-2 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-navy-deep">
              Tudo do ECA organizado em <span class="insuria-pill-highlight">8 Módulos</span>
            </h2>
            <p class="text-sm text-ink-muted sm:text-base">
              Conteúdo visual dividido por assunto para estudar rápido e fixar sem decoreba.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <article
              v-for="mod in KIT_MODULES"
              :key="mod.number"
              class="group flex flex-col overflow-hidden rounded-[22px] border border-cobalt/12 bg-ice-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-electric/40 hover:bg-white hover:shadow-[0_22px_44px_-18px_rgba(5,42,131,0.22)]"
            >
              <div class="relative overflow-hidden bg-ice-tint">
                <img
                  :src="mod.image"
                  :alt="`${mod.number} — ${mod.title}`"
                  width="760"
                  height="428"
                  loading="lazy"
                  class="block aspect-[16/9] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span class="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-navy-deep/85 px-3 py-1 text-[0.66rem] font-extrabold tracking-[0.06em] text-cyan-glow uppercase backdrop-blur-sm">
                  <component :is="moduleIcons[mod.iconName]" class="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>{{ mod.number }}</span>
                </span>
              </div>

              <div class="flex flex-1 flex-col p-4 sm:p-5">
                <h3 class="mb-1.5 text-base font-extrabold leading-tight text-navy-deep sm:text-lg">
                  {{ mod.title }}
                </h3>
                <p class="text-xs leading-relaxed text-ink-muted sm:text-sm">{{ mod.description }}</p>
              </div>
            </article>
          </div>

          <div class="mt-8 text-center lg:mt-10">
            <a
              href="#kits"
              class="btn-mcp-convert btn-mcp-lg group w-full sm:w-auto"
            >
              <span>Quero meu kit de estudos</span>
              <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 4: 3 BÔNUS EXCLUSIVOS (Constrói valor antes do preço) -->
      <section id="bonus-kit" class="insuria-sky-gradient px-5 py-12 text-navy-deep lg:py-20">
        <div class="mx-auto w-full max-w-[1180px]">
          <div class="mx-auto mb-8 max-w-[740px] text-center lg:mb-12">
            <h2 class="mb-2 text-[clamp(1.75rem,3.4vw,2.65rem)] font-bold leading-[1.12] tracking-[-0.03em] text-navy-deep">
              Bônus exclusivos do <span class="insuria-pill-highlight">Kit Premium</span>
            </h2>
            <p class="text-sm text-ink-muted sm:text-base">
              Materiais extras incluídos no Kit Premium para organizar seus estudos até o dia da prova.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-3 md:gap-6">
            <article
              v-for="bonus in KIT_BONUSES"
              :key="bonus.code"
              class="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-cobalt/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-electric/45 hover:shadow-[0_24px_48px_-18px_rgba(5,42,131,0.2)]"
            >
              <div>
                <div class="relative overflow-hidden bg-ice-tint">
                  <img
                    :src="bonus.image"
                    :alt="`${bonus.code} — ${bonus.title}`"
                    width="760"
                    height="428"
                    loading="lazy"
                    class="block aspect-[16/9] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <span class="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-navy-deep/85 px-3 py-1 text-[0.68rem] font-extrabold tracking-[0.06em] text-cyan-glow uppercase backdrop-blur-sm">
                    <component :is="bonusIcons[bonus.iconName]" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{{ bonus.code }}</span>
                  </span>
                </div>

                <div class="p-5 sm:p-6">
                  <h3 class="mb-2 text-lg font-extrabold text-navy-deep">{{ bonus.title }}</h3>
                  <p class="text-sm leading-relaxed text-ink-muted">{{ bonus.description }}</p>
                </div>
              </div>

              <div class="border-t border-cobalt/10 bg-ice-white/60 px-5 py-3.5 sm:px-6">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-electric">
                  <Gift class="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Incluso no Kit Premium (PDF)</span>
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 5: ESCOLHA SEU KIT -->
      <section id="kits" class="bg-ice-white px-3 py-10 sm:px-5 lg:py-16">
        <div class="insuria-hero-canvas mx-auto w-full max-w-[1260px] rounded-[28px] px-4 py-10 text-white sm:rounded-[34px] sm:px-10 lg:p-14">
          <div class="mx-auto mb-8 max-w-[740px] text-center lg:mb-10">
            <h2 class="mb-2 text-[clamp(1.8rem,3.6vw,2.9rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
              Escolha seu kit e comece hoje sua preparação para Conselheiro Tutelar 2027
            </h2>
            <p class="text-sm text-white/90 sm:text-base">
              Pagamento único via Pix · Acesso digital imediato aos arquivos em PDF.
            </p>
          </div>

          <div class="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-8">
            <article
              v-for="tier in KIT_TIERS"
              :key="tier.id"
              class="flex min-w-0 flex-col justify-between rounded-[26px] transition-all duration-200"
              :class="
                tier.id === 'premium'
                  ? 'order-1 bg-white p-6 text-navy-deep shadow-[0_28px_60px_-15px_rgba(2,11,58,0.45)] ring-4 ring-cyan-glow/75 sm:p-9 lg:order-2'
                  : 'order-2 border border-white/25 bg-white/12 p-5 text-white backdrop-blur-md sm:p-6 lg:order-1 lg:self-end'
              "
            >
              <div>
                <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3
                    class="font-extrabold tracking-wide uppercase"
                    :class="tier.id === 'premium' ? 'text-xl text-navy-deep' : 'text-base text-white/95'"
                  >
                    {{ tier.name }}
                  </h3>
                  <span
                    v-if="tier.badge"
                    class="rounded-full bg-navy-deep px-3 py-1 text-[0.7rem] font-extrabold text-cyan-glow uppercase"
                  >
                    {{ tier.badge }}
                  </span>
                </div>

                <div class="mb-5 flex items-baseline gap-1.5 pt-2 tabular-nums">
                  <span class="text-lg font-bold" :class="tier.id === 'premium' ? 'text-cobalt' : 'text-cyan-glow'">
                    R$
                  </span>
                  <strong
                    class="font-extrabold tracking-tight"
                    :class="tier.id === 'premium' ? 'text-4xl sm:text-[3.25rem]' : 'text-3xl sm:text-4xl'"
                  >
                    {{ tier.priceFormatted }}
                  </strong>
                  <span class="text-xs font-semibold opacity-80">Pagamento único</span>
                </div>

                <p
                  class="mb-2.5 text-xs font-bold uppercase"
                  :class="tier.id === 'premium' ? 'text-cobalt' : 'text-cyan-glow'"
                >
                  Você recebe:
                </p>

                <ul
                  class="grid text-sm"
                  :class="tier.id === 'premium' ? 'mb-8 gap-2.5' : 'mb-6 gap-2 text-[0.84rem]'"
                >
                  <li
                    v-for="feat in tier.features"
                    :key="feat"
                    class="flex items-start gap-2.5"
                  >
                    <CheckCircle2
                      class="mt-0.5 h-4 w-4 shrink-0"
                      :class="tier.id === 'premium' ? 'text-blue-electric' : 'text-cyan-glow'"
                      aria-hidden="true"
                    />
                    <span>{{ feat }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  class="group w-full uppercase"
                  :class="
                    tier.id === 'premium'
                      ? 'btn-mcp-convert btn-mcp-lg text-sm sm:text-[0.95rem]'
                      : 'btn-mcp-hero btn-mcp-sm text-xs sm:text-sm'
                  "
                  @click="selectKitAndScroll(tier.id)"
                >
                  <span>
                    {{
                      tier.id === 'premium'
                        ? `Garantir Kit Premium · R$ ${tier.priceFormatted}`
                        : `Escolher Kit Básico · R$ ${tier.priceFormatted}`
                    }}
                  </span>
                  <span
                    class="btn-mcp-arrow-badge"
                    :class="tier.id === 'premium' ? 'btn-mcp-arrow-badge--emerald' : 'btn-mcp-arrow-badge--navy'"
                  >
                    <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </button>
                <p
                  class="mt-3 text-center text-xs font-medium"
                  :class="tier.id === 'premium' ? 'text-ink-muted' : 'text-white/80'"
                >
                  {{
                    tier.id === 'premium'
                      ? 'Recomendado · 50 páginas + 3 Bônus exclusivos · Garantia de 7 dias'
                      : 'Versão inicial · Acesso digital · Garantia de 7 dias'
                  }}
                </p>
              </div>
            </article>
          </div>

          <!-- Garantia 7 dias -->
          <div class="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-white/25 bg-white/12 p-5 text-center backdrop-blur-md sm:flex-row sm:text-left">
            <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-cobalt">
              <ShieldCheck class="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <strong class="block text-base font-bold text-white">Sua compra conta com 7 dias de garantia</strong>
              <p class="text-xs leading-relaxed text-white/85 sm:text-sm">
                Você poderá conhecer o material e conferir se ele atende às suas expectativas. Caso não fique satisfeito, basta solicitar o reembolso dentro de 7 dias.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 6: PARA QUEM É & FORMA VISUAL DE ESTUDAR (Reforço pós-oferta para indecisos) -->
      <section class="bg-white px-5 py-12 text-navy-deep lg:py-18">
        <div class="mx-auto w-full max-w-[1180px]">
          <div class="mb-10 rounded-[28px] bg-ice-white p-6 shadow-xs sm:p-9">
            <div class="grid items-center gap-6 lg:grid-cols-[0.45fr_0.55fr] lg:gap-8">
              <div>
                <h2 class="mb-2 text-2xl font-bold tracking-[-0.02em] text-navy-deep sm:text-3xl">
                  Este material é para você que deseja:
                </h2>
                <p class="text-xs leading-relaxed text-ink-muted sm:text-sm">
                  Os requisitos e conteúdos das avaliações podem variar conforme a legislação e o edital de cada município. Este é um material de estudo independente, baseado em conteúdos de referência nacional.
                </p>
              </div>
              <ul class="grid gap-2.5 sm:gap-3">
                <li
                  v-for="goal in KIT_TARGET_GOALS"
                  :key="goal"
                  class="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-navy-deep shadow-xs"
                >
                  <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-blue-electric" aria-hidden="true" />
                  <span>{{ goal }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div
              v-for="item in KIT_STUDY_BENEFITS"
              :key="item.title"
              class="rounded-[22px] border border-cobalt/12 bg-ice-tint/45 p-5"
            >
              <span class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-cobalt shadow-xs">
                <component :is="benefitIcons[item.iconName]" class="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 class="mb-1.5 text-base font-extrabold text-navy-deep">{{ item.title }}</h3>
              <p class="text-xs leading-relaxed text-ink-muted sm:text-sm">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 7: AUTORIDADE REAL (WAGNER MACEDO) -->
      <section class="bg-ice-white px-5 py-12 text-navy-deep lg:py-16">
        <div class="mx-auto grid w-full max-w-[1160px] items-center gap-8 rounded-[32px] bg-white p-6 shadow-md sm:p-10 lg:grid-cols-12">
          <figure class="min-w-0 overflow-hidden rounded-[22px] bg-ice-tint lg:col-span-4">
            <img
              :src="WAGNER_PROFILE.image"
              :alt="WAGNER_PROFILE.name"
              width="620"
              height="720"
              loading="lazy"
              class="block aspect-[6/7] w-full object-cover object-top"
            />
          </figure>
          <div class="min-w-0 lg:col-span-8">
            <h2 class="mb-2 text-2xl font-bold tracking-[-0.02em] text-navy-deep sm:text-3xl">
              Idealizado por <span class="insuria-pill-highlight">{{ WAGNER_PROFILE.name }}</span>
            </h2>
            <p class="mb-4 text-sm font-bold text-blue-electric">{{ WAGNER_PROFILE.role }}</p>
            <p class="mb-5 text-sm leading-relaxed text-ink-muted sm:text-base">{{ WAGNER_PROFILE.summary }}</p>
            <ul class="grid gap-2.5 text-sm font-medium text-navy-deep sm:grid-cols-2">
              <li
                v-for="cred in WAGNER_PROFILE.credentials"
                :key="cred"
                class="flex items-start gap-2"
              >
                <Award class="mt-0.5 h-4 w-4 shrink-0 text-blue-electric" aria-hidden="true" />
                <span>{{ cred }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 8: FAQ ESTRUTURADO COM SUPORTE DIRETO -->
      <section id="faq" class="bg-white px-5 py-14 text-navy-deep lg:py-20">
        <div class="mx-auto grid w-full max-w-[1180px] items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <!-- Coluna Esquerda: Título + Card de Suporte Rápido no WhatsApp -->
          <div class="min-w-0 lg:sticky lg:top-8 lg:col-span-5">
            <span class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-ice-tint px-3 py-1 text-[0.7rem] font-extrabold tracking-[0.08em] text-cobalt uppercase">
              <Sparkles class="h-3.5 w-3.5 text-blue-electric" aria-hidden="true" />
              Dúvidas frequentes · Kit 2027
            </span>
            <h2 class="mb-3 text-[clamp(1.85rem,3.4vw,2.65rem)] font-bold leading-[1.12] tracking-[-0.03em] text-navy-deep">
              Perguntas <span class="insuria-pill-highlight">frequentes</span>
            </h2>
            <p class="mb-6 text-sm leading-relaxed text-ink-muted sm:text-base">
              Respostas diretas sobre entrega do PDF, estudo pelo celular ou impressão, pagamento no Pix e garantia incondicional.
            </p>

            <!-- Card de Suporte / Conversão -->
            <div class="rounded-[26px] bg-gradient-to-br from-navy-deep via-cobalt to-blue-electric p-6 text-white shadow-[0_24px_50px_-18px_rgba(2,11,58,0.45)]">
              <div class="mb-4 flex items-center gap-3">
                <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-cyan-glow backdrop-blur-sm">
                  <MessageCircle class="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <strong class="block text-base font-extrabold leading-tight text-white">Ficou alguma dúvida antes do Pix?</strong>
                  <span class="text-xs text-cyan-light">Atendimento direto pelo WhatsApp</span>
                </div>
              </div>

              <p class="mb-5 text-xs leading-relaxed text-white/85 sm:text-sm">
                Se preferir confirmar algum detalhe sobre os 8 módulos ou o recebimento do arquivo, nossa equipe responde rápido pelo WhatsApp.
              </p>

              <div class="flex flex-col gap-2.5">
                <a
                  href="#kits"
                  class="btn-mcp-convert group w-full text-xs sm:text-sm"
                >
                  <span>Garantir meu Kit agora</span>
                  <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                    <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </a>
                <a
                  :href="whatsappKitHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-mcp-glass w-full text-xs sm:text-sm"
                >
                  <MessageCircle class="h-4 w-4 shrink-0 text-cyan-glow" aria-hidden="true" />
                  <span>Tirar dúvida no {{ COMPANY_INFO.phone }}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Coluna Direita: Acordeão numerado e tátil -->
          <div class="grid min-w-0 gap-3 lg:col-span-7">
            <article
              v-for="(faq, idx) in KIT_FAQS"
              :key="faq.id"
              class="overflow-hidden rounded-[22px] border transition-all duration-200"
              :class="
                openFaqId === faq.id
                  ? 'border-blue-electric/50 bg-ice-white shadow-[0_16px_34px_-16px_rgba(5,42,131,0.22)] ring-2 ring-blue-electric/15'
                  : 'border-cobalt/12 bg-ice-white/55 hover:border-blue-electric/35 hover:bg-white'
              "
            >
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-6 sm:py-5"
                :aria-expanded="openFaqId === faq.id"
                @click="toggleFaq(faq.id)"
              >
                <div class="flex min-w-0 items-center gap-3.5">
                  <span
                    class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold tabular-nums transition-colors duration-200"
                    :class="
                      openFaqId === faq.id
                        ? 'bg-navy-deep text-cyan-glow'
                        : 'bg-white text-cobalt shadow-xs'
                    "
                  >
                    {{ String(idx + 1).padStart(2, '0') }}
                  </span>
                  <span class="text-sm font-extrabold leading-snug text-navy-deep sm:text-[1.02rem]">
                    {{ faq.question }}
                  </span>
                </div>

                <span
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200"
                  :class="
                    openFaqId === faq.id
                      ? 'bg-blue-electric text-white'
                      : 'bg-white text-cobalt shadow-xs'
                  "
                >
                  <ChevronDown
                    class="h-4 w-4 transition-transform duration-200"
                    :class="openFaqId === faq.id ? 'rotate-180' : ''"
                    aria-hidden="true"
                  />
                </span>
              </button>

              <div
                class="faq-accordion-panel"
                :class="{ 'is-open': openFaqId === faq.id }"
                :aria-hidden="openFaqId !== faq.id"
              >
                <div class="faq-accordion-inner">
                  <div class="faq-accordion-content border-t border-cobalt/10 bg-white px-4 pt-3.5 pb-5 pl-[3.6rem] text-sm leading-relaxed text-ink-muted sm:px-6 sm:pt-4 sm:pb-5 sm:pl-[4.35rem]">
                    <p>{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer com dados oficiais e aviso legal -->
    <footer class="border-t border-navy-deep/12 bg-white px-5 py-8 text-xs text-ink-muted">
      <div class="mx-auto w-full max-w-[1160px] space-y-4">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <strong class="block text-sm font-extrabold text-navy-deep">
              Kit Conselheiro Tutelar 2027 · Método Construindo Pontes
            </strong>
            <span>{{ COMPANY_INFO.legalName }} · CNPJ {{ COMPANY_INFO.cnpj }} · {{ COMPANY_INFO.address }}</span>
          </div>
          <div class="flex flex-col gap-1 font-medium sm:text-right">
            <span>{{ COMPANY_INFO.email }}</span>
            <span>WhatsApp / Telefone: {{ COMPANY_INFO.phone }}</span>
          </div>
        </div>
        <p class="border-t border-navy-deep/10 pt-4 text-[0.72rem] leading-relaxed">
          Material de estudo independente, sem vínculo oficial com o Conselho Tutelar, CONANDA, CMDCA ou órgãos governamentais. Os conteúdos e exigências das seleções devem ser conferidos junto à legislação vigente e ao edital municipal.
        </p>
      </div>
    </footer>

    <!-- Barra Mobile Fixa -->
    <div class="fixed right-0 bottom-0 left-0 z-30 border-t border-navy-deep/12 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div class="mx-auto flex max-w-[600px] items-center justify-between gap-3">
        <div class="tabular-nums">
          <span class="block text-[0.7rem] font-semibold text-ink-muted">Kits em PDF · Acesso imediato</span>
          <strong class="text-base font-extrabold text-navy-deep">R$ 15,00 ou R$ 27,90</strong>
        </div>
        <a
          href="#kits"
          class="btn-mcp-convert btn-mcp-sm group shrink-0 whitespace-nowrap"
        >
          <Lock class="h-3.5 w-3.5 shrink-0 text-emerald-100" aria-hidden="true" />
          <span>Escolher Kit</span>
          <ArrowRight class="btn-mcp-icon-arrow h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>

    <!-- Popup 2 Passos: QR Code Pix EMV + Envio no WhatsApp -->
    <PixEmvCheckoutModal
      :open="isCheckoutModalOpen"
      :plan="activeCheckoutPlan"
      :alternate-plan="alternateCheckoutPlan"
      @close="isCheckoutModalOpen = false"
      @select-plan="handleSwitchModalPlan"
    />
  </div>
</template>
