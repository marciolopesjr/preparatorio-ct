<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import QRCode from 'qrcode'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-vue-next'
import { COMPANY_INFO } from '../data/landing'
import { buildWhatsAppLink, generatePixEmvPayload } from '../utils/pixEmv'
import { track } from '../lib/tracker'

export interface CheckoutPlanOption {
  id: string
  name: string
  oldPriceFormatted?: string
  price: number
  priceFormatted: string
  txid: string
  description: string
  whatsappMessage: string
}

const props = defineProps<{
  open: boolean
  plan: CheckoutPlanOption
  alternatePlan?: CheckoutPlanOption | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select-plan', planId: string): void
}>()

const step = ref<1 | 2>(1)
const qrDataUrl = ref('')
const copiedEmv = ref(false)
const copiedCnpj = ref(false)
let emvTimer: ReturnType<typeof setTimeout> | null = null
let cnpjTimer: ReturnType<typeof setTimeout> | null = null

const emvPayload = computed(() =>
  generatePixEmvPayload({
    pixKey: COMPANY_INFO.pixKey,
    merchantName: 'JOAO PEDRO B SCHNEIDER',
    merchantCity: 'ESTEIO',
    amount: props.plan.price,
    txid: props.plan.txid,
    description: props.plan.description,
  }),
)

const whatsappHref = computed(() =>
  buildWhatsAppLink('555185716039', props.plan.whatsappMessage),
)

async function renderQr() {
  if (!props.open) return
  try {
    qrDataUrl.value = await QRCode.toDataURL(emvPayload.value, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#020b3a',
        light: '#ffffff',
      },
    })
  } catch {
    qrDataUrl.value = ''
  }
}

watch(
  () => [props.open, emvPayload.value] as const,
  ([isOpen]) => {
    if (isOpen) {
      renderQr()
    }
  },
  { immediate: true },
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      track('pix_modal_open', { kit: props.plan.id, price: props.plan.price })
      step.value = 1
      copiedEmv.value = false
      copiedCnpj.value = false
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeydown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
}

async function copyEmv() {
  await copyText(emvPayload.value)
  track('pix_copy', { kind: 'emv', kit: props.plan.id })
  copiedEmv.value = true
  if (emvTimer) clearTimeout(emvTimer)
  emvTimer = setTimeout(() => {
    copiedEmv.value = false
  }, 4500)
}

async function copyCnpj() {
  await copyText(COMPANY_INFO.pixKey)
  track('pix_copy', { kind: 'chave', kit: props.plan.id })
  copiedCnpj.value = true
  if (cnpjTimer) clearTimeout(cnpjTimer)
  cnpjTimer = setTimeout(() => {
    copiedCnpj.value = false
  }, 3500)
}

