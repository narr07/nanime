<script setup lang="ts">
import { onScroll } from 'animejs/events'
import { stagger } from '#nanime/utils'
import { useMediaQuery } from '@vueuse/core'
import type { AnimationParams } from '#nanime/types'
import SuitIcon from './SuitIcon.vue'

const suits: Array<'spade' | 'heart' | 'diamond' | 'club'> = [
  'spade', 'heart', 'diamond', 'club', 'spade', 'heart', 'diamond', 'club', 'spade',
]

const isLandscape = useMediaQuery('(orientation: landscape)')

const landscapeVariant: AnimationParams = {
  transformOrigin: '50% 150%',
  y: { from: stagger(['-320%', '320%'], { from: 'center' }) },
  rotate: {
    to: stagger([-30, 30]),
    delay: stagger([0, 500], { from: 'last', start: 100 }),
    ease: 'inOut(3)',
  },
  x: ['-260%', stagger(['-18%', '18%'])],
  delay: stagger(30, { from: 'last' }),
  duration: 750,
}

const portraitVariant: AnimationParams = {
  y: ['420%', stagger(['18%', '-18%'])],
  rotate: {
    from: (_target, i) => (i ?? 0) % 2 ? '-18deg' : '18deg',
    ease: 'inOut(3)',
  },
  delay: stagger(35, { from: 'last' }),
}

const scrollProgress = ref(0)

useAnimate('.oss-card', () => ({
  ...(isLandscape.value ? landscapeVariant : portraitVariant),
  autoplay: onScroll({
    container: '.oss-viewport',
    target: '.oss-track',
    enter: 'top',
    leave: 'bottom',
    sync: 0.1,
    onUpdate: (self) => {
      scrollProgress.value = self.progress
    },
  }),
}))

const status = computed(() => {
  const layout = isLandscape.value ? 'landscape fan' : 'portrait drop'
  return `${layout} · ${Math.round(scrollProgress.value * 100)}% scrolled`
})
</script>

<template>
  <ExampleWrapper :status="status">
    <div class="oss-viewport">
      <div class="oss-track">
        <div class="oss-stage">
          <div class="oss-stack">
            <div
              v-for="(suit, i) in suits"
              :key="i"
              class="oss-card"
            >
              <SuitIcon :suit="suit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ExampleWrapper>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.oss-viewport {
  @apply relative w-full h-72 rounded-lg bg-primary/5 border border-primary/20 overflow-y-auto overflow-x-hidden;
}

.oss-track {
  height: 320%;
}

.oss-stage {
  @apply sticky top-0 h-72 flex items-center justify-center;
  perspective: 1000px;
  perspective-origin: 50%;
}

.oss-stack {
  --w: 5rem;
  --h: 7rem;
  @apply relative;
  transform-style: preserve-3d;
  width: var(--w);
  height: var(--h);
}

.oss-card {
  @apply absolute inset-0 size-full rounded-xl bg-primary text-black;
  @apply grid place-items-center select-none shadow-md;
  transform-origin: 50% 105% 0;
}
</style>
