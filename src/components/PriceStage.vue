<script setup lang="ts">
import type { Component } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  BookOpenCheck,
  Clock,
  FileCheck2,
  Lock,
  QrCode,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'
import PixEmvCheckoutModal from './PixEmvCheckoutModal.vue'
import type { CheckoutPlanOption } from './PixEmvCheckoutModal.vue'
import { useCountdown } from '../composables/useCountdown'
import { PRICE_STACK_ITEMS } from '../data/landing'

gsap.registerPlugin(ScrollTrigger)

const { formatted } = useCountdown()
const stageRef = ref<HTMLElement | null>(null)
const displayPrice = ref('29,90')
const isCheckoutOpen = ref(false)

const preSalePlan: CheckoutPlanOption = {
  id: 'prevenda',
  name: 'Pré-venda Dia do Conselheiro (18/11)',
  oldPriceFormatted: '99,90',
  price: 29.9,
  priceFormatted: '29,90',
  txid: 'MCP1811PRE',
  description: 'Pre-venda MCP 18/11',
  whatsappMessage:
    'Olá! Acabei de fazer o Pix de R$ 29,90 da pré-venda do Preparatório para Conselheiros Tutelares (Método Construindo Pontes). Segue o comprovante.',
}

const stackIcons: Record<string, Component> = {
  BookOpenCheck,
  Scale,
  FileCheck2,
  Sparkles,
}

let ctx: gsap.Context | null = null

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced || !stageRef.value) return

  ctx = gsap.context(() => {
    const counter = { val: 99.9 }
    gsap.to(counter, {
      val: 29.9,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: stageRef.value,
        start: 'top 76%',
        once: true,
      },
      onUpdate: () => {
        displayPrice.value = counter.val.toFixed(2).replace('.', ',')
      },
    })
  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section id="oferta" ref="stageRef" class="bg-ice-white px-3 py-8 sm:px-5 lg:py-12">
    <div class="insuria-hero-canvas mx-auto w-full max-w-[1320px] overflow-hidden rounded-[26px] px-4 py-10 text-white sm:rounded-[34px] sm:px-10 lg:px-14 lg:py-16">
      <div class="mx-auto mb-10 max-w-[740px] text-center">
        <h2 class="mb-3 text-[clamp(2rem,3.8vw,3.1rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
          Garanta sua vaga na pré-venda por R$ 29,90 no Pix
        </h2>
        <p class="text-sm leading-relaxed text-white/90 sm:text-base">
          Promoção comemorativa do Dia do Conselheiro Tutelar (18/11) com <strong>70% de desconto</strong> até as 23:59 de hoje.
        </p>
      </div>

      <div class="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <!-- Esquerda: Value Stack -->
        <div class="min-w-0">
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-lg font-bold text-white sm:text-xl">
              Tudo o que está incluso hoje:
            </h3>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md tabular-nums">
              <Clock class="h-3.5 w-3.5 text-cyan-glow" aria-hidden="true" />
              {{ formatted }}
            </span>
          </div>

          <ul class="mb-6 grid gap-3">
            <li
              v-for="item in PRICE_STACK_ITEMS"
              :key="item.code"
              class="insuria-glass-card flex flex-wrap items-start justify-between gap-3 p-4 sm:flex-nowrap"
            >
              <div class="flex min-w-0 items-start gap-3">
                <span class="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-cobalt">
                  <component :is="stackIcons[item.iconName]" class="h-4 w-4" aria-hidden="true" />
                </span>
                <div class="min-w-0">
                  <strong class="block text-sm font-bold text-white sm:text-base">{{ item.label }}</strong>
                  <span class="block text-xs text-white/80">{{ item.detail }}</span>
                </div>
              </div>
              <span class="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[0.68rem] font-bold text-white uppercase">
                {{ item.badge }}
              </span>
            </li>
          </ul>

          <div class="flex items-start gap-3.5 rounded-2xl border border-white/25 bg-white/12 p-4 backdrop-blur-md sm:items-center sm:gap-4">
            <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-cobalt">
              <ShieldCheck class="h-5 w-5" aria-hidden="true" />
            </span>
            <div class="min-w-0">
              <strong class="block text-sm font-bold text-white">[Garantia Incondicional · ex: 7 dias]</strong>
              <p class="text-xs leading-relaxed text-white/85">
                [Ex: Garantia total após a liberação completa do curso para testar sem risco.]
              </p>
            </div>
          </div>
        </div>

        <!-- Direita: Cartão Branco de Pagamento Pix Oficial -->
        <div class="min-w-0 rounded-[24px] bg-white p-5 text-center text-navy-deep shadow-[0_28px_60px_-15px_rgba(2,11,58,0.35)] sm:rounded-[26px] sm:p-9">
          <span class="inline-block rounded-full bg-ice-tint px-3.5 py-1 text-xs font-bold text-cobalt">
            Pré-venda Dia do Conselheiro · 18/11
          </span>

          <p class="mt-3 text-sm font-medium text-ink-muted tabular-nums">
            Valor regular: <s>R$ 99,90</s>
          </p>

          <div class="my-2.5 flex items-baseline justify-center gap-2 whitespace-nowrap tabular-nums">
            <span class="text-2xl font-bold text-cobalt">R$</span>
            <strong class="text-[clamp(3rem,5.4vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em] text-navy-deep">
              {{ displayPrice }}
            </strong>
          </div>

          <p class="mb-6 text-xs font-bold text-blue-electric sm:text-sm">
            À vista no Pix · Economia imediata de R$ 70,00
          </p>

          <button
            type="button"
            class="btn-mcp-convert btn-mcp-lg group w-full text-sm sm:text-base"
            @click="isCheckoutOpen = true"
          >
            <QrCode class="h-4 w-4 shrink-0 text-emerald-100 sm:h-5 sm:w-5" aria-hidden="true" />
            <span>Pagar no Pix (QR Code · R$ 29,90)</span>
            <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
              <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>

          <p class="mt-4 flex items-start justify-center gap-1.5 text-xs leading-relaxed text-ink-muted">
            <Lock class="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-electric" aria-hidden="true" />
            <span>Liberação: <strong class="text-navy-deep">[Data da pré-venda]</strong> · Confirmação via WhatsApp ou e-mail</span>
          </p>
        </div>
      </div>
    </div>

    <PixEmvCheckoutModal
      :open="isCheckoutOpen"
      :plan="preSalePlan"
      @close="isCheckoutOpen = false"
    />
  </section>
</template>
