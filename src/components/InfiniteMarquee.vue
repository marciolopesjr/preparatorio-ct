<script setup lang="ts">
import {
  Award,
  BookOpen,
  Landmark,
  Scale,
  ShieldCheck,
  Target,
  Waypoints,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { MARQUEE_ITEMS } from '../data/landing'

const iconMap: Record<string, Component> = {
  ShieldCheck,
  Scale,
  BookOpen,
  Landmark,
  Target,
  Waypoints,
  Award,
}
</script>

<template>
  <div
    class="marquee-container overflow-hidden border-y border-cobalt/10 bg-white py-3.5"
    aria-label="Temas centrais do preparatório"
  >
    <div class="marquee-track">
      <div
        v-for="copy in 2"
        :key="copy"
        class="flex shrink-0 items-center gap-8 pr-8"
        :aria-hidden="copy === 2"
      >
        <span
          v-for="item in MARQUEE_ITEMS"
          :key="`${copy}-${item.label}`"
          class="inline-flex items-center gap-2.5 whitespace-nowrap text-xs font-semibold tracking-wide text-cobalt"
        >
          <component
            :is="iconMap[item.icon]"
            class="h-3.5 w-3.5 shrink-0 text-blue-electric"
            aria-hidden="true"
          />
          <span>{{ item.label }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
