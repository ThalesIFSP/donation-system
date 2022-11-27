<template>
  <q-form ref="editForm" @submit="handleSignIn" class="row">
    <q-card
      v-if="!!formError && !emailError && !passwordError"
      class="bg-red text-white q-my-md shadow-0"
    >
      <q-card-section>
        <q-icon name="warning" color="white" class="q-mr-sm" />

        {{ dig(formError, ["error", "message"]) || dig(formError, ["error"]) }}
      </q-card-section>
    </q-card>

    <h4 class="q-ma-lg">Instituição</h4>

    <!-- Line 1 Nome -->
    <div class="row col-12">
      <div class="col-3 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Logo</span>
        <q-file
          color="#4161d3"
          outlined
          v-model="logo"
          label="Logo 150x150 pixels"
          @update:model-value="(val) => updateFile(val)"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
      <div class="col-7 q-ma-lg q-px-lg">
        <img
          alt="Logo image."
          :src="logoUrl"
          style="width: 250px; height: 250px"
        />
      </div>
    </div>

    <!-- Line 1 Nome -->
    <div class="row col-12">
      <div class="col-7 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Nome da Instituição</span>
        <q-input
          placeholder="Nome"
          class="poppins fnt-size-18"
          v-model="name"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />
      </div>
    </div>

    <!-- Line 2 EMAIL -->
    <div class="row col-12">
      <div class="col-11 q-ma-lg q-px-lg">
        <span class="fnt-regular fnt-size-20">Descrição</span>
        <q-input
          type="textarea"
          placeholder="Descrição da instituição"
          class="poppins fnt-size-18"
          v-model="description"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
          outlined
        />
      </div>
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

    <!-- Line 5 Botão Editar -->
    <div class="row col-12 q-mb-xl">
      <span class="col-3"></span>
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
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "OrganizationPage",
  data() {
    const handlingEdit = ref(false);

    return {
      // Loading variables
      passwordVisible: false,
      handlingEdit,

      // Form variables
      name: null,
      description: null,
      file: null,
      cep: null,
      city: null,
      uf: null,
      street: null,
      number: null,
      district: null,

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
    const logo = ref(null);
    const logoUrl = ref("");

    return {
      logo,
      logoUrl,

      updateFile(val) {
        logoUrl.value = URL.createObjectURL(logo.value);
      },
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
          }, 3000);
        } else {
        }
      });
    },
  },
});
</script>
