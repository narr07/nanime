<script setup lang="ts">
import { createMotionPath, morphTo } from '#nanime/proxies/svg'

const pathEl = useTemplateRef<SVGPathElement>('walkPath')

// Draws the ground line in before the walker starts moving.
useAnimate(pathEl, () => {
  const length = pathEl.value?.getTotalLength() ?? 0
  return {
    strokeDasharray: `${length}`,
    strokeDashoffset: [length, 0],
    duration: 900,
    ease: 'inOutQuad',
  }
})

// #walk-path only exists once the SVG has mounted, so createMotionPath is
// called inside this getter rather than at setup time.
useAnimate('.walker', () => {
  const { translateX, translateY } = createMotionPath('#walk-path')
  return {
    translateX,
    translateY,
    duration: 4000,
    delay: 900,
    ease: 'linear',
    loop: true,
    alternate: true,
  }
})

useAnimate('.walker-bounce', {
  translateY: [0, -7, 0],
  duration: 420,
  delay: 900,
  loop: true,
  ease: 'inOutQuad',
})

useAnimate('.walker-head', () => ({
  d: morphTo('.walker-head-squash'),
  duration: 420,
  delay: 900,
  loop: true,
  alternate: true,
  ease: 'inOutQuad',
}))

// Two pivoting groups so each leg swings from its own hip point (fill-box
// makes transform-origin: 0 0 mean the leg's own top, not the SVG's).
useAnimate('.walker-leg-a', {
  rotate: [-16, 16, -16],
  duration: 840,
  delay: 900,
  loop: true,
  ease: 'inOutQuad',
})

useAnimate('.walker-leg-b', {
  rotate: [16, -16, 16],
  duration: 840,
  delay: 900,
  loop: true,
  ease: 'inOutQuad',
})
</script>

<template>
  <ExampleWrapper status="A character walks the path">
    <svg
      viewBox="0 0 400 180"
      class="walker-scene"
    >
      <path
        id="walk-path"
        ref="walkPath"
        d="M 30 140 Q 110 90 190 140 Q 270 190 350 140"
        class="ground-path"
        fill="none"
      />

      <path
        class="walker-head-squash"
        d="M -13,-54 A 13,7 0 1,0 13,-54 A 13,7 0 1,0 -13,-54 Z"
        opacity="0"
      />

      <g class="walker">
        <g class="walker-bounce">
          <g transform="translate(-4,-22)">
            <g class="walker-leg-pivot walker-leg-a">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="22"
                class="walker-leg"
              />
            </g>
          </g>
          <g transform="translate(4,-22)">
            <g class="walker-leg-pivot walker-leg-b">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="22"
                class="walker-leg"
              />
            </g>
          </g>
          <rect
            x="-11"
            y="-46"
            width="22"
            height="24"
            rx="9"
            class="walker-body"
          />
          <path
            d="M -10,-54 A 10,10 0 1,0 10,-54 A 10,10 0 1,0 -10,-54 Z"
            class="walker-head"
          />
          <circle
            cx="-4"
            cy="-56"
            r="1.4"
            class="walker-eye"
          />
          <circle
            cx="4"
            cy="-56"
            r="1.4"
            class="walker-eye"
          />
        </g>
      </g>
    </svg>
  </ExampleWrapper>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.walker-scene {
  @apply w-full h-44 sm:h-56;
}

.ground-path {
  @apply stroke-primary/50;
  stroke-width: 3;
  stroke-linecap: round;
}

.walker-leg-pivot {
  transform-box: fill-box;
  transform-origin: 0 0;
}

.walker-leg {
  @apply stroke-primary;
  stroke-width: 5;
  stroke-linecap: round;
}

.walker-body,
.walker-head {
  @apply fill-primary;
}

.walker-eye {
  @apply fill-black;
}
</style>
