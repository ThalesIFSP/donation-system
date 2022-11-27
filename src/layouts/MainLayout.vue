<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: #4161d3">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <img
            alt="Sem desperdício sem fome logo."
            src="~assets/logoRetanguloBranco.png"
            style="width: 400px; height: 106px"
        /></q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="column justify-between no-wrap bg-grey-1"
    >
      <div class="text-h5 poppins">
        <q-list>
          <q-item-label header class="text-h4 poppins"> Navegar </q-item-label>

          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </div>
      <q-item class="column footer">
        <q-item-section>
          <q-item-label caption class="fnt-size-20">Contato</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="fnt-size-14 contactText"
            >semdesperdiciosemfome@gmail.com</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "MyProfile",
    caption: "Meus Dados",
    icon: "person",
    link: "my_profile",
  },
  {
    title: "Charity",
    caption: "Instituição",
    icon: "home",
    link: "organization",
  },
  {
    title: "Moderator",
    caption: "Moderadores",
    icon: "add_moderator",
    link: "moderators",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      active: ref(""),
    };
  },
});
</script>

<style scoped>
.footer {
  position: absolute;
  bottom: 2%;
}

.contactText {
  text-decoration: underline;
}
</style>
