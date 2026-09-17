<script setup lang="ts">
defineProps<{
  suit: 'heart' | 'diamond' | 'club' | 'spade'
}>()

const heartPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    class="suit-icon"
    fill="currentColor"
  >
    <path
      v-if="suit === 'heart'"
      :d="heartPath"
    />

    <polygon
      v-else-if="suit === 'diamond'"
      points="12,2 20,12 12,22 4,12"
    />

    <g v-else-if="suit === 'club'">
      <circle
        cx="12"
        cy="8"
        r="4.2"
      />
      <circle
        cx="7.6"
        cy="13.5"
        r="4.2"
      />
      <circle
        cx="16.4"
        cy="13.5"
        r="4.2"
      />
      <polygon points="10,15.5 14,15.5 13,21 11,21" />
    </g>

    <g v-else>
      <path
        :d="heartPath"
        transform="scale(1,-1) translate(0,-24)"
      />
      <polygon points="10,15.5 14,15.5 13,21 11,21" />
    </g>
  </svg>
</template>

<style scoped>
.suit-icon {
  width: 2rem;
  height: 2rem;
}
</style>
