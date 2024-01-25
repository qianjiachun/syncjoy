<script setup lang="ts">
const props = defineProps<{
  emoji: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="flex flex-col rounded-xl bg-[rgb(246,246,247)] p-6 text-[#3c3c43]">
    <div class="w-12 h-12 mb-5 bg-[rgb(231,232,236)] rounded-lg flex justify-center items-center text-2xl">{{ props.emoji }}</div>
    <div class="text-base font-bold mb-2">{{ props.title }}</div>
    <div class="text-sm flex-1">{{ props.description }}</div>
  </div>
</template>

<style scoped></style>
