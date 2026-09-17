<script setup lang="ts">
import { tryOnScopeDispose } from '@vueuse/core'
import { spring } from '#nanime/easings'

const DISMISS_THRESHOLD = 90
const EXIT_DURATION = 350

const cards = ['01', '02', '03', '04', '05']
const currentIndex = ref(0)
const current = computed(() => cards[currentIndex.value % cards.length])

const peekCards = computed(() => [
  { offset: 2, depth: 2 },
  { offset: 1, depth: 1 },
].map(({ offset, depth }) => ({
  label: cards[(currentIndex.value + offset) % cards.length],
  style: {
    transform: `translate(-50%, calc(-50% + ${depth * 6}px)) scale(${1 - depth * 0.04})`,
  },
})))

const cardHandle = useTemplateRef('cardHandle')
const tilt = ref(0)

// A plain reactive object, not the handle itself: useDraggable already
// writes transform on the handle every frame, so the fly-off tween runs
// on this child value instead of fighting those writes.
const exit = reactive({ x: 0, rotate: 0, opacity: 1 })
const exitTo = useAnimatable(exit, {
  x: 0,
  rotate: 0,
  opacity: 1,
  duration: EXIT_DURATION,
  ease: 'inQuad',
})

const cardStyle = computed(() => ({
  transform: `translateX(${exit.x}px) rotate(${tilt.value + exit.rotate}deg)`,
  opacity: exit.opacity,
}))

let origin = 0
let dismissTimer: ReturnType<typeof setTimeout> | undefined

const draggable = useDraggable(cardHandle, {
  y: false,
  snap: [0],
  releaseEase: spring({ bounce: 0.2, duration: 500 }),
  onGrab: (self) => {
    origin = self.x
  },
  onUpdate: (self) => {
    tilt.value = (self.x - origin) / 14
  },
  onRelease: (self) => {
    const moved = self.x - origin
    if (Math.abs(moved) > DISMISS_THRESHOLD) dismiss(moved > 0 ? 1 : -1)
  },
})

function dismiss(direction: 1 | -1) {
  draggable.stop()
  exitTo.x?.(direction * 300)
  exitTo.rotate?.(direction * 20)
  exitTo.opacity?.(0)

  clearTimeout(dismissTimer)
  dismissTimer = setTimeout(() => {
    currentIndex.value++
    tilt.value = 0
    exit.x = 0
    exit.rotate = 0
    exit.opacity = 1
    draggable.reset()
  }, EXIT_DURATION)
}

tryOnScopeDispose(() => clearTimeout(dismissTimer))
</script>

<template>
  <ExampleWrapper status="Drag the card left or right">
    <div class="swipe-viewport">
      <div
        v-for="peek in peekCards"
        :key="peek.label"
        class="swipe-peek"
        :style="peek.style"
      >
        {{ peek.label }}
      </div>

      <div
        ref="cardHandle"
        class="swipe-card-handle"
      >
        <div
          class="swipe-card"
          :style="cardStyle"
        >
          {{ current }}
        </div>
      </div>
    </div>
  </ExampleWrapper>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.swipe-viewport {
  @apply relative flex items-center justify-center overflow-hidden;
  @apply w-full h-56 sm:h-64 rounded-lg bg-primary/5 border border-primary/20;
}

.swipe-peek {
  @apply absolute left-1/2 top-1/2 w-32 h-44 rounded-xl select-none;
  @apply grid place-items-center font-mono font-bold text-black/50 bg-primary/40;
}

.swipe-card-handle {
  @apply relative z-10 cursor-grab active:cursor-grabbing select-none;
  touch-action: none;
}

.swipe-card {
  @apply w-32 h-44 rounded-xl bg-primary text-black shadow-md;
  @apply grid place-items-center font-mono font-bold text-lg;
}
</style>
