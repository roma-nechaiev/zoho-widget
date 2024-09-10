<script setup>
import { useFormField } from "./useFormField";
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});

const { formDescriptionId } = useFormField();
</script>

<template>
  <p
    :id="formDescriptionId"
    :class="cn('text-sm text-stone-500 dark:text-stone-400', props.class)"
  >
    <slot />
  </p>
</template>
