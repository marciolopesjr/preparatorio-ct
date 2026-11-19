<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div class="fixed right-0 bottom-0 left-0 z-30 border-t border-navy-deep/12 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-8px_rgba(2,11,58,0.12)] backdrop-blur-md md:hidden">
    <div class="mx-auto flex max-w-[600px] items-center justify-between gap-3">
      <div class="whitespace-nowrap tabular-nums">
        <span class="block text-[0.7rem] font-semibold text-ink-muted">
          De <s>R$ 99,90</s> · Só hoje
        </span>
        <strong class="text-lg font-extrabold text-navy-deep">R$ 29,90 no Pix</strong>
      </div>
      <a
        href="#oferta"
        class="btn-mcp-convert btn-mcp-sm group shrink-0 whitespace-nowrap"
      >
        <span>Garantir vaga</span>
        <ArrowRight class="btn-mcp-icon-arrow h-3.5 w-3.5 text-emerald-100" aria-hidden="true" />
      </a>
    </div>
  </div>
</template>
