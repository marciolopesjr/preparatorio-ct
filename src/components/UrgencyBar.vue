<script setup lang="ts">
import { Clock, Sparkles } from 'lucide-vue-next'
import { useCountdown } from '../composables/useCountdown'

const { formatted } = useCountdown()
</script>

<template>
  <div class="bg-navy-deep px-4 py-2 text-white">
    <div class="mx-auto flex w-full max-w-[1260px] flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs font-medium sm:justify-between">
      <span class="inline-flex items-center gap-2">
        <Sparkles class="h-3.5 w-3.5 shrink-0 text-cyan-glow" aria-hidden="true" />
        <span>
          Especial Dia do Conselheiro Tutelar (18/11) · Pré-venda de R$ 99,90 por
          <strong class="font-bold text-cyan-glow">R$ 29,90 no Pix</strong>
        </span>
      </span>
      <span class="inline-flex items-center gap-1.5 whitespace-nowrap font-bold text-cyan-light tabular-nums">
        <Clock class="h-3.5 w-3.5 shrink-0 text-cyan-glow" aria-hidden="true" />
        <span>Encerra hoje às 23:59 · {{ formatted }}</span>
      </span>
    </div>
  </div>
</template>