function goToWhatsAppStep() {
  track('whatsapp_click', { kit: props.plan.id })
  step.value = 2
}

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
  if (emvTimer) clearTimeout(emvTimer)
  if (cnpjTimer) clearTimeout(cnpjTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center bg-navy-deep/80 p-0 backdrop-blur-md sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`Pagamento Pix ${plan.name}`"
        @click.self="emit('close')"
      >
        <div class="relative max-h-[94dvh] w-full max-w-[540px] overflow-y-auto rounded-t-[28px] border border-cyan-glow/30 bg-white text-navy-deep shadow-[0_32px_80px_-15px_rgba(2,11,58,0.65)] sm:rounded-[28px]">
          <!-- Cabeçalho Azul Cobalt do Popup -->
          <div class="sticky top-0 z-10 flex items-center justify-between gap-3 bg-gradient-to-r from-navy-deep via-cobalt to-blue-electric px-5 py-4 text-white sm:px-6">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white/15 px-2.5 py-0.5 text-[0.66rem] font-extrabold tracking-wide text-cyan-glow uppercase">
                  Passo {{ step }} de 2
                </span>
                <span class="truncate text-xs font-bold text-white/90 uppercase">
                  {{ plan.name }}
                </span>
              </div>
              <div class="mt-1 flex items-baseline gap-2 tabular-nums">
                <strong class="text-xl font-extrabold text-white sm:text-2xl">
                  R$ {{ plan.priceFormatted }}
                </strong>
                <span class="text-[0.7rem] text-white/80">no Pix</span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Fechar janela de pagamento"
              class="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              @click="emit('close')"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <!-- Barra de progresso visual -->
          <div class="grid grid-cols-2 border-b border-cobalt/10 bg-ice-white text-center text-[0.72rem] font-extrabold uppercase">
            <button
              type="button"
              class="flex cursor-pointer items-center justify-center gap-1.5 py-2.5 transition-colors"
              :class="step === 1 ? 'border-b-2 border-blue-electric bg-white text-navy-deep' : 'text-emerald-700'"
              @click="step = 1"
            >
              <CheckCircle2 v-if="step === 2" class="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <QrCode v-else class="h-3.5 w-3.5 text-blue-electric" aria-hidden="true" />
              <span>1. Pagar no Pix</span>
            </button>
            <button
              type="button"
              class="flex cursor-pointer items-center justify-center gap-1.5 py-2.5 transition-colors"
              :class="step === 2 ? 'border-b-2 border-emerald-600 bg-white text-emerald-800' : 'text-ink-muted hover:text-cobalt'"
              @click="step = 2"
            >
              <MessageCircle class="h-3.5 w-3.5" :class="step === 2 ? 'text-emerald-600' : 'text-ink-muted'" aria-hidden="true" />
              <span>2. Enviar Comprovante</span>
            </button>
          </div>

          <!-- PASSO 1: GERADOR EMV + QR CODE -->
          <div v-if="step === 1" class="space-y-4 p-5 sm:p-6">
            <!-- Upsell sutil se estiver no Básico -->
            <div
              v-if="alternatePlan"
              class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-blue-electric/25 bg-ice-tint/70 px-3.5 py-2.5 text-xs"
            >
              <span class="inline-flex items-center gap-1.5 font-bold text-cobalt">
                <Sparkles class="h-3.5 w-3.5 shrink-0 text-blue-electric" aria-hidden="true" />
                <span>Quer levar o <strong>{{ alternatePlan.name }}</strong> (R$ {{ alternatePlan.priceFormatted }})?</span>
              </span>
              <button
                type="button"
                class="cursor-pointer rounded-full bg-navy-deep px-3 py-1 text-[0.68rem] font-extrabold text-cyan-glow uppercase transition-colors hover:bg-cobalt"
                @click="emit('select-plan', alternatePlan.id)"
              >
                Trocar agora
              </button>
            </div>

            <!-- QR Code Central + Dados EMV -->
            <div class="rounded-2xl border border-cobalt/15 bg-ice-white p-4">
              <div class="flex flex-col items-center gap-4 sm:flex-row">
                <div class="flex shrink-0 flex-col items-center">
                  <div class="rounded-2xl border-2 border-cobalt/15 bg-white p-2.5 shadow-xs">
                    <img
                      v-if="qrDataUrl"
                      :src="qrDataUrl"
                      :alt="`QR Code Pix EMV de R$ ${plan.priceFormatted} — ${plan.name}`"
                      width="156"
                      height="156"
                      class="block h-[148px] w-[148px]"
                    />
                  </div>
                  <span class="mt-1.5 inline-flex items-center gap-1 text-[0.66rem] font-bold text-ink-muted">
                    <Smartphone class="h-3 w-3 text-blue-electric" aria-hidden="true" />
                    Escaneie no app do banco
                  </span>
                </div>

                <div class="w-full min-w-0 flex-1 space-y-2.5 text-left">
                  <div class="w-full min-w-0">
                    <span class="block text-[0.68rem] font-extrabold tracking-wide text-cobalt uppercase">
                      Pix Copia e Cola (EMV · BR Code)
                    </span>
                    <div class="mt-1 flex w-full max-w-full items-center overflow-hidden rounded-xl border border-cobalt/15 bg-white px-3 py-2">
                      <code class="block w-full min-w-0 truncate font-mono text-[0.72rem] font-semibold text-navy-deep select-all">
                        {{ emvPayload }}
                      </code>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                    <span>
                      Chave CNPJ: <strong class="font-mono text-navy-deep select-all">{{ COMPANY_INFO.pixKey }}</strong>
                    </span>
                    <button
                      type="button"
                      class="cursor-pointer font-bold text-blue-electric underline underline-offset-2 hover:text-cobalt"
                      @click="copyCnpj"
                    >
                      {{ copiedCnpj ? 'CNPJ copiado!' : 'Copiar só CNPJ' }}
                    </button>
                  </div>

                  <p class="text-[0.7rem] leading-snug text-ink-muted">
                    Favorecido: <strong class="text-navy-deep">{{ COMPANY_INFO.legalName }}</strong>
                  </p>
                </div>
              </div>
            </div>

            <!-- Botão Copiar Copia e Cola -->
            <button
              type="button"
              class="btn-mcp-convert btn-mcp-lg w-full"
              :class="{ 'is-copied': copiedEmv }"
              @click="copyEmv"
            >
              <Check v-if="copiedEmv" class="h-4 w-4 shrink-0 text-cyan-glow" aria-hidden="true" />
              <Copy v-else class="h-4 w-4 shrink-0 text-emerald-100" aria-hidden="true" />
              <span>
                {{
                  copiedEmv
                    ? 'Código Pix copiado!'
                    : `Copiar Pix · R$ ${plan.priceFormatted}`
                }}
              </span>
            </button>

            <!-- Botão para ir ao Passo 2 -->
            <button
              type="button"
              class="w-full cursor-pointer rounded-full border-2 px-5 py-3.5 text-center text-sm font-extrabold transition-all duration-200"
              :class="
                copiedEmv
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm hover:bg-emerald-100'
                  : 'border-cobalt/20 bg-white text-navy-deep hover:border-blue-electric hover:bg-ice-white'
              "
              @click="goToWhatsAppStep"
            >
              <span class="inline-flex items-center justify-center gap-2">
                <span>Já fiz o Pix · Ir para o WhatsApp</span>
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </span>
            </button>

            <p class="flex items-center justify-center gap-1.5 text-center text-[0.72rem] text-ink-muted">
              <ShieldCheck class="h-3.5 w-3.5 shrink-0 text-blue-electric" aria-hidden="true" />
              <span>Pagamento estático oficial BACEN · Garantia de 7 dias</span>
            </p>
          </div>

          <!-- PASSO 2: REDIRECIONAMENTO WA.ME COM MENSAGEM AUTOMÁTICA -->
          <div v-else class="space-y-4 p-5 sm:p-6">
            <div class="flex items-start gap-3 rounded-2xl border border-emerald-500/35 bg-emerald-50 p-4">
              <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <MessageCircle class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <strong class="block text-sm font-extrabold text-emerald-950 sm:text-base">
                  Último passo: envie o comprovante no WhatsApp
                </strong>
                <p class="mt-1 text-xs leading-relaxed text-emerald-900/85">
                  Ao clicar no botão abaixo, você será levado direto ao nosso WhatsApp <strong>{{ COMPANY_INFO.phone }}</strong> com a mensagem abaixo já preenchida automaticamente. Basta enviar e anexar seu comprovante!
                </p>
              </div>
            </div>

            <div class="rounded-2xl border border-cobalt/15 bg-ice-white p-4">
              <span class="mb-1.5 block text-[0.68rem] font-extrabold tracking-wide text-cobalt uppercase">
                Mensagem automática pronta:
              </span>
              <p class="rounded-xl bg-white p-3 text-xs leading-relaxed font-medium text-navy-deep shadow-xs sm:text-sm">
                "{{ plan.whatsappMessage }}"
              </p>
            </div>

            <a
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-mcp-convert btn-mcp-lg group w-full"
            >
              <MessageCircle class="h-4 w-4 shrink-0 text-emerald-100" aria-hidden="true" />
              <span>Abrir WhatsApp e enviar comprovante</span>
              <span class="btn-mcp-arrow-badge btn-mcp-arrow-badge--emerald">
                <ArrowRight class="btn-mcp-arrow-icon h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>

            <button
              type="button"
              class="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 py-2 text-xs font-bold text-ink-muted transition-colors hover:text-cobalt"
              @click="step = 1"
            >
              <ArrowLeft class="h-3.5 w-3.5" aria-hidden="true" />
              <span>Voltar para o QR Code / Copia e Cola</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
