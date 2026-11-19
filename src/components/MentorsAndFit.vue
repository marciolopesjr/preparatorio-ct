<script setup lang="ts">
import { Award, CheckCircle2, GraduationCap, MapPin, Scale } from 'lucide-vue-next'
import { AUDIENCE_FOR, WAGNER_PROFILE } from '../data/landing'

const credIcons = [MapPin, Award, Scale, GraduationCap]
</script>

<template>
  <section id="mentor" class="bg-ice-white px-5 py-16 text-navy-deep lg:py-24">
    <div class="mx-auto w-full max-w-[1160px]">
      <!-- Perfil Real de Wagner Macedo -->
      <div class="mb-12 grid items-center gap-8 rounded-[32px] bg-white p-6 shadow-[0_24px_56px_-20px_rgba(2,11,58,0.12)] sm:p-10 lg:grid-cols-12 lg:gap-12">
        <figure class="min-w-0 overflow-hidden rounded-[24px] bg-ice-tint lg:col-span-5">
          <img
            :src="WAGNER_PROFILE.image"
            :alt="WAGNER_PROFILE.name"
            width="620"
            height="720"
            loading="lazy"
            class="block aspect-[6/7] w-full object-cover object-top"
          />
        </figure>

        <div class="min-w-0 lg:col-span-7">
          <h2 class="mb-2 text-[clamp(1.85rem,3.4vw,2.65rem)] font-bold leading-[1.12] tracking-[-0.03em] text-navy-deep">
            Quem conduz o método: <span class="insuria-pill-highlight">{{ WAGNER_PROFILE.name }}</span>
          </h2>
          <p class="mb-4 text-sm font-bold text-blue-electric sm:text-base">
            {{ WAGNER_PROFILE.role }}
          </p>
          <p class="mb-7 text-base leading-relaxed text-ink-muted">
            {{ WAGNER_PROFILE.summary }}
          </p>

          <ul class="grid gap-3 border-t border-navy-deep/10 pt-6">
            <li
              v-for="(cred, idx) in WAGNER_PROFILE.credentials"
              :key="cred"
              class="flex items-start gap-3 text-sm font-medium leading-relaxed text-navy-deep sm:text-[0.95rem]"
            >
              <span class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ice-tint text-cobalt">
                <component :is="credIcons[idx]" class="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>{{ cred }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Para quem é este preparatório -->
      <div class="insuria-soft-card p-6 sm:p-9">
        <div class="grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <h3 class="mb-2 text-2xl font-bold tracking-[-0.02em] text-navy-deep">
              Para quem este preparatório foi criado
            </h3>
            <p class="text-sm leading-relaxed text-ink-muted sm:text-base">
              Clareza jurídica para quem quer aprovação no processo de escolha e segurança no exercício da função.
            </p>
          </div>
          <ul class="grid gap-3 sm:grid-cols-2">
            <li
              v-for="item in AUDIENCE_FOR"
              :key="item"
              class="flex items-start gap-2.5 rounded-2xl bg-white p-4 text-sm font-semibold leading-snug text-navy-deep shadow-xs"
            >
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-blue-electric" aria-hidden="true" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
