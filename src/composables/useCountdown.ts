import { computed, onMounted, onUnmounted, ref } from 'vue'

function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0')
}

export function useCountdown() {
  const remainingSeconds = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  function updateRemaining() {
    const now = new Date()
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    )
    const diffMs = Math.max(0, endOfDay.getTime() - now.getTime())
    remainingSeconds.value = Math.floor(diffMs / 1000)
  }

  onMounted(() => {
    updateRemaining()
    timer = setInterval(updateRemaining, 1000)
  })

  onUnmounted(() => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  })

  const hours = computed(() => pad2(remainingSeconds.value / 3600))
  const minutes = computed(() => pad2((remainingSeconds.value % 3600) / 60))
  const seconds = computed(() => pad2(remainingSeconds.value % 60))
  const formatted = computed(() => `${hours.value}:${minutes.value}:${seconds.value}`)

  return {
    hours,
    minutes,
    seconds,
    formatted,
    remainingSeconds,
  }
}
