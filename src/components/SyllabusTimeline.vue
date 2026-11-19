<script setup lang="ts">
import type { Component } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import gsap from 'gsap'
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  FileCheck2,
  Scale,
  Waypoints,
} from 'lucide-vue-next'
import { MODULES } from '../data/landing'

const activeId = ref<string>(MODULES[0]?.id ?? 'mod-1')
const detailRef = ref<HTMLElement | null>(null)

const activeModule = computed(
  () => MODULES.find((m) => m.id === activeId.value) ?? MODULES[0],
)

watch(activeId, async () => {
  await nextTick()
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced || !detailRef.value) return
  gsap.fromTo(
    detailRef.value,
    { y: 10, opacity: 0.45 },
    { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' },
  )
})

const moduleIcons: Record<string, Component> = {
  'mod-1': BookOpenCheck,
  'mod-2': Scale,
  'mod-3': Waypoints,
  'mod-4': FileCheck2,
}
</script>

<template>
  <section id="conteudo" class="bg-white px-5 py-16 text-navy-deep lg:py-24">
    <div class="mx-auto w-full max-w-[1160px]">
      <div class="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <h2 class="max-w-[660px] text-[clamp(1.9rem,3.6vw,2.85rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-navy-deep">
          Os <span class="insuria-pill-highlight">4 módulos</span> do preparatório
        </h2>
        <p class="max-w-[460px] text-sm leading-relaxed text-ink-muted sm:text-base">
          Explore cada etapa do curso para ver os artigos do ECA, os materiais inclusos e a pegadinha clássica que você aprende a evitar.
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-12">
        <!-- Lista de módulos -->
        <div class="grid min-w-0 gap-3 lg:col-span-5">
          <button
            v-for="mod in MODULES"
            :key="mod.id"
            type="button"
            class="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-[22px] border p-5 text-left transition-all duration-200"
            :class="
              activeId === mod.id
                ? 'border-blue-electric bg-navy-deep text-white shadow-lg'
                : 'border-cobalt/12 bg-ice-tint/70 text-navy-deep hover:border-blue-electric/45 hover:bg-ice-tint'
            "
            :aria-pressed="activeId === mod.id"
            @click="activeId = mod.id"
          >
            <div class="flex items-start gap-3.5">
              <span
                class="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
                :class="
                  activeId === mod.id
                    ? 'bg-blue-electric text-white'
                    : 'bg-white text-cobalt shadow-xs'
                "
              >
                <component :is="moduleIcons[mod.id]" class="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <div class="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    class="text-xs font-bold uppercase"
                    :class="activeId === mod.id ? 'text-cyan-glow' : 'text-cobalt'"
                  >
                    {{ mod.code }}
                  </span>
                  <span
                    class="text-xs font-medium"
                    :class="activeId === mod.id ? 'text-cyan-light' : 'text-ink-muted'"
                  >
                    · {{ mod.articles }}
                  </span>
                </div>
                <strong class="block text-sm font-bold leading-snug sm:text-base">
                  {{ mod.title }}
                </strong>
              </div>
            </div>

            <ArrowRight
              class="h-4 w-4 shrink-0 transition-transform duration-200"
              :class="activeId === mod.id ? 'translate-x-1 text-cyan-glow' : 'text-ink-muted group-hover:translate-x-0.5'"
              aria-hidden="true"
            />
          </button>
        </div>

        <!-- Painel detalhado -->
        <div class="flex min-w-0 flex-col justify-between rounded-[28px] border border-cobalt/12 bg-ice-tint/55 p-6 sm:p-9 lg:col-span-7">
          <div ref="detailRef">
            <div class="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-navy-deep/10 pb-4">
              <span class="rounded-full bg-white px-3.5 py-1 text-xs font-bold text-cobalt shadow-xs">
                {{ activeModule.code }} · {{ activeModule.articles }}
              </span>
              <span class="rounded-full bg-[#d6eaff] px-3 py-1 text-xs font-semibold text-navy-deep">
                {{ activeModule.placeholderNote }}
              </span>
            </div>

            <h3 class="mb-3 text-2xl font-bold leading-tight text-navy-deep">
              {{ activeModule.title }}
            </h3>

            <p class="mb-6 text-base leading-relaxed text-ink-muted">
              {{ activeModule.description }}
            </p>

            <div class="mb-6">
              <h4 class="mb-3 text-xs font-bold tracking-wider text-cobalt uppercase">
                O que está incluso neste módulo
              </h4>
              <ul class="grid gap-2.5 sm:grid-cols-2">
                <li
                  v-for="item in activeModule.deliverables"
                  :key="item"
                  class="flex items-start gap-2.5 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-navy-deep shadow-xs"
                >
                  <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-blue-electric" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl border border-blue-electric/25 bg-white p-5">
              <div class="mb-1.5 flex items-center gap-2 text-xs font-extrabold tracking-wide text-cobalt uppercase">
                <AlertTriangle class="h-4 w-4 shrink-0 text-blue-electric" aria-hidden="true" />
                <span>Pegadinha clássica de banca</span>
              </div>
              <p class="text-sm font-medium leading-relaxed text-navy-deep">
                {{ activeModule.examTrap }}
              </p>
            </div>
          </div>

          <figure class="mt-7 grid items-center gap-4 border-t border-navy-deep/10 pt-5 sm:grid-cols-[0.4fr_0.6fr]">
            <img
              src="/assets/candidate-study.jpg"
              alt="Candidata estudando para o processo de escolha do Conselho Tutelar"
              width="1408"
              height="792"
              loading="lazy"
              class="block aspect-video w-full rounded-2xl object-cover object-top"
            />
            <figcaption class="text-xs leading-relaxed text-ink-muted">
              <strong class="mb-1 block text-sm font-bold text-navy-deep">Pensado para quem trabalha o dia inteiro</strong>
              Aulas diretas ao que é cobrado nas bancas municipais para revisar com clareza no tempo disponível.
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>
