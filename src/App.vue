<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { Buffer } from "buffer";

globalThis.Buffer = Buffer;
export default defineComponent({
  name: "App",
});
</script>
