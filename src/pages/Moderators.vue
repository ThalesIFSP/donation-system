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
        <div class="text-h6">{{ moderators[selected].name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form ref="editForm" @submit="handleSignIn" class="row">
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
              />
            </div>
            <div class="col-1 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">UF</span>
              <q-input
                placeholder="SP"
                class="poppins fnt-size-18"
                v-model="uf"
                lazy-rules
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
              />
            </div>
            <div class="col-4 q-ma-lg q-px-lg">
              <span class="fnt-regular fnt-size-20">Bairro</span>
              <q-input
                placeholder="Bairro São Padrião"
                class="poppins fnt-size-18"
                v-model="district"
                lazy-rules
              />
            </div>
          </div>

          <div class="row col-12">
            <span class="col-3"></span>
            <q-btn
              color="red"
              @click="dialog = false"
              class="poppins text-h4 col-1 text-black"
              no-caps
              outline
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
          v-model="canEdit"
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
    <q-item
      clickable
      v-ripple
      class="q-ma-sm"
      @click="
        dialog = true;
        selected = index;
      "
    >
      <q-item-section>{{ item.name }}</q-item-section>
      <q-item-section avatar>
        <q-icon style="color: #4161d3" name="edit" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ModeratorsPage",
  data() {
    const handlingEdit = ref(false);

    return {
      // Loading variables
      passwordVisible: false,
      handlingEdit,

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
  setup() {
    const moderators = [
      { name: "Thales Mantovani Silva" },
      { name: "Raissa Sabino Cunha" },
      { name: "Paulo Moraes" },
      { name: "Juliano Torres" },
    ];
    return {
      moderators,
      dialog: ref(false),
      addDialog: ref(false),
      maximizedToggle: ref(true),
      selected: ref(0),
      canEdit: ref(false),
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
    handleEditInfo() {
      this.$refs.editForm.validate(false).then((valid) => {
        if (valid) {
          this.handlingEdit = true;
          this.formError = null;

          setTimeout(() => {
            this.handlingEdit = false;
            this.dialog = false;
          }, 3000);
        } else {
        }
      });
    },
    addNewModerator() {
      this.addDialog = false;
    },
  },
});
</script>
