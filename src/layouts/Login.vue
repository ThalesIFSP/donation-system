<template>
  <q-layout view="hHh Lpr lff">
    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <div id="content-page" :key="route.name">
            <component :is="Component" ref="component" />
          </div>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "LoginLayout",
};
</script>

<style lang="scss" scoped>
#q-app .q-layout {
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: 100vw 100vh;
  // background-color: #614ea6;

  .q-page-container {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;

    align-items: center;
    display: flex;
    justify-content: center;
  }
}

@media screen and (max-width: 800px) {
  .q-layout {
    background-size: contain;
  }
}
</style>
