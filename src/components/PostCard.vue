<script setup>
import { Badge } from "@/components/ui/badge";
defineProps(["post"]);
</script>

<template>
  <div class="group space-y-3">
    <div class="relative">
      <div
        class="absolute right-2 top-2 z-10 flex items-center gap-x-3 text-xs"
      >
        <Badge>{{ post.Type }}</Badge>
      </div>
      <div
        class="aspect-h-2 aspect-w-2 bg-neytral-400 mx-auto w-full overflow-hidden rounded-md"
      >
        <img
          v-if="post.imageURL"
          :src="post.imageURL"
          :alt="post.Image[0].File_Name"
          class="size-full object-cover object-center"
          loading="lazy"
        />
        <img
          v-else
          src="/images/placeholder.webp"
          alt="placeholder"
          class="size-full object-cover object-center"
        />
      </div>
    </div>
    <div class="space-y-2">
      <h4
        class="truncate font-medium leading-none transition-colors group-hover:text-indigo-500"
      >
        {{ post.Name }}
      </h4>
      <p class="text-sm text-neutral-600">{{ post.Body }}</p>
    </div>
  </div>
</template>
