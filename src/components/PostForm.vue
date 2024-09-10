<script setup>
import { ref } from "vue";
import { useForm, configure } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-vue-next";

// defineProps(["postHandler", "someprops"]);
const alert = ref(null);
const props = defineProps(["postHandler"]);

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: false,
});

const formSchema = toTypedSchema(
  z.object({
    Name: z
      .string()
      .min(8, { message: "Name must be at least 8 characters" })
      .max(50, { message: "Name must be less than 50 characters" }),
    Type: z.string(),
    Body: z
      .string()
      .min(8, { message: "Body must be at least 8 characters" })
      .optional(),
    Image: z
      .instanceof(File)
      .refine(
        (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        { message: "Please select an image file" },
      )
      .optional(),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const uploadImage = (image) => {
  const config = {
    CONTENT_TYPE: "multipart",
    PARTS: [
      {
        headers: {
          "Content-Disposition": "file;",
        },
        content: "__FILE__",
      },
    ],
    FILE: {
      fileParam: "content",
      file: image,
    },
  };
  return ZOHO.CRM.API.uploadFile(config).then((res) => res.data[0]);
};

const insertRecord = (values, image) => {
  ZOHO.CRM.CONNECTION.invoke("crm_oauth_connection", {
    method: "POST",
    url: "https://www.zohoapis.eu/crm/v3/TestPosts",
    parameters: {
      data: [
        {
          Name: values.Name,
          Type: values.Type,
          Body: values.Body,
          Image: image ? [{ Encrypted_Id: image.details.id }] : null,
        },
      ],
    },
  }).then((res) => {
    const { data, code, message } = res.details.statusMessage;
    alert.value = {
      code,
      message: data?.[0]?.message || message,
    };
    form.resetForm("Name", "Type", "Body", "Image");
    props.postHandler();
  });
};

const onSubmit = form.handleSubmit((values) => {
  const imagePromise = values.Image
    ? uploadImage(values.Image)
    : Promise.resolve(null);
  imagePromise.then((image) => insertRecord(values, image));
});
</script>

<template>
  <form @submit="onSubmit" class="mt-5 space-y-2 px-4">
    <Alert v-if="alert && alert.code == 'SUCCESS'" @click="alert = null">
      <Terminal class="size-4" />
      <AlertTitle class="capitalize">{{ alert.code.toLowerCase() }}</AlertTitle>
      <AlertDescription>{{ alert.message }}</AlertDescription>
    </Alert>

    <FormField v-slot="{ componentField }" name="Name">
      <FormItem>
        <FormLabel>Title</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="Type">
      <FormItem>
        <FormLabel>Type</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="External"> External </SelectItem>
            <SelectItem value="Internal"> Internal </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="Body">
      <FormItem>
        <FormLabel>Body</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="Image">
      <FormItem>
        <FormLabel>Image</FormLabel>
        <FormControl>
          <input type="file" v-bind="componentField" class="form-control" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" size="sm"> Submit </Button>
  </form>
</template>
