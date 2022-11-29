<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="text-black" style="background-color: white">
      <q-bar>
        <q-space />

        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-ml-lg">
        <h4>
          {{ !selected.nameless ? selected.user.name : "Doador anônimo" }} -
          {{ selected.title }}
        </h4>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <h4 class="q-ma-lg">
          Status:
          <span :style="{ color: statusColor[selected.status] }">{{
            statusHuman[selected.status]
          }}</span>
        </h4>
        <h4 class="q-ma-lg">
          Retirada:
          <span>
            {{ selected.pickUp ? "Sim" : "Não" }}
          </span>
        </h4>
        <p class="q-ma-lg" style="font-size: 24px">
          Endereço:
          {{
            selected.pickUp
              ? selected.address.street +
                ", " +
                selected.address.number +
                ". " +
                selected.address.cep +
                ". " +
                selected.address.city +
                " - " +
                selected.address.state
              : "irá entregar na instituição"
          }}
        </p>

        <q-list
          bordered
          class="q-ma-xl"
          v-for="(item, index) in selected.itemList"
          :key="index"
        >
          <q-item v-ripple class="q-ma-sm fnt-size-20" clickable="false">
            <q-item-section>
              <img
                :src="'data:image/png;base64,' + item.img"
                style="width: 400px; height: 300px"
              />
            </q-item-section>
            <q-item-section>
              <p style="font-size: 24px">Descrição:</p>
              <p>{{ item.desc }}</p>
              <p style="font-size: 24px; font-weight: 500">
                Validade:
                {{
                  item.expirationDate
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")
                }}
              </p>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="row col-12">
          <span class="col-3"></span>
          <q-btn
            @click="dialog = false"
            class="poppins text-h4 col-6"
            no-caps
            color="primary"
          >
            Fechar
          </q-btn>
          <span class="col-3"></span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <h4 class="q-ma-lg">Historico de Solicitações para Instituição</h4>

  <q-list
    bordered
    class="q-ma-xl"
    v-for="(item, index) in solicitationList"
    :key="index"
  >
    <q-item
      v-ripple
      class="q-ma-sm fnt-size-20"
      clickable
      @click="selectSolicitation(JSON.stringify(item))"
    >
      <q-item-section>
        <span :style="{ color: statusColor[item.status] }">
          {{ statusHuman[item.status] }}
        </span>
        {{
          !item.solicitation.nameless
            ? item.solicitation.user.name
            : "Doador anônimo"
        }}
        - {{ item.solicitation.title }}
      </q-item-section>
      <q-item-section side>
        Data:
        {{ item.dateCreate.split("T")[0].split("-").reverse().join("/") }} às
        {{ item.dateCreate.split("T")[1].split(".")[0] }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { api } from "src/boot/axios";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DonationsPage",
  data() {
    const handlingEdit = ref(false);

    return {
      // Loading variables
      passwordVisible: false,
      handlingEdit,
      selected: null,
      dialog: false,
      maximizedToggle: true,
      solicitationList: [],
      statusHuman: {
        OPENED: "Aberta",
        ACCEPTED: "Aceita",
        REFUSED: "Negada",
        CANCELED: "Cancelada",
        WAITING_DELIVERY: "Aguardando entrega",
        DONE: "Finalizada",
      },
      statusColor: {
        OPENED: "#FF8652",
        ACCEPTED: "#2390F4",
        REFUSED: "#FF0000",
        CANCELED: "#FF0000",
        WAITING_DELIVERY: "#5A959A",
        DONE: "#589235",
      },
      // Error variables
      formError: null,
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));

    api
      .get("/api/moderator/" + user.moderatorId, {
        auth: { username: "thalesinfoifsp@gmail.com", password: "thaleslindo" },
      })
      .then((res) => {
        const data = res.data;

        api
          .get(`/api/solicitation/charity/${data.charity.idt}/get-all`, {
            auth: {
              username: "thalesinfoifsp@gmail.com",
              password: "thaleslindo",
            },
          })
          .then((res) => {
            const data = res.data;
            console.log(data);
            this.solicitationList = data;
          });
      });
  },

  methods: {
    selectSolicitation(itemString) {
      const item = JSON.parse(itemString);
      api
        .get(`/api/solicitation/${item.solicitation.id}`, {
          auth: {
            username: "thalesinfoifsp@gmail.com",
            password: "thaleslindo",
          },
        })
        .then((res) => {
          const data = res.data;
          this.selected = data;
          this.dialog = true;
        });
    },
  },
});
</script>
