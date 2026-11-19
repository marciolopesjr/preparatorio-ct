<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, ChevronDown, MessageCircle, Sparkles } from 'lucide-vue-next'
import { COMPANY_INFO, FAQS } from '../data/landing'

const openFaqId = ref<string>(FAQS[0]?.id ?? '')

function toggleFaq(id: string) {
  openFaqId.value = openFaqId.value === id ? '' : id
}
</script>

<template>
  <section id="faq" class="bg-white px-5 py-16 text-navy-deep lg:py-20">
    <div class="mx-auto grid w-full max-w-[1160px] items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <div class="min-w-0 lg:sticky lg:top-8 lg:col-span-5">
        <span class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-ice-tint px-3 py-1 text-[0.7rem] font-extrabold tracking-[0.08em] text-cobalt uppercase">
          <Sparkles class="h-3.5 w-3.5 text-blue-electric" aria-hidden="true" />
          Dúvidas da pré-venda
        </span>
        <h2 class="mb-3 text-[clamp(1.85rem,3.4vw,2.6rem)] font-semibold leading-[1.14] tracking-[-0.03em] text-navy-deep">
          Perguntas <span class="insuria-pill-highlight">frequentes</span>
        </h2>
        <p class="mb-6 text-sm leading-relaxed text-ink-muted sm:text-base">
          Tire suas dúvidas antes de garantir a condição promocional de pré-venda do Dia do Conselheiro (R$ 29,90).
        </p>

        <div class="rounded-[26px] bg-gradient-to-br from-navy-deep via-cobalt to-blue-electric p-6 text-white shadow-[0_24px_50px_-18px_rgba(2,11,58,0.45)]">
          <div class="mb-3 flex items-center gap-3">
            <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-cyan-glow">
              <MessageCircle class="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <strong class="block text-base font-extrabold leading-tight text-white">Atendimento rápido</strong>
              <span class="text-xs text-cyan-light">{{ COMPANY_INFO.phone }}</span>
            </div>
          </div>
          <p class="mb-5 text-xs leading-relaxed text-white/85 sm:text-sm">
            Fale direto com nossa equipe no WhatsApp para confirmar pagamento no Pix ou tirar dúvidas sobre o curso.
          </p>
          <a
            :href="COMPANY_INFO.whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-mcp-convert group w-full text-xs sm:text-sm"
          >
            <span>Chamar no WhatsApp agora</span>
            <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
              <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

      <div class="grid min-w-0 gap-3 lg:col-span-7">
        <article
          v-for="(faq, idx) in FAQS"
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
</template>
