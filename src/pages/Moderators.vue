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

      <q-card-section>
        <div class="text-h6">{{ name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form ref="editForm" @submit="handleEditInfo" class="row">
          <q-card
            v-if="!!formError && !emailError && !passwordError"
            class="bg-red text-white q-my-md shadow-0"
          >
            <q-card-section>
              <q-icon name="warning" color="white" class="q-mr-sm" />

              {{
                dig(formError, ["error", "message"]) ||
                dig(formError, ["error"])
              }}
            </q-card-section>
          </q-card>

          <h4 class="q-ma-lg">Permissões</h4>

          <!-- Line 1 Nome -->
          <div class="row col-12 q-ma-lg q-px-lg">
            <q-checkbox
              v-model="canEdit"
              label="Dar permissão de administrador"
              class="fnt-size-20"
              size="md"
            />
          </div>

          <h4 class="q-ma-lg">Endereço</h4>

          <!-- Line 3 CEP -->
          <div class="row col-12">
            <div class="col-3 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">CEP</span>
              <q-input
                placeholder="CEP"
                class="poppins fnt-size-18"
                v-model="cep"
                :error="!!emailError"
                :error-message="emailError"
                lazy-rules
                disable
              />
            </div>
            <div class="col-4 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">Cidade</span>
              <q-input
                placeholder="Cidade"
                class="poppins fnt-size-18"
                v-model="city"
                :error="!!emailError"
                :error-message="emailError"
                lazy-rules
                disable
              />
            </div>
            <div class="col-1 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">UF</span>
              <q-input
                placeholder="SP"
                class="poppins fnt-size-18"
                v-model="uf"
                lazy-rules
                disable
              />
            </div>
          </div>

          <!-- Line 4 Rua -->
          <div class="row col-12">
            <div class="col-4 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">Rua</span>
              <q-input
                placeholder="Rua XxxxX Xx XXxxxxxx"
                class="poppins fnt-size-18"
                v-model="street"
                :error="!!emailError"
                :error-message="emailError"
                lazy-rules
                disable
              />
            </div>
            <div class="col-1 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">Nº</span>
              <q-input
                placeholder="Número"
                class="poppins fnt-size-18"
                v-model="number"
                :error="!!emailError"
                :error-message="emailError"
                lazy-rules
                disable
              />
            </div>
            <div class="col-4 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">Bairro</span>
              <q-input
                placeholder="Bairro São Padrião"
                class="poppins fnt-size-18"
                v-model="district"
                lazy-rules
                disable
              />
            </div>
          </div>

          <div class="row col-12">
            <span class="col-3"></span>
            <q-btn
              @click="dialog = false"
              class="poppins text-h4 col-1 text-black"
              no-caps
              flat
              style="background-color: transparent"
            >
              Voltar
            </q-btn>
            <span class="col-1"></span>

            <q-btn
              :loading="handlingEdit"
              color="primary"
              @click="handleEditInfo(3)"
              class="poppins text-h4 col-4"
              no-caps
            >
              Editar
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Editando...
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="addDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Adicionar novo moderador</div>
      </q-card-section>
      <q-card
        v-if="!!formError && !emailError && !passwordError"
        class="bg-red text-white q-my-md shadow-0"
      >
        <q-card-section>
          <q-icon name="warning" color="white" class="q-mr-sm" />

          {{
            dig(formError, ["error", "message"]) || dig(formError, ["error"])
          }}
        </q-card-section>
      </q-card>

      <q-card-section class="q-pt-none">
        <q-input
          placeholder="E-mail"
          class="poppins fnt-size-16"
          v-model="email"
          :rules="formRules.email"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
          aria-autocomplete="email"
          @keyup.enter="addDialog = false"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-checkbox
          v-model="canEditCreate"
          label="Permitir edição"
          class="fnt-size-18"
          size="md"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Fechar" @click="addDialog = false" />
        <q-btn flat label="Adicionar" @click="addNewModerator()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <h4 class="q-ma-lg">
    Lista de Moderadores
    <q-btn
      square
      color="primary"
      icon="add"
      padding="xs"
      @click="addDialog = true"
    />
  </h4>

  <q-list
    bordered
    class="q-ma-xl"
    v-for="(item, index) in moderators"
    :key="index"
  >
    <q-item v-ripple class="q-ma-sm">
      <q-item-section
        @click="selectModerator(JSON.stringify(item))"
        style="cursor: pointer"
        >{{ item.user.name }}</q-item-section
      >
      <q-item-section
        avatar
        @click="selectModerator(JSON.stringify(item))"
        style="cursor: pointer"
      >
        <q-icon style="color: #4161d3" name="edit" />
      </q-item-section>
      <q-item-section
        avatar
        @click="deleteModerator(JSON.stringify(item))"
        style="cursor: pointer"
      >
        <q-icon style="color: red" name="remove" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { api } from "src/boot/axios";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ModeratorsPage",
  data() {
    const handlingEdit = ref(false);

    return {
      // Loading variables
      passwordVisible: false,
      handlingEdit,

      idCharity: null,
      moderatorCanEdit: null,

      // Form variables
      name: null,
      cnpj: null,
      cep: null,
      city: null,
      uf: null,
      street: null,
      number: null,
      district: null,
      email: null,
      password: null,
      moderators: [],

      formRules: this.parseFormRules([
        {
          field: "email",

          name: "E-mail",

          required: true,

          extraRules: [
            (v) =>
              !v ||
              /.+@.+/.test(v) ||
              (!!v && v.length == 0) ||
              "Endereço de e-mail inválido",
          ],
        },

        {
          field: "password",

          name: "Senha",

          required: true,
        },
      ]),

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
        this.moderatorCanEdit = data.canEdit;
        this.idCharity = data.charity.idt;
        api
          .get(`/api/moderator/charity/${data.charity.idt}/get-all`, {
            auth: {
              username: "thalesinfoifsp@gmail.com",
              password: "thaleslindo",
            },
          })
          .then((res) => {
            const data = res.data;
            this.moderators = data;
          });
      });
  },
  setup() {
    return {
      dialog: ref(false),
      addDialog: ref(false),
      maximizedToggle: ref(true),
      selected: ref(0),
      canEdit: ref(false),
      canEditCreate: ref(false),
    };
  },
  computed: {
    emailError() {
      if (this.formError) {
        let error = this.formError?.error;

        return error && error?.attribute == "email"
          ? error.full_message || error.message
          : null;
      } else {
        return null;
      }
    },

    passwordError() {
      if (this.formError) {
        let error = this.formError?.error;

        return error && error?.attribute == "password"
          ? error.full_message || error.message
          : null;
      } else {
        return null;
      }
    },
  },

  methods: {
    handleRefresh() {
      const user = JSON.parse(localStorage.getItem("user"));

      api
        .get("/api/moderator/" + user.moderatorId, {
          auth: {
            username: "thalesinfoifsp@gmail.com",
            password: "thaleslindo",
          },
        })
        .then((res) => {
          const data = res.data;
          this.idCharity = data.charity.idt;
          api
            .get(`/api/moderator/charity/${data.charity.idt}/get-all`, {
              auth: {
                username: "thalesinfoifsp@gmail.com",
                password: "thaleslindo",
              },
            })
            .then((res) => {
              const data = res.data;
              this.moderators = data;
            });
        });
    },
    handleEditInfo() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (this.selected.moderatorId === user.moderatorId) {
        alert("Não é possível alterar a si próprio.");
        return;
      }
      if (!this.moderatorCanEdit) {
        alert("Você não tem permissão para editar.");
        return;
      }

      this.$refs.editForm.validate(false).then((valid) => {
        if (valid) {
          this.handlingEdit = true;
          this.formError = null;

          api
            .put(
              `/api/moderator/${this.selected.moderatorId}?idtChangeAgent=${user.moderatorId}&canEdit=${this.canEdit}`,
              {},
              {
                auth: {
                  username: "thalesinfoifsp@gmail.com",
                  password: "thaleslindo",
                },
              }
            )
            .then((res) => this.handleRefresh());

          this.handlingEdit = false;
          this.dialog = false;
        }
      });
    },
    addNewModerator() {
      if (this.email) {
        api
          .get("/api/user/email?email=" + this.email, {
            auth: {
              username: "thalesinfoifsp@gmail.com",
              password: "thaleslindo",
            },
          })
          .then((res) => {
            const data = res.data;
            api
              .post(
                "/api/moderator/create",
                {
                  canEdit: this.canEditCreate,
                  charityIdt: this.idCharity,
                  userIdt: data.idt,
                },
                {
                  auth: {
                    username: "thalesinfoifsp@gmail.com",
                    password: "thaleslindo",
                  },
                }
              )
              .then((res) => this.handleRefresh());
          });
        this.addDialog = false;
      }
    },
    selectModerator(itemString) {
      const item = JSON.parse(itemString);
      const user = item.user;
      this.selected = user;
      this.name = user.name;
      this.cnpj = user.document;
      this.cep = user.address.cep;
      this.city = user.address.city;
      this.uf = user.address.uf;
      this.street = user.address.street;
      this.number = user.address.number;
      this.district = user.address.district;
      this.dialog = true;
      this.canEdit = item.canEdit;
    },
    deleteModerator(itemString) {
      const item = JSON.parse(itemString);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!this.moderatorCanEdit) {
        alert("Você não tem permissão para excluir.");
        return;
      }

      if (item.user.idt === user.idt) {
        alert("Não é possível excluir a si próprio.");
        return;
      }
      const r = confirm("Tem certeza que deseja excluir esse moderador?");
      if (r) {
        api
          .delete(
            `/api/moderator/${item.user.moderatorId}?idtChangeAgent=${user.moderatorId}`,
            {
              auth: {
                username: "thalesinfoifsp@gmail.com",
                password: "thaleslindo",
              },
            }
          )
          .then((res) => this.handleRefresh());
      }
    },
  },
});
</script>
