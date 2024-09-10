<script setup>
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import PostCard from "@/components/PostCard.vue";
import PostForm from "@/components/PostForm.vue";

const props = defineProps(["page"]);
const posts = ref(null);
const isOpen = ref(false);

//  props.page.EntityId
const getPosts = () => {
  return ZOHO.CRM.CONNECTION.invoke("crm_oauth_connection", {
    method: "GET",
    url: "https://crm.zoho.eu/crm/v3/TestPosts?fields=Name,Type,Body,Image&sort_by=Created_Time",
  }).then(function (data) {
    posts.value = data.details.statusMessage.data;

    posts.value.forEach((post) => {
      if (post.Image) {
        ZOHO.CRM.API.getFile({
          id: post.Image[0].File_Id,
        }).then(function (data) {
          post.imageURL = URL.createObjectURL(data); // base64 encoded image
        });
      }
    });
  });
};

getPosts();

// ZOHO.CRM.API.getAllRecords({
//   Entity: "TestPosts",
//   sort_order: "asc",
//   per_page: 2,
//   page: 1,
// }).then(function (data) {
//   console.log("data", data);
// });

// ZOHO.CRM.API.getRecord({
//   Entity: "TestPosts",
//   RecordID: "740632000000789006",
//   approved: "true",
// }).then(function (data) {
//   console.log("data", data);
// });
</script>

<template>
  <Collapsible v-model:open="isOpen" class="mb-5 px-4">
    <div class="flex w-full justify-end">
      <CollapsibleTrigger asChild>
        <Button size="sm">
          <ChevronDown v-if="!isOpen" class="mr-2 size-4" />
          <ChevronUp v-else class="mr-2 size-4" /> New Post
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent>
      <PostForm :postHandler="getPosts" :userId="props.page.EntityId" />
    </CollapsibleContent>
  </Collapsible>

  <section class="grid grid-cols-4 gap-4 px-4">
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </section>
</template>
