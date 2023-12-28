<script setup lang="ts">
const props = defineProps<{
  onSubmit: (event: Event) => void;
}>();
</script>

<template>
  <form @submit="props.onSubmit">
    <input type="text" name="string" data-testid="string" />
    <input type="number" name="number" data-testid="number" />
    <input type="checkbox" name="boolean" data-testid="boolean" />
    <input type="date" name="date" data-testid="date" />
    <button type="submit">SUBMIT</button>
  </form>
</template>
