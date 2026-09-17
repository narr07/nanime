<script setup lang="ts">
import type { ExampleAction, ExampleSlider } from '~/components/shared/ExampleWrapper.vue'

const DAY_MS = 24 * 60 * 60 * 1000
const SPEEDS = [0.25, 1, 4] as const

const currentTime = ref(Date.now() % DAY_MS)
const speedIndex = ref(1)
const isPlaying = ref(false)
const currentSpeed = computed(() => SPEEDS[speedIndex.value] ?? SPEEDS[0])

const timeline = useAnimeTimeline({
  autoplay: false,
  loop: true,
  playbackRate: currentSpeed.value,
  onUpdate: (self) => {
    currentTime.value = self.currentTime
  },
  onBegin: () => {
    isPlaying.value = true
  },
  onPause: () => {
    isPlaying.value = false
  },
})

// A Timeline's own constructor always starts `duration` at 0 and grows it
// from children added to it, a `duration` option in the params above is
// ignored. A single no-op entry with nothing but a duration establishes
// the 24-hour length instead. `add` and `seek` are both buffered chainable
// methods, safe to call immediately even though the instance doesn't
// exist until after mount (unlike a direct property write, which would be
// silently dropped).
timeline.add({ duration: DAY_MS })
timeline.seek(Date.now() % DAY_MS)

const totalSeconds = computed(() => currentTime.value / 1000)
const secondDeg = computed(() => (totalSeconds.value % 60) * 6)
const minuteDeg = computed(() => ((totalSeconds.value / 60) % 60) * 6)
const hourDeg = computed(() => ((totalSeconds.value / 3600) % 12) * 30)

function formatClock(ms: number) {
  const s = Math.floor(ms / 1000)
  const hh = String(Math.floor(s / 3600) % 24).padStart(2, '0')
  const mm = String(Math.floor(s / 60) % 60).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function cycleSpeed() {
  speedIndex.value = (speedIndex.value + 1) % SPEEDS.length
  timeline.speed = currentSpeed.value
}

const actions = computed<ExampleAction[]>(() => [
  {
    label: isPlaying.value ? 'Pause' : 'Play',
    run: () => (isPlaying.value ? timeline.pause() : timeline.play()),
  },
  {
    label: 'Reverse',
    run: () => timeline.reverse(),
  },
  {
    label: 'Restart',
    run: () => timeline.restart(),
  },
  {
    label: `Speed \xD7${currentSpeed.value}`,
    run: cycleSpeed,
  },
])

const slider = computed<ExampleSlider>(() => ({
  value: currentTime.value,
  min: 0,
  max: DAY_MS,
  step: 1000,
  onInput: (value) => {
    timeline.currentTime = value
  },
}))

const status = computed(() => `${formatClock(currentTime.value)} \xB7 \xD7${currentSpeed.value}`)
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :slider="slider"
    :status="status"
  >
    <div class="clock-face">
      <div
        class="clock-hand clock-hand-hour"
        :style="{ transform: `rotate(${hourDeg}deg)` }"
      />
      <div
        class="clock-hand clock-hand-minute"
        :style="{ transform: `rotate(${minuteDeg}deg)` }"
      />
      <div
        class="clock-hand clock-hand-second"
        :style="{ transform: `rotate(${secondDeg}deg)` }"
      />
      <div class="clock-center-dot" />
    </div>
  </ExampleWrapper>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.clock-face {
  @apply relative mx-auto rounded-full border-2 border-primary/30 bg-primary/5;
  width: 12rem;
  height: 12rem;
}

.clock-hand {
  @apply absolute left-1/2 top-1/2 rounded-full bg-primary;
  transform-origin: 0% 50%;
}

.clock-hand-hour {
  width: 3.2rem;
  height: 0.4rem;
  margin-top: -0.2rem;
}

.clock-hand-minute {
  width: 4.6rem;
  height: 0.3rem;
  margin-top: -0.15rem;
}

.clock-hand-second {
  @apply bg-black/60;
  width: 5.2rem;
  height: 0.1rem;
  margin-top: -0.05rem;
}

.clock-center-dot {
  @apply absolute left-1/2 top-1/2 rounded-full bg-black;
  width: 0.6rem;
  height: 0.6rem;
  margin-left: -0.3rem;
  margin-top: -0.3rem;
}
</style>
